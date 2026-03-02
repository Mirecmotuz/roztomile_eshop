import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Minus, Plus, Leaf, Clock, Weight } from 'lucide-react';
import { getProductBySlug } from '../data/products';
import { useCartStore } from '../store/cartStore';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const product = slug ? getProductBySlug(slug) : undefined;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-stone text-lg">Produkt sa nenašiel.</p>
        <Link to="/" className="text-honey hover:underline text-sm">← Späť do obchodu</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-stone hover:text-anthracite transition-colors mb-10"
      >
        <ArrowLeft size={13} />
        Späť
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="relative aspect-square overflow-hidden bg-stone/10">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 text-[10px] font-semibold uppercase tracking-widest text-cream bg-anthracite/70 backdrop-blur-sm px-2 py-0.5">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? 'border-anthracite' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-honey mb-3">
              {product.category}
            </p>
            <h1 className="font-serif text-4xl font-semibold text-anthracite leading-tight">{product.name}</h1>
            <p className="font-serif text-3xl font-semibold text-anthracite mt-4">
              {product.price.toFixed(2).replace('.', ',')} €
            </p>
          </div>

          <p className="text-stone leading-relaxed">{product.description}</p>

          {/* Meta info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.scent && (
              <div className="flex items-start gap-2 p-3 bg-honey-light">
                <Leaf size={14} className="text-honey mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-honey uppercase tracking-wide">Vôňa</p>
                  <p className="text-xs text-stone mt-0.5 leading-snug italic">{product.scent}</p>
                </div>
              </div>
            )}
            {product.burnTime && (
              <div className="flex items-start gap-2 p-3 bg-stone/8">
                <Clock size={14} className="text-stone mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-stone uppercase tracking-wide">Horenie</p>
                  <p className="text-xs text-stone mt-0.5">{product.burnTime}</p>
                </div>
              </div>
            )}
            {product.weight && (
              <div className="flex items-start gap-2 p-3 bg-stone/8">
                <Weight size={14} className="text-stone mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-stone uppercase tracking-wide">Váha</p>
                  <p className="text-xs text-stone mt-0.5">{product.weight}</p>
                </div>
              </div>
            )}
          </div>

          {/* Materials */}
          <div className="border-t border-anthracite/8 pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone/60 mb-2">Zloženie</p>
            <p className="text-sm text-stone leading-relaxed">{product.materials}</p>
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-anthracite/20">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Znížiť množstvo"
                className="px-3 py-2.5 text-stone hover:text-anthracite transition-colors"
              >
                <Minus size={13} />
              </button>
              <span className="px-4 py-2.5 text-sm font-semibold text-anthracite min-w-[3rem] text-center border-x border-anthracite/20">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Zvýšiť množstvo"
                className="px-3 py-2.5 text-stone hover:text-anthracite transition-colors"
              >
                <Plus size={13} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-widest transition-all ${
                added
                  ? 'bg-green-700 text-cream'
                  : 'bg-anthracite hover:bg-anthracite/90 text-cream disabled:bg-stone/20 disabled:cursor-not-allowed disabled:text-stone'
              }`}
            >
              <ShoppingBag size={14} />
              {added ? 'Pridané ✓' : product.inStock ? 'Pridať do košíka' : 'Vypredané'}
            </button>
          </div>

          <p className="text-xs text-stone/50">
            Doprava cez Packeta výdajné miesta. Platba bankovým prevodom.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
