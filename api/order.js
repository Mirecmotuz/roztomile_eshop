const EMAILJS_API_URL = 'https://api.emailjs.com/api/v1.0/email/send';

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_OWNER_TEMPLATE_ID = process.env.EMAILJS_OWNER_TEMPLATE_ID;
const EMAILJS_CUSTOMER_TEMPLATE_ID = process.env.EMAILJS_CUSTOMER_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_ACCESS_TOKEN = process.env.EMAILJS_PRIVATE_KEY;
const STORE_OWNER_EMAIL = process.env.VITE_OWNER_EMAIL;
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const STORE_IBAN = process.env.VITE_STORE_IBAN;
const ACCOUNT_NUMBER = process.env.VITE_ACCOUNT_NUMBER;
const BANK_CODE = process.env.VITE_BANK_CODE;

const IP_WINDOW_MS = 10 * 60 * 1000; // 10 minút
const IP_MAX_REQUESTS =
  Number(process.env.ORDER_RATE_LIMIT_IP_MAX) > 0
    ? Number(process.env.ORDER_RATE_LIMIT_IP_MAX)
    : 50;
const EMAIL_WINDOW_MS = 60 * 60 * 1000; // 1 hodina
const EMAIL_MAX_REQUESTS =
  Number(process.env.ORDER_RATE_LIMIT_EMAIL_MAX) > 0
    ? Number(process.env.ORDER_RATE_LIMIT_EMAIL_MAX)
    : 3;

const ipRequests = new Map();
const emailRequests = new Map();

function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function getClientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.length > 0) {
    return xf.split(',')[0].trim();
  }
  if (Array.isArray(xf) && xf.length > 0) {
    return xf[0];
  }
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

function isRateLimited(store, key, windowMs, maxRequests) {
  const now = Date.now();
  const previous = store.get(key) || [];
  const recent = previous.filter((ts) => now - ts < windowMs);
  if (recent.length >= maxRequests) {
    store.set(key, recent);
    return true;
  }
  recent.push(now);
  store.set(key, recent);
  return false;
}

function validateOrderItemsUnitPrices(order) {
  const items = order.items || [];
  if (!Array.isArray(items)) {
    return false;
  }
  for (let idx = 0; idx < items.length; idx += 1) {
    const unitPrice = Number(items[idx].unitPrice);
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      return false;
    }
  }
  return true;
}

function formatItems(order) {
  return (order.items || [])
    .map((i) => {
      const variant = i.variant || i.selectedVariant;
      const p = i.product || {};
      const name = variant ? `${p.name} (${variant})` : p.name;
      const unit = Number(i.unitPrice);
      const qty = Number(i.quantity);
      const safeQty = Number.isFinite(qty) ? qty : 0;
      return `${name} × ${i.quantity} = ${(unit * safeQty).toFixed(2)} Kč`;
    })
    .join('\n');
}

function buildCommonParams(order) {
  const createdAt = new Date(order.createdAt || Date.now());
  const deliveryMethod = (order.formData && order.formData.deliveryMethod) || 'packeta';
  const pickupAddress = 'Vodičkova 677/10, Praha 1';

  return {
    variable_symbol: order.variableSymbol,
    order_id: order.id,
    total_amount: Number(order.totalAmount || 0).toFixed(2),
    items_list: formatItems(order),
    customer_name: `${order.formData.firstName} ${order.formData.lastName}`,
    customer_email: order.formData.email,
    customer_phone: order.formData.phone,
    note: order.formData.note || '—',
    packeta_point_name: (order.formData.packetaPoint && order.formData.packetaPoint.name) || '—',
    packeta_point_address: (order.formData.packetaPoint && order.formData.packetaPoint.address) || '—',
    packeta_point_id: (order.formData.packetaPoint && order.formData.packetaPoint.id) || '—',
    delivery_method: deliveryMethod === 'pickup' ? 'Osobní odběr' : 'Packeta — výdejní místo',
    delivery_address: deliveryMethod === 'pickup' ? pickupAddress : '—',
    iban: STORE_IBAN || '',
    created_at: createdAt.toLocaleString('cs-CZ', {
      dateStyle: 'long',
      timeStyle: 'short',
    }),
    account_number: ACCOUNT_NUMBER || '',
    bank_code: BANK_CODE || '',
  };
}

