const EMAILJS_API_URL = 'https://api.emailjs.com/api/v1.0/email/send';

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_OWNER_TEMPLATE_ID = process.env.EMAILJS_OWNER_TEMPLATE_ID;
const EMAILJS_CUSTOMER_TEMPLATE_ID = process.env.EMAILJS_CUSTOMER_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const STORE_OWNER_EMAIL = process.env.STORE_OWNER_EMAIL;
const STORE_IBAN = process.env.STORE_IBAN;
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

const IP_WINDOW_MS = 10 * 60 * 1000; // 10 minút
const IP_MAX_REQUESTS = 5;
const EMAIL_WINDOW_MS = 60 * 60 * 1000; // 1 hodina
const EMAIL_MAX_REQUESTS = 3;

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

function formatItems(order) {
  return (order.items || [])
    .map((i) => `${i.product.name} × ${i.quantity} = ${(i.product.price * i.quantity).toFixed(2)} €`)
    .join('\n');
}

function buildCommonParams(order) {
  const createdAt = new Date(order.createdAt || Date.now());

  return {
    variable_symbol: order.variableSymbol,
    order_id: order.id,
    total_amount: Number(order.totalAmount || 0).toFixed(2).replace('.', ','),
    items_list: formatItems(order),
    customer_name: `${order.formData.firstName} ${order.formData.lastName}`,
    customer_email: order.formData.email,
    customer_phone: order.formData.phone,
    note: order.formData.note || '—',
    packeta_point_name: (order.formData.packetaPoint && order.formData.packetaPoint.name) || '—',
    packeta_point_address: (order.formData.packetaPoint && order.formData.packetaPoint.address) || '—',
    packeta_point_id: (order.formData.packetaPoint && order.formData.packetaPoint.id) || '—',
    iban: STORE_IBAN || '',
    created_at: createdAt.toLocaleString('sk-SK', {
      dateStyle: 'long',
      timeStyle: 'short',
    }),
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
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !templateId || !toEmail) {
    throw new Error('EmailJS configuration missing');
  }

  const body = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: templateId,
    user_id: EMAILJS_PUBLIC_KEY,
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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    const { order, honeypot, startedAt, captchaToken } = req.body || {};

    // Honeypot: ak pole nie je prázdne, ticho ignorujeme
    if (honeypot && String(honeypot).trim() !== '') {
      return json(res, 200, { success: true, skipped: true });
    }

    if (!order || !order.formData || !Array.isArray(order.items)) {
      return json(res, 400, { error: 'Neplatné dáta objednávky.' });
    }

    if (!captchaToken || typeof captchaToken !== 'string') {
      return json(res, 400, {
        error: 'Overenie proti spamu zlyhalo. Skúste formulár odoslať znova.',
      });
    }

    const ip = getClientIp(req);

    try {
      const ok = await verifyTurnstile(captchaToken, ip);
      if (!ok) {
        return json(res, 403, {
          error: 'Overenie proti spamu zlyhalo. Skúste formulár odoslať znova.',
        });
      }
    } catch (err) {
      console.error('Turnstile verify error:', err);
      return json(res, 503, {
        error: 'Overenie proti spamu zlyhalo. Skúste to prosím znova.',
      });
    }

    const now = Date.now();
    if (!startedAt || typeof startedAt !== 'number' || now - startedAt < 3000) {
      return json(res, 400, {
        error: 'Objednávku sa nepodarilo odoslať. Skúste to prosím znova.',
      });
    }

    // Rate-limit podľa IP
    if (isRateLimited(ipRequests, ip, IP_WINDOW_MS, IP_MAX_REQUESTS)) {
      return json(res, 429, {
        error: 'Odosielate objednávky príliš často. Skúste to prosím neskôr.',
      });
    }

    // Rate-limit podľa emailu
    const email = (order.formData.email || '').toLowerCase();
    if (email && isRateLimited(emailRequests, email, EMAIL_WINDOW_MS, EMAIL_MAX_REQUESTS)) {
      return json(res, 429, {
        error: 'Z tohto e-mailu bolo odoslaných príliš veľa objednávok. Skúste to prosím neskôr.',
      });
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
      error: 'Nastala chyba pri odosielaní objednávky. Skúste to prosím znova.',
    });
  }
};

