import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, ArrowRight, MapPin, Package } from 'lucide-react';
import { Order } from '../types';
import { STORE_IBAN } from '../utils/email';
import { fadeUpVariants, staggerContainer } from '../utils/motion';

// Animated SVG checkmark path
function AnimatedCheck() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
      className="flex items-center justify-center w-24 h-24 rounded-full bg-green-50 mx-auto"
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.25 }}
      >
        <CheckCircle2 size={56} className="text-green-500" strokeWidth={1.5} />
      </motion.div>
    </motion.div>
  );
}

// Pay by Square QR placeholder (SVG)
function PayBySquarePlaceholder({ vs, amount, iban }: { vs: string; amount: number; iban: string }) {
  return (
    <div className="flex flex-col items-center gap-3 p-5 bg-white border border-gray-100 rounded-lg shadow-soft">
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Pay by Square QR kód placeholder"
        className="rounded"
      >
        <rect width="140" height="140" fill="#F9FAFB" />
        {/* Corner squares */}
        <rect x="10" y="10" width="36" height="36" rx="3" fill="#2C2C2C" />
        <rect x="16" y="16" width="24" height="24" rx="1" fill="#F9FAFB" />
        <rect x="20" y="20" width="16" height="16" rx="1" fill="#2C2C2C" />

        <rect x="94" y="10" width="36" height="36" rx="3" fill="#2C2C2C" />
        <rect x="100" y="16" width="24" height="24" rx="1" fill="#F9FAFB" />
        <rect x="104" y="20" width="16" height="16" rx="1" fill="#2C2C2C" />

        <rect x="10" y="94" width="36" height="36" rx="3" fill="#2C2C2C" />
        <rect x="16" y="100" width="24" height="24" rx="1" fill="#F9FAFB" />
        <rect x="20" y="104" width="16" height="16" rx="1" fill="#2C2C2C" />

        {/* Center pattern dots */}
        {[55, 62, 69, 76, 83].flatMap((x) =>
          [55, 62, 69, 76, 83].map((y) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" rx="1" fill={Math.random() > 0.45 ? '#2C2C2C' : '#F9FAFB'} />
          ))
        )}

        {/* Bottom-right fill pattern */}
        {[94, 101, 108, 115, 122].map((x) =>
          [94, 101, 108, 115, 122].map((y) => (
            <rect key={`br-${x}-${y}`} x={x} y={y} width="5" height="5" rx="1" fill={Math.random() > 0.5 ? '#2C2C2C' : '#F9FAFB'} />
          ))
        )}
      </svg>

      <div className="text-center">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pay by Square</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {amount.toFixed(2).replace('.', ',')} € · VS: {vs}
        </p>
        <p className="text-[10px] text-gray-300 mt-1 max-w-[160px] leading-snug">
          QR kód bude generovaný po integrácii platobnej brány
        </p>
      </div>

      {/* Hidden data for screen readers / copy */}
      <p className="sr-only">IBAN: {iban}, Variabilný symbol: {vs}</p>
    </div>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const handleCopy = () => navigator.clipboard.writeText(value);
  return (
    <button
      onClick={handleCopy}
      title={`Skopírovať ${label}`}
      className="p-1.5 text-stone hover:text-honey transition-colors"
    >
      <Copy size={14} />
    </button>
  );
}

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as Order | undefined;

  // Guard: if navigated directly without order state, redirect home
  useEffect(() => {
    if (!order) navigate('/', { replace: true });
  }, [order, navigate]);

  if (!order) return null;

  const shipping = order.totalAmount < 40 ? 2.9 : 0;
  const grandTotal = order.totalAmount + shipping;

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center gap-8 text-center"
      >
        {/* Check icon */}
        <motion.div variants={fadeUpVariants}>
          <AnimatedCheck />
        </motion.div>

        {/* Heading */}
        <motion.div variants={fadeUpVariants} className="space-y-2">
          <h1 className="text-3xl font-bold text-anthracite">Objednávka prijatá!</h1>
          <p className="text-gray-500 leading-relaxed max-w-md">
            Ďakujeme,{' '}
            <strong className="text-anthracite">
              {order.formData.firstName} {order.formData.lastName}
            </strong>
            . Potvrdenie sme zaslali na{' '}
            <strong className="text-anthracite">{order.formData.email}</strong>.
          </p>
          <p className="text-xs text-gray-400">Objednávka č. {order.id}</p>
        </motion.div>

        {/* Payment instructions */}
        <motion.div variants={fadeUpVariants} className="w-full bg-white border border-gray-100 rounded-lg shadow-soft p-6 space-y-5 text-left">
          <h2 className="text-base font-semibold text-anthracite text-center">Platobné inštrukcie</h2>

          <div className="space-y-3">
            {/* IBAN */}
            <div className="flex items-center justify-between gap-4 p-3.5 bg-gray-50 rounded-md">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">IBAN</p>
                <p className="text-sm font-mono font-semibold text-anthracite">{STORE_IBAN}</p>
              </div>
              <CopyButton value={STORE_IBAN} label="IBAN" />
            </div>

            {/* Variable symbol */}
            <div className="flex items-center justify-between gap-4 p-3.5 bg-honey-light border border-honey/20">
              <div>
                <p className="text-xs font-semibold text-honey uppercase tracking-wide mb-0.5">Variabilný symbol</p>
                <p className="font-serif text-2xl font-bold text-honey tracking-widest">
                  {order.variableSymbol}
                </p>
              </div>
              <CopyButton value={order.variableSymbol} label="VS" />
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between gap-4 p-3.5 bg-gray-50 rounded-md">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Suma na úhradu</p>
                <p className="text-2xl font-bold text-anthracite">
                  {grandTotal.toFixed(2).replace('.', ',')} €
                </p>
              </div>
              <CopyButton value={grandTotal.toFixed(2)} label="sumu" />
            </div>
          </div>

          <div className="text-xs text-gray-400 bg-amber-50 border border-amber-100 rounded-md p-3 leading-relaxed">
            <strong className="text-amber-700">Dôležité:</strong> Uveďte prosím variabilný symbol{' '}
            <strong className="text-amber-700">{order.variableSymbol}</strong> pri platbe. Bez neho nie je možné objednávku spárovať.
          </div>
        </motion.div>

        {/* QR + Packeta side by side */}
        <motion.div variants={fadeUpVariants} className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
          <PayBySquarePlaceholder
            vs={order.variableSymbol}
            amount={grandTotal}
            iban={STORE_IBAN}
          />

          {/* Packeta info */}
          {order.formData.packetaPoint && (
            <div className="flex flex-col items-center gap-3 p-5 bg-white border border-gray-100 rounded-lg shadow-soft">
              <div className="flex items-center justify-center w-14 h-14 bg-honey-light">
                <Package size={26} className="text-honey" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Výdajné miesto</p>
                <p className="text-sm font-semibold text-anthracite mt-1">
                  {order.formData.packetaPoint.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                  {order.formData.packetaPoint.address}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-honey">
                  <MapPin size={12} />
                  <span>Packeta (Zásielkovňa)</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Order items summary */}
        <motion.div variants={fadeUpVariants} className="w-full bg-white border border-gray-100 rounded-lg shadow-soft p-6 text-left space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Objednané položky</h2>
          <ul className="divide-y divide-gray-50">
            {order.items.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-10 h-10 rounded object-cover bg-gray-100 flex-shrink-0"
                  />
                  <p className="text-sm text-anthracite">{product.name}</p>
                </div>
                <p className="text-sm font-semibold text-anthracite flex-shrink-0">
                  {quantity} × {product.price.toFixed(2).replace('.', ',')} €
                </p>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUpVariants}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-anthracite hover:bg-anthracite/90 text-cream text-xs font-semibold uppercase tracking-widest transition-colors"
          >
            Späť do obchodu
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
