import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Minus, Plus, Leaf, Clock, Weight, ChevronDown } from 'lucide-react';
import { getProductBySlug } from '../data/products';
import { useCartStore } from '../store/cartStore';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const product = slug ? getProductBySlug(slug) : undefined;

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [careOpen, setCareOpen] = useState(false);
  const hasVariants = Array.isArray(product?.variants) && (product?.variants?.length ?? 0) > 0;
  const isVariantSwitching = Boolean(product?.enableVariantImageSwitch) && hasVariants;
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [variantOpen, setVariantOpen] = useState(false);
  const variantRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!product) return;

    if (!isVariantSwitching) {
      setSelectedImageIndex(0);
      setSelectedImage('');
      setSelectedVariant('');
      return;
    }

    const initialVariant = product.variants?.[0] ?? '';
    const initialImage =
      (initialVariant && product.variantImages?.[initialVariant]) || product.images[0] || '';
    const initialIndex = initialImage ? Math.max(0, product.images.indexOf(initialImage)) : 0;

    setSelectedVariant(initialVariant);
    setSelectedImage('');
    setSelectedImageIndex(initialIndex);
  }, [product, isVariantSwitching]);

  useEffect(() => {
    if (!variantOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (variantRef.current && !variantRef.current.contains(event.target as Node)) {
        setVariantOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [variantOpen]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-stone text-lg">Produkt nebyl nalezen.</p>
        <Link to="/" className="text-honey hover:underline text-sm">← Zpět do obchodu</Link>
      </div>
    );
  }

  const variantImage = isVariantSwitching
    ? product.variantImages?.[selectedVariant] || product.images[0]
    : '';
  const displayImage = isVariantSwitching
    ? selectedImage || variantImage
    : product.images[selectedImageIndex];

  const handleAddToCart = () => {
    const variantToUse =
      hasVariants && product.variants && product.variants.length > 0
        ? (isVariantSwitching ? selectedVariant || product.variants[0] : product.variants[0])
        : undefined;
    for (let i = 0; i < quantity; i += 1) {
      addItem(product, variantToUse);
    }
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
        Zpět
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
              src={displayImage}
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
                  onClick={() => {
                    if (isVariantSwitching) {
                      const matchedVariant = Object.entries(product.variantImages ?? {}).find(
                        ([, url]) => url === img,
                      )?.[0];

                      // Ak thumbnail zodpovedá farbe, zosynchronizuj farbu s galériou
                      if (matchedVariant) {
                        setSelectedVariant(matchedVariant);
                        setSelectedImage('');
                        setSelectedImageIndex(i);
                        return;
                      }

                      // Inak sa správaj ako “dočasný override” bez zmeny farby
                      setSelectedImage(img);
                      setSelectedImageIndex(i);
                      return;
                    }
                    setSelectedImageIndex(i);
                  }}
                  className={`w-20 h-20 overflow-hidden border-2 transition-colors ${
                    i === selectedImageIndex
                      ? 'border-anthracite'
                      : 'border-transparent opacity-60 hover:opacity-100'
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
              {product.price.toFixed(2).replace('.', ',')} Kč
            </p>
            {isVariantSwitching && (
              <div className="mt-4 max-w-xs relative" ref={variantRef}>
                <label className="sr-only" htmlFor={`variant-detail-${product.id}`}>
                  Barva produktu
                </label>
                <button
                  id={`variant-detail-${product.id}`}
                  type="button"
                  onClick={() => setVariantOpen((open) => !open)}
                  className="w-full bg-cream border border-anthracite/10 rounded-full px-3 py-1.5 text-[11px] tracking-widest uppercase text-stone shadow-sm hover:border-anthracite/30 focus:outline-none focus:ring-1 focus:ring-honey/70 focus:border-honey/60 transition-colors flex items-center justify-between gap-2"
                >
                  <span className="truncate text-left">
                    {selectedVariant || product.variants![0]}
                  </span>
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
                            setSelectedImage('');
                            const img = product.variantImages?.[v] || product.images[0] || '';
                            const idx = img ? Math.max(0, product.images.indexOf(img)) : 0;
                            setSelectedImageIndex(idx);
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
          </div>

          <p className="text-stone leading-relaxed">{product.description}</p>

          {(product.handmadeTitle || product.handmadeDescription) && (
            <div className="mt-2 bg-honey-light border border-honey/20 rounded-md p-4 space-y-1">
              {product.handmadeTitle && (
                <p className="text-[11px] font-semibold uppercase tracking-widest text-honey">
                  {product.handmadeTitle}
                </p>
              )}
              {product.handmadeDescription && (
                <p className="text-xs text-stone leading-relaxed">
                  {product.handmadeDescription}
                </p>
              )}
            </div>
          )}

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
                  <p className="text-[10px] font-semibold text-stone uppercase tracking-wide">Hoření</p>
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
            {product.dimensions && (
              <div className="flex items-start gap-2 p-3 bg-stone/8">
                <Weight size={14} className="text-stone mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-stone uppercase tracking-wide">Rozměry</p>
                  <p className="text-xs text-stone/80 mt-0.5">{product.dimensions}</p>
                </div>
              </div>
            )}
          </div>

          {/* Care accordion */}
          <div className="bg-cream border border-anthracite/8">
            <button
              type="button"
              onClick={() => setCareOpen((o) => !o)}
              aria-expanded={careOpen}
              className="w-full flex items-center justify-between gap-3 p-4 text-left"
            >
              <span className="font-serif text-base font-semibold text-anthracite">
                Použití, péče a bezpečnostní upozornění o svíčce
              </span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-stone transition-transform ${careOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {careOpen && (
              <div className="border-t border-anthracite/8 p-4">
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-stone">
                      Co očekávat při hoření:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3 text-sm text-stone leading-relaxed">
                        <span className="mt-2 w-1 h-1 flex-shrink-0 bg-stone" />
                        Nerovnoměrné odhořívání: U dekorativních svíček je kvůli jejich specifickému tvaru běžné a
                        přirozené.
                      </li>
                      <li className="flex items-start gap-3 text-sm text-stone leading-relaxed">
                        <span className="mt-2 w-1 h-1 flex-shrink-0 bg-stone" />
                        Stékání vosku: Vzhledem k designu může vosk vytékat více než u klasických svíček. Vždy používejte
                        dostatečně velký nehořlavý podnos, nikdy nestavte svíčku přímo na nábytek.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-stone">
                      Jak se o svíčku starat:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3 text-sm text-stone leading-relaxed">
                        <span className="mt-2 w-1 h-1 flex-shrink-0 bg-stone" />
                        Knot: Před každým zapálením jej zkraťte na 3–5 mm. Zamezíte tím silnému kouření.
                      </li>
                      <li className="flex items-start gap-3 text-sm text-stone leading-relaxed">
                        <span className="mt-2 w-1 h-1 flex-shrink-0 bg-stone" />
                        Doba hoření: Ideálně maximálně 1 hodinu. Během hoření se svíčkou nemanipulujte, aby nedošlo k
                        převržení nebo vytečení vosku.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-stone">
                      Bezpečnostní upozornění:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3 text-sm text-stone leading-relaxed">
                        <span className="mt-2 w-1 h-1 flex-shrink-0 bg-stone" />
                        Určeno pouze pro dospělé a svéprávné osoby. Používejte na vlastní nebezpečí.
                      </li>
                      <li className="flex items-start gap-3 text-sm text-stone leading-relaxed">
                        <span className="mt-2 w-1 h-1 flex-shrink-0 bg-stone" />
                        Svíčky nejsou určeny ke konzumaci.
                      </li>
                      <li className="flex items-start gap-3 text-sm text-stone leading-relaxed">
                        <span className="mt-2 w-1 h-1 flex-shrink-0 bg-stone" />
                        Nikdy nenechávejte hořící svíčku bez dozoru.
                      </li>
                      <li className="flex items-start gap-3 text-sm text-stone leading-relaxed">
                        <span className="mt-2 w-1 h-1 flex-shrink-0 bg-stone" />
                        Upozornění pro citlivé osoby: Některé esenciální oleje nemusí být vhodné pro těhotné/kojící ženy,
                        malé děti a zvířata. Naše oleje jsou bez parabenů a ftalátů a splňují normy IFRA.
                      </li>
                    </ul>
                  </div>

                  <p className="text-xs text-stone/70">
                    💡 Kompletní informace o složení a podrobný návod najdete na stránce{' '}
                    <Link to="/care" className="text-honey hover:underline">
                      Péče o svíčky
                    </Link>
                    .
                  </p>
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
              {added ? 'Přidáno ✓' : product.inStock ? 'Přidat do košíku' : 'Vyprodáno'}
            </button>
          </div>

          <p className="text-xs text-stone/50">
            Doprava přes výdejní místa Packeta. Platba bankovním převodem.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
