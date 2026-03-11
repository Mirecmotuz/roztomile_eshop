import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState<string>(
    hasVariants ? product.variants![0] : '',
  );
  const [variantOpen, setVariantOpen] = useState(false);
  const variantRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!variantOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (variantRef.current && !variantRef.current.contains(event.target as Node)) {
        setVariantOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [variantOpen]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group flex flex-col bg-cream"
    >
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden aspect-square bg-stone/10">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-90"
          loading="lazy"
        />

        {/* Badge — minimal text overlay */}
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-widest text-white bg-anthracite/70 backdrop-blur-sm px-2 py-0.5">
            {product.badge}
          </span>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-cream/70 flex items-center justify-center">
            <span className="text-xs font-medium uppercase tracking-widest text-stone">Vypredané</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 pt-4 gap-3">
        <div className="flex-1">
          <p className="text-[10px] text-stone uppercase tracking-widest mb-1">{product.category}</p>
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-serif text-base font-semibold text-anthracite leading-snug hover:text-honey transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          {product.scent && (
            <p className="text-xs text-stone mt-1 line-clamp-1 italic">{product.scent}</p>
          )}
        </div>

        {hasVariants && (
          <div className="mt-2 relative" ref={variantRef}>
            <label className="sr-only" htmlFor={`variant-${product.id}`}>
              Variant produktu
            </label>
            <button
              id={`variant-${product.id}`}
              type="button"
              onClick={() => setVariantOpen((open) => !open)}
              className="w-full bg-cream border border-anthracite/10 rounded-full px-3 py-1 text-[11px] tracking-widest uppercase text-stone shadow-sm hover:border-anthracite/30 focus:outline-none focus:ring-1 focus:ring-honey/70 focus:border-honey/60 transition-colors flex items-center justify-between gap-2"
            >
              <span className="truncate text-left">{selectedVariant || product.variants![0]}</span>
              <ChevronDown
                size={12}
                className={`shrink-0 transition-transform ${variantOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {variantOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-cream border border-anthracite/10 rounded-xl shadow-lg z-20 overflow-hidden">
                {product.variants!.map((v) => {
                  const active = v === selectedVariant;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        setSelectedVariant(v);
                        setVariantOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-[11px] tracking-widest uppercase transition-colors ${
                        active
                          ? 'bg-anthracite text-cream'
                          : 'text-stone hover:bg-anthracite/5 hover:text-anthracite'
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <span className="font-serif text-base font-semibold text-anthracite">
            {product.price.toFixed(2).replace('.', ',')} €
          </span>
          <button
            onClick={() => {
              if (!product.inStock) return;
              const variantToUse =
                hasVariants && product.variants && product.variants.length > 0
                  ? selectedVariant || product.variants[0]
                  : undefined;
              addItem(product, variantToUse);
            }}
            disabled={!product.inStock}
            aria-label={`Pridať ${product.name} do košíka`}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-anthracite hover:bg-anthracite hover:text-cream disabled:border-stone/30 disabled:text-stone/40 disabled:cursor-not-allowed text-anthracite text-xs font-medium tracking-wide transition-colors"
          >
            <ShoppingBag size={12} />
            <span className="hidden sm:inline">Do košíka</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
