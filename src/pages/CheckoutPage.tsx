import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ShoppingBag, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Order, OrderFormData, OrderItem, PacketaPoint } from '../types';
import { config } from '../config';

const generateVariableSymbol = (): string =>
  String(Math.floor(100000 + (Date.now() % 900000)));

const ORDER_COOLDOWN_MS = 30_000;

const PACKETA_SCRIPT_URL = 'https://widget.packeta.com/v6/www/js/library.js';

export function usePacketaScript() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.Packeta) {
      setReady(true);
      return;
    }

    const existing = document.querySelector(
      `script[src="${PACKETA_SCRIPT_URL}"]`
    ) as HTMLScriptElement | null;

    if (existing) {
      if (existing.dataset.packetaLoaded === 'true') {
        setReady(true);
      } else {
        existing.addEventListener('load', () => setReady(true), { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = PACKETA_SCRIPT_URL;
    script.async = true;
    script.dataset.packetaLoaded = 'false';
    script.onload = () => {
      script.dataset.packetaLoaded = 'true';
      setReady(true);
    };
    document.head.appendChild(script);
  }, []);

  return ready;
}

const emptyForm: OrderFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  note: '',
  deliveryMethod: 'packeta',
  packetaPoint: null,
};

type FieldErrors = Partial<Record<keyof OrderFormData, string>>;

