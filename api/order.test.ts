import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';

type HandlerFn = (req: any, res: any) => Promise<void> | void;

let handler: HandlerFn;
let resetRateLimitStores: () => void;

beforeAll(async () => {
  // Nastavíme testovacie env pre EmailJS a Turnstile (musí sedieť s order.js)
  process.env.EMAILJS_SERVICE_ID = 'test-service';
  process.env.EMAILJS_OWNER_TEMPLATE_ID = 'owner-template';
  process.env.EMAILJS_CUSTOMER_TEMPLATE_ID = 'customer-template';
  process.env.EMAILJS_PUBLIC_KEY = 'public-key';
  process.env.EMAILJS_PRIVATE_KEY = 'test-private-token';
  process.env.VITE_OWNER_EMAIL = 'owner@example.com';
  process.env.STORE_IBAN = 'SK00TESTIBAN';
  process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret';
  process.env.ORDER_RATE_LIMIT_IP_MAX = '5';

  const mod: any = await import('./order.js');
  const exported = mod.default ?? mod;
  handler = exported as HandlerFn;
  resetRateLimitStores =
    (exported && exported.resetRateLimitStores) ||
    mod.resetRateLimitStores ||
    (() => {});
});

beforeEach(() => {
  vi.restoreAllMocks();
  resetRateLimitStores();

  // Stabilný čas pre všetky testy
  vi.spyOn(Date, 'now').mockReturnValue(1_000_000);

  // Globálny mock fetch pre Turnstile + EmailJS
  (globalThis as any).fetch = vi.fn(async (url: any, options: any) => {
    const href = String(url);

    if (href.includes('turnstile')) {
      const body = options?.body as any;
      let responseToken = '';
      if (body && typeof body.get === 'function') {
        responseToken = body.get('response') || '';
      }

      // Špeciálny token na simuláciu HTTP chyby
      if (responseToken === 'error-token') {
        return {
          ok: false,
          status: 500,
          text: async () => 'turnstile error',
        } as any;
      }

      // "bad-token" -> success: false, inak success: true
      const success = responseToken !== 'bad-token';
      return {
        ok: true,
        json: async () => ({ success }),
        text: async () => '',
      } as any;
    }

    if (href.includes('api.emailjs.com')) {
      return {
        ok: true,
        text: async () => '',
      } as any;
    }

    throw new Error(`Unexpected fetch URL in test: ${href}`);
  });
});

/** Mock ako reálny checkout: product z klienta (price 110), Packeta +79 → totalAmount 189. */
function createValidOrder(overrides: any = {}) {
  return {
    id: 'RZT-123',
    variableSymbol: '123456',
    totalAmount: 189,
    createdAt: new Date(1_000_000).toISOString(),
    items: [
      {
        product: {
          id: '1',
          name: 'Test produkt',
          price: 110,
          images: ['https://example.com/img.jpg'],
        },
        quantity: 1,
        unitPrice: 110,
      },
    ],
    formData: {
      firstName: 'Ján',
      lastName: 'Novák',
      email: 'jan.novak@example.com',
      phone: '+421900000000',
      note: '',
      deliveryMethod: 'packeta',
      packetaPoint: {
        id: 'PACKETA1',
        name: 'Packeta bod',
        address: 'Test ulica 1, 01001 Žilina',
      },
    },
    ...overrides,
  };
}

function createReqRes(bodyOverrides: any = {}, headerOverrides: any = {}) {
  const baseBody = {
    order: createValidOrder(bodyOverrides.order),
    honeypot: '',
    startedAt: Date.now() - 5000,
    captchaToken: 'valid-token',
  };

  const body = { ...baseBody, ...bodyOverrides };

  const resData: { data?: string } = {};

  const req: any = {
    method: 'POST',
    headers: { 'x-forwarded-for': '1.1.1.1', ...headerOverrides },
    socket: { remoteAddress: '127.0.0.1' },
    body,
  };

  const res: any = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    setHeader(name: string, value: string) {
      this.headers[name] = value;
    },
    end(payload: string) {
      resData.data = payload;
    },
  };

  return { req, res, resData };
}

function parseJson(resData: { data?: string }) {
  expect(resData.data).toBeDefined();
  return JSON.parse(resData.data as string);
}

