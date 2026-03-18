import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, ArrowRight, MapPin, Package } from 'lucide-react';
import QRCode from 'qrcode';
import { Order } from '../types';
import { config } from '../config';
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

const QR_SIZE = 250;

type PayBySquareQRProps = { vs: string; amount: number; iban: string; beneficiaryName: string; orderId?: string };

function buildSpdString({
  iban,
  amount,
  beneficiaryName,
  vs,
  currency = 'CZK',
}: {
  iban: string;
  amount: number;
  beneficiaryName: string;
  vs: string;
  currency?: string;
}): string | null {
  const normalizedIban = (iban ?? '').replace(/\s/g, '').toUpperCase().trim();
  if (!normalizedIban) return null;

  const amountStr = Number.isFinite(amount) && amount >= 0 ? amount.toFixed(2) : '0.00';

  const name = (beneficiaryName || 'Obchod')
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .slice(0, 35);

  const vsClean = String(vs ?? '').replace(/\D/g, '').slice(0, 10);

  const parts = [
    `ACC:${normalizedIban}`,
    `AM:${amountStr}`,
    `CC:${currency}`,
    `X-VS:${vsClean}`,
    `MSG:${name}`,
  ];

  return `SPD*1.0*${parts.join('*')}*`; 
}

function PayBySquareQR({ vs, amount, iban, beneficiaryName }: PayBySquareQRProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const spdString = useMemo(
    () =>
      buildSpdString({
        iban,
        amount,
        beneficiaryName,
        vs,
        currency: 'CZK',
      }),
    [iban, amount, beneficiaryName, vs],
  );

  useEffect(() => {
    if (!spdString || !canvasRef.current) return;
    console.log("spdString", spdString);
    QRCode.toCanvas(canvasRef.current, spdString, {
      width: QR_SIZE,
      margin: 1,
      errorCorrectionLevel: 'M',
    }).catch((err: unknown) => {
      console.error('[SPD QR] Chyba pri generovaní QR', err);
    });
  }, [spdString]);

  const normalizedIban = (iban ?? '').replace(/\s/g, '').trim();
  const showFallback = !normalizedIban || !spdString;

  return (
    <div className="flex flex-col items-center gap-3 p-5 bg-white border border-gray-100 rounded-lg shadow-soft">
      {showFallback ? (
        <div
          className="flex items-center justify-center rounded bg-gray-50 text-center"
          style={{ width: QR_SIZE, height: QR_SIZE }}
          aria-hidden
        >
          <p className="text-xs text-gray-400 px-4 leading-relaxed">
            QR kód nie je k dispozícii. Použite IBAN, variabilný symbol a sumu v platobných inštrukciách nižšie.
          </p>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          width={QR_SIZE}
          height={QR_SIZE}
          className="rounded"
          aria-label="Platobný QR kód (SPD) na skenovanie"
        />
      )}

      <div className="text-center">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Platobný QR kód</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {amount.toFixed(2).replace('.', ',')} Kč · VS: {vs}
        </p>
      </div>

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
  const STORE_IBAN = config.store.iban;

  // Guard: if navigated directly without order state, redirect home
  useEffect(() => {
    if (!order) navigate('/', { replace: true });
  }, [order, navigate]);

  if (!order) return null;

  const grandTotal = order.totalAmount;

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
          <h1 className="text-3xl font-bold text-anthracite">Objednávka přijata!</h1>
          <p className="text-gray-500 leading-relaxed max-w-md">
            Děkujeme,{' '}
            <strong className="text-anthracite">
              {order.formData.firstName} {order.formData.lastName}
            </strong>
            . Potvrzení jsme poslali na{' '}
            <strong className="text-anthracite">{order.formData.email}</strong>.
          </p>
          <p className="text-xs text-gray-400">Objednávka č. {order.id}</p>
        </motion.div>

        {/* Payment instructions */}
        <motion.div variants={fadeUpVariants} className="w-full bg-white border border-gray-100 rounded-lg shadow-soft p-6 space-y-5 text-left">
          <h2 className="text-base font-semibold text-anthracite text-center">Platební instrukce</h2>

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
                <p className="text-xs font-semibold text-honey uppercase tracking-wide mb-0.5">Variabilní symbol</p>
                <p className="font-serif text-2xl font-bold text-honey tracking-widest">
                  {order.variableSymbol}
                </p>
              </div>
              <CopyButton value={order.variableSymbol} label="VS" />
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between gap-4 p-3.5 bg-gray-50 rounded-md">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Částka k úhradě</p>
                <p className="text-2xl font-bold text-anthracite">
                  {grandTotal.toFixed(2).replace('.', ',')} Kč
                </p>
              </div>
              <CopyButton value={grandTotal.toFixed(2)} label="sumu" />
            </div>
          </div>

          <div className="text-xs text-gray-400 bg-amber-50 border border-amber-100 rounded-md p-3 leading-relaxed">
            <strong className="text-amber-700">Důležité:</strong> Uveďte prosím variabilní symbol{' '}
            <strong className="text-amber-700">{order.variableSymbol}</strong> při platbě. Bez něj není možné objednávku spárovat.
          </div>
        </motion.div>

        {/* QR + Doručení side by side */}
        <motion.div variants={fadeUpVariants} className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
          <PayBySquareQR
            vs={order.variableSymbol}
            amount={grandTotal}
            iban={STORE_IBAN}
            beneficiaryName={config.store.beneficiaryName}
            orderId={order.id}
          />

          {/* Doručení */}
          {order.formData.deliveryMethod === 'packeta' ? (
            <div className="flex flex-col items-center gap-3 p-5 bg-white border border-gray-100 rounded-lg shadow-soft">
              <div className="flex items-center justify-center w-14 h-14 bg-honey-light">
                <Package size={26} className="text-honey" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Výdejní místo</p>
                {order.formData.packetaPoint ? (
                  <>
                    <p className="text-sm font-semibold text-anthracite mt-1">
                      {order.formData.packetaPoint.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                      {order.formData.packetaPoint.address}
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-anthracite mt-1">
                    — 
                  </p>
                )}
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-honey">
                  <MapPin size={12} />
                  <span>Packeta</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 p-5 bg-white border border-gray-100 rounded-lg shadow-soft">
              <div className="flex items-center justify-center w-14 h-14 bg-honey-light">
                <MapPin size={26} className="text-honey" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Osobní odběr</p>
                <p className="text-sm font-semibold text-anthracite mt-1">
                  Vodičkova 677/10, Praha 1
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Order items summary */}
        <motion.div variants={fadeUpVariants} className="w-full bg-white border border-gray-100 rounded-lg shadow-soft p-6 text-left space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Objednané položky</h2>
          <ul className="divide-y divide-gray-50">
            {order.items.map(({ product, quantity, variant }) => {
              const displayName = variant ? `${product.name} (${variant})` : product.name;
              return (
                <li key={`${product.id}-${variant ?? 'default'}`} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover bg-gray-100 flex-shrink-0"
                    />
                    <p className="text-sm text-anthracite">{displayName}</p>
                  </div>
                  <p className="text-sm font-semibold text-anthracite flex-shrink-0">
                    {quantity} × {product.price.toFixed(2).replace('.', ',')} Kč
                  </p>
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUpVariants}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-anthracite hover:bg-anthracite/90 text-cream text-xs font-semibold uppercase tracking-widest transition-colors"
          >
            Zpět do obchodu
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
