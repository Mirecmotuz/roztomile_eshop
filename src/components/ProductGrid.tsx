import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from './ProductCard';
import { products } from '../data/products';
import { ProductCategory } from '../types';

const categories: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Všetky' },
  { value: 'sviečky', label: 'Sviečky' },
  { value: 'včelí vosk', label: 'Včelí vosk' },
  { value: 'balzamy', label: 'Balzamy' },
];

const sortOptions = [
  { value: 'default', label: 'Odporúčané' },
  { value: 'price-asc', label: 'Cena: od najnižšej' },
  { value: 'price-desc', label: 'Cena: od najvyššej' },
  { value: 'name', label: 'Podľa názvu' },
];

export default function ProductGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('default');

  const activeCategory = (searchParams.get('category') ?? 'all') as ProductCategory | 'all';

  const filtered = useMemo(() => {
    let list = activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'sk'));
    return list;
  }, [activeCategory, sort]);

  const setCategory = (cat: ProductCategory | 'all') => {
    if (cat === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Section header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-honey mb-3">Náš sortiment</p>
        <h2 className="font-serif text-4xl text-anthracite">Ručne vyrobené s láskou</h2>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-1">
          {categories.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={`px-4 py-1.5 text-xs font-medium uppercase tracking-widest transition-colors ${
                activeCategory === value
                  ? 'bg-anthracite text-cream'
                  : 'text-stone hover:text-anthracite border border-transparent hover:border-anthracite/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 text-xs text-stone">
          <SlidersHorizontal size={13} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border-none bg-transparent text-xs text-stone focus:outline-none cursor-pointer"
          >
            {sortOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-stone text-sm py-12 text-center">Žiadne produkty v tejto kategórii.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <p className="text-xs text-stone/60 mt-10 text-center uppercase tracking-widest">{filtered.length} produktov</p>
    </section>
  );
}
