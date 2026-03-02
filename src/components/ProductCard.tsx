import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);

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

        <div className="flex items-center justify-between gap-2">
          <span className="font-serif text-base font-semibold text-anthracite">
            {product.price.toFixed(2).replace('.', ',')} €
          </span>
          <button
            onClick={() => product.inStock && addItem(product)}
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