async function verifyTurnstile(token, ip) {
  if (!TURNSTILE_SECRET_KEY) {
    console.warn('Missing TURNSTILE_SECRET_KEY for Turnstile verification');
    return false;
  }

  const params = new URLSearchParams();
  params.append('secret', TURNSTILE_SECRET_KEY);
  params.append('response', token);
  if (ip && ip !== 'unknown') {
    params.append('remoteip', ip);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: params,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Turnstile verify HTTP ${response.status}: ${text}`);
  }

  const data = await response.json();
  if (!data.success) {
    console.warn('Turnstile verification failed', data['error-codes'] || data);
    return false;
  }

  return true;
}

async function sendEmail(templateId, toEmail, params) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !templateId || !toEmail || !EMAILJS_ACCESS_TOKEN) {
    throw new Error('EmailJS configuration missing');
  }
  console.log('EmailJS template params', params);
  const body = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: templateId,
    user_id: EMAILJS_PUBLIC_KEY,
    accessToken: EMAILJS_ACCESS_TOKEN,
    template_params: {
      ...params,
      to_email: toEmail,
    },
  };

  const response = await fetch(EMAILJS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`EmailJS error: ${response.status} ${text}`);
  }
}

function resetRateLimitStores() {
  ipRequests.clear();
  emailRequests.clear();
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Metoda není povolena.' });
  }

  try {
    const { order, honeypot, startedAt, captchaToken } = req.body || {};

    // Honeypot: pokud pole není prázdné, tiše ignorujeme
    if (honeypot && String(honeypot).trim() !== '') {
      return json(res, 200, { success: true, skipped: true });
    }

    if (!order || !order.formData || !Array.isArray(order.items)) {
      return json(res, 400, { error: 'Neplatná data objednávky.' });
    }

    if (!captchaToken || typeof captchaToken !== 'string') {
      return json(res, 400, {
        error: 'Ověření proti spamu selhalo. Zkuste formulář odeslat znovu.',
      });
    }

    const ip = getClientIp(req);

    try {
      const ok = await verifyTurnstile(captchaToken, ip);
      if (!ok) {
        return json(res, 403, {
          error: 'Ověření proti spamu selhalo. Zkuste formulář odeslat znovu.',
        });
      }
    } catch (err) {
      console.error('Turnstile verify error:', err);
      return json(res, 503, {
        error: 'Ověření proti spamu selhalo. Zkuste to prosím znovu.',
      });
    }

    const now = Date.now();
    if (!startedAt || typeof startedAt !== 'number' || now - startedAt < 3000) {
      return json(res, 400, {
        error: 'Objednávku se nepodařilo odeslat. Zkuste to prosím znovu.',
      });
    }

    // Rate-limit podle IP
    if (isRateLimited(ipRequests, ip, IP_WINDOW_MS, IP_MAX_REQUESTS)) {
      return json(res, 429, {
        error: 'Odesíláte objednávky příliš často. Zkuste to prosím později.',
      });
    }

    // Rate-limit podle e-mailu
    const email = (order.formData.email || '').toLowerCase();
    if (email && isRateLimited(emailRequests, email, EMAIL_WINDOW_MS, EMAIL_MAX_REQUESTS)) {
      return json(res, 429, {
        error: 'Z této e-mailové adresy bylo odesláno příliš mnoho objednávek. Zkuste to prosím později.',
      });
    }

    if (!validateOrderItemsUnitPrices(order)) {
      return json(res, 400, { error: 'Neplatná data objednávky.' });
    }

    const commonParams = buildCommonParams(order);

    await Promise.all([
      sendEmail(EMAILJS_OWNER_TEMPLATE_ID, STORE_OWNER_EMAIL, commonParams),
      sendEmail(EMAILJS_CUSTOMER_TEMPLATE_ID, order.formData.email, commonParams),
    ]);

    return json(res, 200, { success: true });
  } catch (err) {
    console.error('Order API error:', err);
    return json(res, 500, {
      error: 'Nastala chyba při odesílání objednávky. Zkuste to prosím znovu.',
    });
  }
}

handler.resetRateLimitStores = resetRateLimitStores;

export default handler;