describe('api/order handler', () => {
  it('happy path – vráti 200 a success', async () => {
    const { req, res, resData } = createReqRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const json = parseJson(resData);
    expect(json).toEqual({ success: true });
    // 1x Turnstile + 2x EmailJS
    expect((globalThis.fetch as any).mock.calls.length).toBe(3);
  });

  it('EmailJS items_list používa unitPrice z položky (variantová cena)', async () => {
    const { req, res, resData } = createReqRes({
      order: createValidOrder({
        totalAmount: 199,
        items: [
          {
            product: {
              id: 'v1',
              name: 'Variantový test',
              price: 100,
              enableVariantPriceSwitch: true,
              variantPrices: { modrá: 100, červená: 120 },
              images: [],
            },
            quantity: 1,
            unitPrice: 120,
            variant: 'červená',
          },
        ],
      }),
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(parseJson(resData)).toEqual({ success: true });

    const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>;
    const emailBodies = fetchMock.mock.calls
      .filter((call: unknown[]) => String((call as any)[0]).includes('api.emailjs.com'))
      .map((call: unknown[]) => JSON.parse((call as any)[1].body as string));
    expect(emailBodies.length).toBeGreaterThanOrEqual(1);
    expect(emailBodies[0].template_params.items_list).toContain('120.00');
    expect(emailBodies[0].template_params.items_list).toContain('červená');
  });

  it('honeypot – objednávka sa ticho preskočí a fetch sa nevolá', async () => {
    const { req, res, resData } = createReqRes({ honeypot: 'bot-input' });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const json = parseJson(resData);
    expect(json).toEqual({ success: true, skipped: true });
    expect(globalThis.fetch as any).not.toHaveBeenCalled();
  });

  it('minimálny čas – príliš rýchle odoslanie je odmietnuté', async () => {
    const { req, res, resData } = createReqRes({
      startedAt: Date.now(), // rozdiel 0 ms
    });

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    const json = parseJson(resData);
    expect(json.error).toContain('Objednávku se nepodařilo odeslat');
  });

  it('rate-limit podľa IP – viac ako povolený počet requestov vráti 429', async () => {
    const ip = '9.9.9.9';

    // Povolených 5 requestov
    for (let i = 0; i < 5; i += 1) {
      const { req, res } = createReqRes(
        {
          order: createValidOrder({
            formData: {
              ...createValidOrder().formData,
              email: `ip-test+${i}@example.com`, // rôzny email, aby nelimitovalo podľa emailu
            },
          }),
        },
        { 'x-forwarded-for': ip },
      );
      await handler(req, res);
      expect(res.statusCode).toBe(200);
    }

    // Šiesty request by mal byť odmietnutý
    const { req, res, resData } = createReqRes({}, { 'x-forwarded-for': ip });
    await handler(req, res);

    expect(res.statusCode).toBe(429);
    const json = parseJson(resData);
    expect(json.error).toContain('Odesíláte objednávky příliš často');
  });

  it('rate-limit podľa emailu – viac ako povolený počet na email vráti 429', async () => {
    const email = 'repeat@example.com';

    // 3 povolené objednávky
    for (let i = 0; i < 3; i += 1) {
      const { req, res } = createReqRes({
        order: createValidOrder({
          formData: {
            ...createValidOrder().formData,
            email,
          },
        }),
      }, { 'x-forwarded-for': `2.2.2.${i}` });

      await handler(req, res);
      expect(res.statusCode).toBe(200);
    }

    // Štvrtá by mala byť odmietnutá
    const { req, res, resData } = createReqRes({
      order: createValidOrder({
        formData: {
          ...createValidOrder().formData,
          email,
        },
      }),
    }, { 'x-forwarded-for': '3.3.3.3' });

    await handler(req, res);
    expect(res.statusCode).toBe(429);
    const json = parseJson(resData);
    expect(json.error).toContain('příliš mnoho objednávek');
  });

  it('CAPTCHA chýba – vráti 400', async () => {
    const { req, res, resData } = createReqRes({ captchaToken: undefined });

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    const json = parseJson(resData);
    expect(json.error).toContain('Ověření proti spamu selhalo');
  });

  it('CAPTCHA – Turnstile vráti neúspech (success: false) → 403', async () => {
    const { req, res, resData } = createReqRes({ captchaToken: 'bad-token' });

    await handler(req, res);

    expect(res.statusCode).toBe(403);
    const json = parseJson(resData);
    expect(json.error).toContain('Ověření proti spamu selhalo');
  });

  it('CAPTCHA – Turnstile HTTP chyba → 503', async () => {
    const { req, res, resData } = createReqRes({ captchaToken: 'error-token' });

    await handler(req, res);

    expect(res.statusCode).toBe(503);
    const json = parseJson(resData);
    expect(json.error).toContain('Ověření proti spamu selhalo');
  });

  it('neplatná štruktúra objednávky – chýba formData/items → 400', async () => {
    const { req, res, resData } = createReqRes({ order: null });

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    const json = parseJson(resData);
    expect(json.error).toContain('Neplatná data objednávky');
  });

  it('neplatná unitPrice na položke → 400', async () => {
    const { req, res, resData } = createReqRes({
      order: createValidOrder({
        items: [
          {
            ...createValidOrder().items[0],
            unitPrice: Number.NaN,
          },
        ],
      }),
    });

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(parseJson(resData).error).toContain('Neplatná data objednávky');
  });

  it('ľubovoľné product.id z klienta — server nekontroluje katalóg → 200', async () => {
    const { req, res, resData } = createReqRes({
      order: createValidOrder({
        totalAmount: 80,
        items: [
          {
            product: { id: 'cokolvek', name: 'X', price: 1, images: [] },
            quantity: 1,
            unitPrice: 1,
          },
        ],
      }),
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(parseJson(resData)).toEqual({ success: true });
  });

  it('pickup: totalAmount bez dopravy → 200', async () => {
    const { req, res, resData } = createReqRes({
      order: createValidOrder({
        totalAmount: 110,
        formData: {
          ...createValidOrder().formData,
          deliveryMethod: 'pickup',
          packetaPoint: null,
        },
      }),
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(parseJson(resData)).toEqual({ success: true });
  });
});
