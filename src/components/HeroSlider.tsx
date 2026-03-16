import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1603905219867-ef465f9c8cd5?w=1600&q=85',
    tag: 'Jaro 2026',
    heading: 'Velikonoční\nkolekce',
    sub: 'Přivítej jaro v barvách! Ručně lité svíčky, které rozzáří váš domov jarními odstíny. Přírodní a udržitelné.',
    cta: 'To chci',
    to: '/?category=svíčky&focus=products',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85',
    tag: '100 % přírodní',
    heading: 'Přírodní balzámy\n na rty',
    sub: 'Jen to, co příroda dala. Žádný parafín, žádné silikony — to nejlepší pro vaše rty.',
    cta: 'To chci',
    to: '/?category=včelí vosk&focus=products',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf5e2f?w=1600&q=85',
    tag: 'Zero Waste',
    heading: 'Včelí vosk –\n šetrný k planetě a vaší kuchyni',
    sub: 'Ekologická alternativa plastové fólie z přírodního včelího vosku. Vydrží až rok.',
    cta: 'To chci',
    to: '/?category=balzámy&focus=products',
  },
];

const AUTOPLAY_MS = 5000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section
      className="relative w-full h-[75vh] min-h-[520px] overflow-hidden bg-stone/20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].heading.replace('\n', ' ')}
            className="w-full h-full object-cover"
          />
          {/* Warm dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-anthracite/60 via-anthracite/25 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Text content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`text-${slides[current].id}`}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 lg:px-24 max-w-2xl"
        >
          <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-honey mb-4">
            {slides[current].tag}
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold text-white leading-tight whitespace-pre-line mb-5">
            {slides[current].heading}
          </h1>
          <p className="text-white/75 text-base sm:text-lg max-w-md mb-8 leading-relaxed font-light">
            {slides[current].sub}
          </p>
          {/* Outline CTA button */}
          <Link
            to={slides[current].to}
            className="self-start px-7 py-3 border border-white text-white text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-anthracite transition-colors"
          >
            {slides[current].cta}
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Předchozí snímek"
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        aria-label="Další snímek"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Snímek ${i + 1}`}
            className={`transition-all duration-300 ${
              i === current ? 'w-8 h-px bg-white' : 'w-4 h-px bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
