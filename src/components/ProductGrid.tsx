import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from './ProductCard';
import { products } from '../data/products';
import { ProductCategory } from '../types';

const categories: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Všechny' },
  { value: 'sviečky', label: 'Svíčky' },
  { value: 'včelí vosk', label: 'Včelí vosk' },
  { value: 'balzamy', label: 'Balzámy' },
];

const sortOptions = [
  { value: 'default', label: 'Doporučené' },
  { value: 'price-asc', label: 'Cena: od nejnižší' },
  { value: 'price-desc', label: 'Cena: od nejvyšší' },
  { value: 'name', label: 'Podle názvu' },
];

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function ProductGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [sortOpen, setSortOpen] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);

  const activeCategory = (searchParams.get('category') ?? 'all') as ProductCategory | 'all';
  const focusTarget = searchParams.get('focus');
  const activeSortLabel = sortOptions.find((o) => o.value === sort)?.label ?? 'Doporučené';

  useEffect(() => {
    const urlQuery = searchParams.get('q') ?? '';
    setSearch((prev) => (prev === urlQuery ? prev : urlQuery));
  }, [searchParams]);

  useEffect(() => {
    if (!sortOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sortOpen]);

  useEffect(() => {
    if (!focusTarget) return;

    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    let timeoutId: number | undefined;
    if (focusTarget === 'search') {
      timeoutId = window.setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }, 300) as unknown as number;
    }

    const params = new URLSearchParams(searchParams);
    params.delete('focus');
    setSearchParams(params, { replace: true });

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [focusTarget, searchParams, setSearchParams]);

  const filtered = useMemo(() => {
    let list = activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);

    const trimmedQuery = search.trim();
    if (trimmedQuery) {
      const normalizedQuery = normalizeText(trimmedQuery);
      list = list.filter((p) => {
        const parts = [
          p.name,
          p.category,
          p.shortDescription,
          p.description,
          (p as any).scent,
          (p as any).materials,
        ].filter(Boolean) as string[];

        const normalizedHaystack = normalizeText(parts.join(' '));
        return normalizedHaystack.includes(normalizedQuery);
      });
    }

    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'cs'));
    return list;
  }, [activeCategory, sort, search]);

  const setCategory = (cat: ProductCategory | 'all') => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'all') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params, { replace: true });
  };

  const updateSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    setSearchParams(params, { replace: true });
  };

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 py-16">
      {/* Section header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-honey mb-3">Nabídka produktů</p>
        <h2 className="font-serif text-4xl text-anthracite">Ručně vyrobené s láskou</h2>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
        {/* Category tabs */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2 sm:flex-1">
          {categories.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={`px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest rounded-full transition-colors ${
                activeCategory === value
                  ? 'bg-anthracite text-cream border border-anthracite/80'
                  : 'bg-cream text-stone border border-anthracite/15 hover:border-anthracite/40 hover:text-anthracite'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col gap-3 w-full lg:w-auto lg:flex-row lg:items-center lg:justify-end">
          {/* Search bar */}
          <div className="w-full sm:w-64 md:w-80 relative">
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => updateSearch(e.target.value)}
              placeholder="Hledat produkt…"
              className="w-full px-4 py-2 text-xs rounded-full border border-anthracite/10 bg-cream text-anthracite placeholder:text-stone/60 focus:outline-none focus:ring-1 focus:ring-honey/70 focus:border-honey/60"
            />
            {search && (
              <button
                type="button"
                onClick={() => updateSearch('')}
                aria-label="Vyčistit vyhledávání"
                className="absolute inset-y-0 right-2 flex items-center text-stone/60 hover:text-anthracite transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div ref={sortRef} className="relative text-xs">
            <button
              type="button"
              onClick={() => setSortOpen((open) => !open)}
              className="flex items-center gap-2 bg-cream border border-anthracite/10 rounded-full px-3 py-1 text-stone shadow-sm hover:border-anthracite/30 transition-colors"
            >
              <SlidersHorizontal size={13} className="shrink-0" />
              <span className="whitespace-nowrap">{activeSortLabel}</span>
              <ChevronDown size={12} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>

            {sortOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-cream border border-anthracite/10 rounded-xl shadow-lg py-1 z-10 overflow-hidden">
                {sortOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setSort(value);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-[11px] tracking-widest uppercase transition-colors ${
                      sort === value
                        ? 'bg-anthracite text-cream'
                        : 'text-stone hover:bg-anthracite/5 hover:text-anthracite'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-stone text-sm py-12 text-center">
          {search.trim()
            ? <>Nenašli jsme žádný produkt pro „{search.trim()}“. Zkuste jiné slovo nebo zrušte filtry.</>
            : 'Žádné produkty v této kategorii.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <p className="text-xs text-stone/60 mt-10 text-center uppercase tracking-widest">{filtered.length} produktů</p>
    </section>
  );
}
