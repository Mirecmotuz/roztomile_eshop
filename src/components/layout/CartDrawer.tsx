import { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);

  const total = totalPrice();
  const handleContinueShopping = () => {
    closeCart();
    if (location.pathname === '/checkout') {
      navigate('/?focus=products');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-anthracite/40 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 35 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-cream shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-anthracite/8">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-honey" />
                <h2 className="font-serif text-lg font-semibold text-anthracite">Košík</h2>
                {items.length > 0 && (
                  <span className="text-sm text-stone">({items.length})</span>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label="Zatvoriť košík"
                className="p-2 text-stone hover:text-anthracite transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={40} className="text-stone/20" />
                  <p className="text-stone text-sm">Váš košík je prázdný.</p>
                  <button
                    onClick={handleContinueShopping}
                    className="text-xs font-medium uppercase tracking-widest text-honey hover:underline"
                  >
                    Pokračovat v nákupu →
                  </button>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map(({ product, quantity, selectedVariant, image }) => {
                    const displayName = selectedVariant
                      ? `${product.name} (${selectedVariant})`
                      : product.name;
                    return (
                      <li
                        key={`${product.id}-${selectedVariant ?? 'default'}`}
                        className="flex gap-4"
                      >
                        <img
                          src={image ?? product.images[0]}
                          alt={product.name}
                          className="w-20 h-20 object-cover flex-shrink-0 bg-stone/10"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-anthracite leading-snug line-clamp-2">
                            {displayName}
                          </p>
                          <p className="font-serif text-sm text-honey font-semibold mt-1">
                            {product.price.toFixed(2).replace('.', ',')} Kč
                          </p>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1, selectedVariant)}
                              aria-label="Znížiť množstvo"
                              className="w-6 h-6 flex items-center justify-center border border-anthracite/20 text-stone hover:border-anthracite hover:text-anthracite transition-colors"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="text-sm font-medium w-5 text-center">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1, selectedVariant)}
                              aria-label="Zvýšiť množstvo"
                              className="w-6 h-6 flex items-center justify-center border border-anthracite/20 text-stone hover:border-anthracite hover:text-anthracite transition-colors"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(product.id, selectedVariant)}
                          aria-label="Odstrániť produkt"
                          className="flex-shrink-0 self-start p-1 text-stone/40 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-anthracite/8 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-stone">Spolu</span>
                  <span className="font-serif text-xl font-semibold text-anthracite">
                    {total.toFixed(2).replace('.', ',')} Kč
                  </span>
                </div>
                <p className="text-xs text-stone/60">Dopravu a výdejní místo Packeta zvolíte při objednávce.</p>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center py-3 bg-anthracite hover:bg-anthracite/90 text-cream text-xs font-semibold uppercase tracking-widest transition-colors"
                >
                  Přejít k pokladně
                </Link>
                <button
                  onClick={handleContinueShopping}
                  className="block w-full text-center py-2 text-xs uppercase tracking-widest text-stone hover:text-anthracite transition-colors"
                >
                  Pokračovat v nákupu
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