function validate(form: OrderFormData): FieldErrors {
  const errors: FieldErrors = {};

  // Meno
  const firstName = form.firstName.trim();
  if (!firstName) {
    errors.firstName = 'Povinné pole';
  } else {
    if (firstName.length < 2 || firstName.length > 50) {
      errors.firstName = 'Meno musí mať 2 až 50 znakov.';
    } else if (!/^[\p{L}\s-]+$/u.test(firstName)) {
      errors.firstName = 'Zadajte platné meno.';
    }
  }

  // Priezvisko
  const lastName = form.lastName.trim();
  if (!lastName) {
    errors.lastName = 'Povinné pole';
  } else {
    if (lastName.length < 2 || lastName.length > 50) {
      errors.lastName = 'Priezvisko musí mať 2 až 50 znakov.';
    } else if (!/^[\p{L}\s-]+$/u.test(lastName)) {
      errors.lastName = 'Zadajte platné priezvisko.';
    }
  }

  // E-mail
  const email = form.email.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100) {
    errors.email = 'Zadajte platný e-mail';
  }

  // Telefón
  const phoneRaw = form.phone.trim();
  if (!phoneRaw) {
    errors.phone = 'Povinné pole';
  } else {
    let normalized = '';
    for (let i = 0; i < phoneRaw.length; i += 1) {
      const ch = phoneRaw[i];
      if (ch === '+') {
        if (i === 0 && !normalized.includes('+')) {
          normalized += '+';
        }
      } else if (ch >= '0' && ch <= '9') {
        normalized += ch;
      }
    }
    const digitsOnly = normalized.replace(/\D/g, '');
    if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      errors.phone = 'Zadajte platné telefónne číslo.';
    }
  }

  // Poznámka (nepovinná)
  const note = form.note.trim();
  if (note && note.length > 500) {
    errors.note = 'Text je príliš dlhý (max. 500 znakov).';
  }

  // Packeta (povinné len pri doručení cez Packetu)
  if (form.deliveryMethod === 'packeta' && !form.packetaPoint) {
    errors.packetaPoint = 'Vyberte výdajné miesto Packeta.';
  }

  return errors;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const packetaReady = usePacketaScript();

  const [form, setForm] = useState<OrderFormData>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [startedAt] = useState(() => Date.now());
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  const total = totalPrice();
  const shippingCost = form.deliveryMethod === 'packeta' ? 79 : 0;
  const grandTotal = total + shippingCost;

  const setField = <K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const openPacketaWidget = () => {
    const packeta = window.Packeta;
    if (!packeta || !packeta.Widget || typeof packeta.Widget.pick !== 'function') return;

    // Pro jistotu zavřeme případnou předchozí instanci widgetu,
    // aby se při dalším otevření nenačítal v „rozbitém“ stavu.
    try {
      const widgetAny = packeta.Widget as any;
      if (widgetAny && typeof widgetAny.close === 'function') {
        widgetAny.close();
      }
    } catch {
      // ignorujeme chyby pri zatváraní
    }

    packeta.Widget.pick(
      config.packeta.apiKey,
      (point) => {
        if (!point) return;
        const selected: PacketaPoint = {
          id: point.id,
          name: point.name,
          address: `${point.nameStreet}, ${point.zip} ${point.city}`,
        };
        setField('packetaPoint', selected);
      },
      {
        language: 'cs',
        country: 'cz',
        webUrl: window.location.origin,
        appIdentity: 'roztomile',
      }
    );
  };

  const resetTurnstile = () => {
    setCaptchaToken(null);
    const turnstile = (window as any).turnstile;
    if (turnstile && turnstileWidgetIdRef.current) {
      try {
        turnstile.reset(turnstileWidgetIdRef.current);
      } catch {
        // ignorujeme chyby při resetu widgetu
      }
    }
  };

  // Cloudflare Turnstile načtení a vykreslení
  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
    if (!siteKey) {
      console.warn('[checkout] Chybí VITE_TURNSTILE_SITE_KEY pro Turnstile.');
      return;
    }
    if (!captchaRef.current) return;

    const renderWidget = () => {
      const turnstile = (window as any).turnstile;
      if (!turnstile || !captchaRef.current) return;

      const widgetId = turnstile.render(captchaRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          setCaptchaToken(token);
          setSubmitError(null);
        },
        'error-callback': () => {
          setCaptchaToken(null);
        },
        'timeout-callback': () => {
          setCaptchaToken(null);
        },
      });
      turnstileWidgetIdRef.current = widgetId;
    };

    const existingScript = document.querySelector(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if ((window as any).turnstile) {
        renderWidget();
      } else {
        existingScript.addEventListener('load', renderWidget);
      }
      return () => {
        existingScript.removeEventListener('load', renderWidget);
        const t = (window as any).turnstile;
        if (t && turnstileWidgetIdRef.current != null) {
          t.remove(turnstileWidgetIdRef.current);
          turnstileWidgetIdRef.current = null;
        }
      };
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.addEventListener('load', renderWidget);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', renderWidget);
      const t = (window as any).turnstile;
      if (t && turnstileWidgetIdRef.current != null) {
        t.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const order: (keyof OrderFormData)[] = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'packetaPoint',
        'note',
      ];
      const firstErrorKey = order.find((key) => fieldErrors[key]) as keyof OrderFormData | undefined;

      if (firstErrorKey) {
        const targetId = firstErrorKey === 'packetaPoint' ? 'packeta' : firstErrorKey;
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            el.focus();
          }
        }
      }
      return;
    }

    if (!captchaToken) {
      setSubmitError('Prosím potvrďte overenie proti spamu.');
      return;
    }

    // Jednoduchý cooldown na fronte, aby používateľ neklikal opakovane
    try {
      const lastOrderRaw = window.sessionStorage.getItem('lastOrderAt');
      if (lastOrderRaw) {
        const lastOrder = Number(lastOrderRaw);
        if (!Number.isNaN(lastOrder) && Date.now() - lastOrder < ORDER_COOLDOWN_MS) {
          setSubmitError('Objednávku jste právě odeslali. Zkuste to prosím znovu za chvíli.');
          return;
        }
      }
    } catch {
      // pokud sessionStorage selže, jen ignorujeme cooldown
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const orderItems: OrderItem[] = items.map(({ product, quantity, selectedVariant }) => ({
        product,
        quantity,
        variant: selectedVariant,
      }));

      const order: Order = {
        id: `RZT-${Date.now()}`,
        variableSymbol: generateVariableSymbol(),
        items: orderItems,
        formData: form,
        totalAmount: total,
        createdAt: new Date(),
      };

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order,
          honeypot,
          startedAt,
          captchaToken,
        }),
      });

      if (!response.ok) {
        let message = 'Nastala chyba při odesílání objednávky. Zkuste to prosím znovu.';
        try {
          const data = await response.json();
          if (data && typeof data.error === 'string') {
            message = data.error;
          }
        } catch {
          // ignorujeme chybu při parsování
        }
        setSubmitError(message);
        return;
      }

      try {
        window.sessionStorage.setItem('lastOrderAt', String(Date.now()));
      } catch {
        // ignorujeme chybu při zápisu
      }

      clearCart();
      navigate('/success', { state: { order } });
    } catch {
      setSubmitError('Nastala chyba při odesílání objednávky. Zkuste to prosím znovu.');
    } finally {
      setSubmitting(false);
      resetTurnstile();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <ShoppingBag size={48} className="text-stone/20" />
        <p className="text-stone">Váš košík je prázdný.</p>
        <Link to="/" className="px-5 py-2.5 bg-anthracite text-cream text-xs font-semibold uppercase tracking-widest hover:bg-anthracite/90 transition-colors">
          Zpět do obchodu
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-honey mb-2">Krok 1 z 1</p>
        <h1 className="font-serif text-4xl font-semibold text-anthracite">Dokončení objednávky</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left — Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Personal details */}
            <section className="bg-cream border border-anthracite/8 p-6 space-y-5">
              <h2 className="font-serif text-lg font-semibold text-anthracite">Osobní údaje</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Jméno"
                  id="firstName"
                  value={form.firstName}
                  error={errors.firstName}
                  onChange={(v) => setField('firstName', v)}
                  placeholder="Jan"
                />
                <Field
                  label="Příjmení"
                  id="lastName"
                  value={form.lastName}
                  error={errors.lastName}
                  onChange={(v) => setField('lastName', v)}
                  placeholder="Novák"
                />
              </div>

              <Field
                label="E-mail"
                id="email"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={(v) => setField('email', v)}
                placeholder="jan.novak@email.com"
              />
              <Field
                label="Telefon"
                id="phone"
                type="tel"
                value={form.phone}
                error={errors.phone}
                onChange={(v) => setField('phone', v)}
                placeholder="+421 9XX XXX XXX"
              />
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-anthracite mb-1.5">
                  Poznámka k objednávce <span className="text-stone font-normal">(nepovinné)</span>
                </label>
                <textarea
                  id="note"
                  rows={3}
                  value={form.note}
                  onChange={(e) => setField('note', e.target.value)}
                  placeholder="Např. dárkové balení, speciální požadavek..."
                  className="w-full px-3.5 py-2.5 text-sm border border-anthracite/15 bg-cream resize-none focus:outline-none focus:ring-2 focus:ring-honey/20 focus:border-honey transition-colors"
                />
              </div>

              {/* Honeypot field pro bota — skryté pro běžného uživatele */}
              <div className="hidden">
                <label htmlFor="company" className="text-xs">
                  Firma (nevyplňujte)
                </label>
                <input
                  id="company"
                  type="text"
                  autoComplete="off"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
            </section>

            {/* Způsob doručení */}
            <section className="bg-cream border border-anthracite/8 p-6 space-y-4">
              <h2 className="font-serif text-lg font-semibold text-anthracite">Způsob doručení</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-honey bg-honey-light cursor-pointer">
                  <input
                    type="radio"
                    id="packeta"
                    name="deliveryMethod"
                    value="packeta"
                    checked={form.deliveryMethod === 'packeta'}
                    onChange={() => setField('deliveryMethod', 'packeta')}
                    className="accent-brand"
                  />
                  <span className="text-sm font-medium text-anthracite">
                    Packeta — výdejní místo
                  </span>
                </label>

                <label className="flex items-center gap-3 p-4 border border-anthracite/10 bg-cream cursor-pointer hover:border-anthracite/30 transition-colors">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={form.deliveryMethod === 'pickup'}
                    onChange={() => {
                      setField('deliveryMethod', 'pickup');
                      setField('packetaPoint', null);
                    }}
                    className="accent-brand"
                  />
                  <span className="text-sm font-medium text-anthracite">
                    Osobní odběr
                  </span>
                </label>
              </div>

              {form.deliveryMethod === 'packeta' ? (
                form.packetaPoint ? (
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-md">
                    <MapPin size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-800">{form.packetaPoint.name}</p>
                      <p className="text-xs text-green-600 mt-0.5">{form.packetaPoint.address}</p>
                    </div>
                    <button
                      type="button"
                      onClick={openPacketaWidget}
                      disabled={!packetaReady}
                      className="text-xs text-honey hover:underline flex-shrink-0"
                    >
                      Změnit
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={openPacketaWidget}
                      disabled={!packetaReady}
                      className="flex items-center gap-2 px-4 py-2.5 bg-anthracite hover:bg-anthracite/90 disabled:bg-stone/20 disabled:cursor-not-allowed text-cream text-xs font-semibold uppercase tracking-widest transition-colors"
                    >
                      <MapPin size={15} />
                      {packetaReady ? 'Vybrat výdejní místo' : 'Načítá se widget…'}
                    </button>
                    {errors.packetaPoint && (
                      <p className="flex items-center gap-1.5 text-xs text-red-500 mt-2">
                        <AlertCircle size={12} /> {errors.packetaPoint}
                      </p>
                    )}
                  </div>
                )
              ) : (
                <div className="p-4 bg-stone/8 border border-anthracite/10 rounded-md space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-stone/70">
                    Místo osobního odběru
                  </p>
                  <p className="text-sm font-semibold text-anthracite">
                    Vodičkova 677/10, Praha 1
                  </p>
                </div>
              )}
            </section>

            {/* Payment info */}
            <section className="bg-cream border border-anthracite/8 p-6 space-y-3">
              <h2 className="font-serif text-lg font-semibold text-anthracite">Platba</h2>
              <div className="flex items-center gap-3 p-4 border border-honey bg-honey-light">
                <input type="radio" checked readOnly id="bank" className="accent-brand" />
                <label htmlFor="bank" className="text-sm font-medium text-anthracite">
                  Bankovní převod — po odeslání objednávky obdržíte IBAN a variabilní symbol
                </label>
              </div>
            </section>

            {submitError && (
              <div className="flex items-start gap-2.5 p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                {submitError}
              </div>
            )}
          </motion.div>

          {/* Right — Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-cream border border-anthracite/8 p-6 sticky top-24 space-y-5">
              <h2 className="font-serif text-lg font-semibold text-anthracite">Shrnutí objednávky</h2>

              <ul className="divide-y divide-anthracite/6 space-y-3">
                {items.map(({ product, quantity, selectedVariant, image }) => {
                  const displayName = selectedVariant
                    ? `${product.name} (${selectedVariant})`
                    : product.name;
                  return (
                    <li key={`${product.id}-${selectedVariant ?? 'default'}`} className="flex items-center gap-3 pt-3 first:pt-0">
                      <img
                        src={image ?? product.images[0]}
                        alt={product.name}
                        className="w-14 h-14 object-cover bg-stone/10 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-anthracite line-clamp-2 leading-snug">{displayName}</p>
                        <p className="text-xs text-stone mt-0.5">× {quantity}</p>
                      </div>
                    <p className="text-sm font-semibold text-anthracite flex-shrink-0">
                      {(product.price * quantity).toFixed(2).replace('.', ',')} Kč
                      </p>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-anthracite/8 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-stone">
                  <span>Doprava</span>
                  <span className="font-medium text-anthracite">
                    {shippingCost.toFixed(2).replace('.', ',')} Kč
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-anthracite">
                  <span>Celkem</span>
                  <span>{grandTotal.toFixed(2).replace('.', ',')} Kč</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div ref={captchaRef} className="flex justify-center" />
                  <p className="mt-2 text-[10px] text-stone/60 text-center leading-relaxed">
                    Tento formulář je chráněn službou Cloudflare Turnstile.
                  </p>
                </div>

                <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-anthracite hover:bg-anthracite/90 disabled:bg-stone/30 text-cream text-xs font-semibold uppercase tracking-widest transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Odesílám…
                  </>
                ) : (
                  <>
                    Odeslat objednávku a zaplatit
                    <ChevronRight size={16} />
                  </>
                )}
              </button>

              <p className="text-xs text-stone/60 text-center leading-relaxed">
                Odesláním objednávky souhlasíte s{' '}
                <Link to="/terms" className="text-honey hover:underline">obchodními podmínkami</Link>.
              </p>
              </div>
            </div>
          </motion.div>
        </div>
      </form>
    </main>
  );
}

// ── Reusable field component ──────────────────────────────────────────────────

interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}

function Field({ label, id, value, onChange, error, placeholder, type = 'text' }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-anthracite mb-1.5">
        {label} <span className="text-red-400">*</span>
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 transition-colors ${
          error
            ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
            : 'border-anthracite/15 focus:ring-honey/20 focus:border-honey'
        }`}
      />
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}
