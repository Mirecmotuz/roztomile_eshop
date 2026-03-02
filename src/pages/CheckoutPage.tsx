import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ShoppingBag, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { sendOrderEmails } from '../utils/email';
import { Order, OrderFormData, PacketaPoint } from '../types';
import { config } from '../config';

const generateVariableSymbol = (): string =>
  String(Math.floor(100000 + (Date.now() % 900000)));

const PACKETA_SCRIPT_URL = 'https://widget.packeta.com/v6/www/js/library.js';

function usePacketaScript() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.Packeta) { setReady(true); return; }
    const script = document.createElement('script');
    script.src = PACKETA_SCRIPT_URL;
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  return ready;
}

const emptyForm: OrderFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  note: '',
  packetaPoint: null,
};

type FieldErrors = Partial<Record<keyof OrderFormData, string>>;

function validate(form: OrderFormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.firstName.trim()) errors.firstName = 'Povinné pole';
  if (!form.lastName.trim()) errors.lastName = 'Povinné pole';
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Zadajte platný e-mail';
  if (!form.phone.trim()) errors.phone = 'Povinné pole';
  if (!form.packetaPoint) errors.packetaPoint = 'Vyberte výdajné miesto Packeta';
  return errors;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const packetaReady = usePacketaScript();
  const packetaBtnRef = useRef<HTMLButtonElement>(null);

  const [form, setForm] = useState<OrderFormData>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const total = totalPrice();

  const setField = <K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const openPacketaWidget = () => {
    if (!window.Packeta) return;
    window.Packeta.Widget.pick(
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
      { language: 'sk', country: 'sk', webUrl: window.location.origin, appIdentity: 'roztomile' },
      packetaBtnRef.current
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const order: Order = {
      id: `RZT-${Date.now()}`,
      variableSymbol: generateVariableSymbol(),
      items,
      formData: form,
      totalAmount: total,
      createdAt: new Date(),
    };

    try {
      await sendOrderEmails(order);
      clearCart();
      navigate('/success', { state: { order } });
    } catch {
      setSubmitError('Nastala chyba pri odosielaní objednávky. Skúste to prosím znova.');
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <ShoppingBag size={48} className="text-stone/20" />
        <p className="text-stone">Váš košík je prázdny.</p>
        <Link to="/" className="px-5 py-2.5 bg-anthracite text-cream text-xs font-semibold uppercase tracking-widest hover:bg-anthracite/90 transition-colors">
          Späť do obchodu
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-honey mb-2">Krok 1 z 1</p>
        <h1 className="font-serif text-4xl font-semibold text-anthracite">Dokončenie objednávky</h1>
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
              <h2 className="font-serif text-lg font-semibold text-anthracite">Osobné údaje</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Meno"
                  id="firstName"
                  value={form.firstName}
                  error={errors.firstName}
                  onChange={(v) => setField('firstName', v)}
                  placeholder="Ján"
                />
                <Field
                  label="Priezvisko"
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
                label="Telefón"
                id="phone"
                type="tel"
                value={form.phone}
                error={errors.phone}
                onChange={(v) => setField('phone', v)}
                placeholder="+421 9XX XXX XXX"
              />
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-anthracite mb-1.5">
                  Poznámka k objednávke <span className="text-stone font-normal">(nepovinné)</span>
                </label>
                <textarea
                  id="note"
                  rows={3}
                  value={form.note}
                  onChange={(e) => setField('note', e.target.value)}
                  placeholder="Napr. darčekové balenie, špeciálna požiadavka..."
                  className="w-full px-3.5 py-2.5 text-sm border border-anthracite/15 bg-cream resize-none focus:outline-none focus:ring-2 focus:ring-honey/20 focus:border-honey transition-colors"
                />
              </div>
            </section>

            {/* Packeta */}
            <section className="bg-cream border border-anthracite/8 p-6 space-y-4">
              <h2 className="font-serif text-lg font-semibold text-anthracite">Spôsob doručenia</h2>

              <div className="flex items-center gap-3 p-4 border border-honey bg-honey-light">
                <input type="radio" checked readOnly id="packeta" className="accent-brand" />
                <label htmlFor="packeta" className="text-sm font-medium text-anthracite cursor-pointer">
                  Packeta (Zásielkovňa) — výdajné miesto
                </label>
              </div>

              {form.packetaPoint ? (
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
                    Zmeniť
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    ref={packetaBtnRef}
                    type="button"
                    onClick={openPacketaWidget}
                    disabled={!packetaReady}
                    className="flex items-center gap-2 px-4 py-2.5 bg-anthracite hover:bg-anthracite/90 disabled:bg-stone/20 disabled:cursor-not-allowed text-cream text-xs font-semibold uppercase tracking-widest transition-colors"
                  >
                    <MapPin size={15} />
                    {packetaReady ? 'Vybrať odberné miesto' : 'Načítava sa widget…'}
                  </button>
                  {errors.packetaPoint && (
                    <p className="flex items-center gap-1.5 text-xs text-red-500 mt-2">
                      <AlertCircle size={12} /> {errors.packetaPoint}
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* Payment info */}
            <section className="bg-cream border border-anthracite/8 p-6 space-y-3">
              <h2 className="font-serif text-lg font-semibold text-anthracite">Platba</h2>
              <div className="flex items-center gap-3 p-4 border border-honey bg-honey-light">
                <input type="radio" checked readOnly id="bank" className="accent-brand" />
                <label htmlFor="bank" className="text-sm font-medium text-anthracite">
                  Bankový prevod — po odoslaní objednávky dostanete IBAN a variabilný symbol
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
              <h2 className="font-serif text-lg font-semibold text-anthracite">Zhrnutie objednávky</h2>

              <ul className="divide-y divide-anthracite/6 space-y-3">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex items-center gap-3 pt-3 first:pt-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-14 object-cover bg-stone/10 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-anthracite line-clamp-2 leading-snug">{product.name}</p>
                      <p className="text-xs text-stone mt-0.5">× {quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-anthracite flex-shrink-0">
                      {(product.price * quantity).toFixed(2).replace('.', ',')} €
                    </p>
                  </li>
                ))}
              </ul>

              <div className="border-t border-anthracite/8 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-stone">
                  <span>Doprava (Packeta)</span>
                  <span className="font-medium text-anthracite">
                    {total >= 40 ? 'Zadarmo' : '2,90 €'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-anthracite">
                  <span>Spolu</span>
                  <span>{(total < 40 ? total + 2.9 : total).toFixed(2).replace('.', ',')} €</span>
                </div>
                {total < 40 && (
                  <p className="text-xs text-stone/60">
                    Chýba ti {(40 - total).toFixed(2).replace('.', ',')} € do dopravy zadarmo.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-anthracite hover:bg-anthracite/90 disabled:bg-stone/30 text-cream text-xs font-semibold uppercase tracking-widest transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Odosielam…
                  </>
                ) : (
                  <>
                    Odoslať objednávku
                    <ChevronRight size={16} />
                  </>
                )}
              </button>

              <p className="text-xs text-stone/60 text-center leading-relaxed">
                Odoslaním objednávky súhlasíte s{' '}
                <Link to="/terms" className="text-honey hover:underline">obchodnými podmienkami</Link>.
              </p>
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
