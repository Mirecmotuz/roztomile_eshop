import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Velikonoční svíčka — Jarní louka',
    slug: 'velkonocna-sviecka-jarna-luka',
    price: 14.90,
    category: 'svíčky',
    shortDescription: 'Ručně litá sójová svíčka s vůní čerstvých květů a trávy.',
    description:
      'Tato velikonoční svíčka je ručně litá ze 100 % přírodního sójového vosku. Vůně jemné jarní louky přinese do vašeho domova pocit svěžesti a obnovy. Ideální dárek k Velikonocům nebo radost pro sebe.',
    scent: 'Jaro, zelené stonky, bílý květ, jemná zemina',
    materials: '100 % sójový vosk, bavlněný knot, přírodní éterické oleje',
    badge: 'Novinka',
    images: [
      'https://images.unsplash.com/photo-1603905219867-ef465f9c8cd5?w=600&q=80',
      'https://images.unsplash.com/photo-1603905219867-ef465f9c8cd5?w=600&q=80',
    ],
    inStock: true,
    weight: '200 g',
    burnTime: '40 hodín',
  },
  {
    id: '2',
    name: 'Velikonoční svíčka — Vanilka & Tonka',
    slug: 'velkonocna-sviecka-vanilka-tonka',
    price: 14.90,
    category: 'svíčky',
    shortDescription: 'Teplá a smyslná vůně vanilky s hřejivým tónem tonky.',
    description:
      'Luxusní svíčka s bohatou kombinací madagaskarské vanilky a vzácného tonkového bobu. Hřejivá, sladká vůně vytváří útulnou atmosféru během velikonočních svátků. Ručně litá v malém množství.',
    scent: 'Madagaskarská vanilka, tonkový bob, santalové dřevo',
    materials: '100 % sójový vosk, bavlněný knot, parfémové éterické oleje',
    badge: 'Bestseller',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80',
    ],
    inStock: true,
    weight: '200 g',
    burnTime: '40 hodín',
  },
  {
    id: '3',
    name: 'Velikonoční svíčka — Levandule & Eukalyptus',
    slug: 'velkonocna-sviecka-lavender-eukalyptus',
    price: 16.50,
    category: 'svíčky',
    shortDescription: 'Uklidňující kombinace levandule a čerstvého eukalyptu.',
    description:
      'Přírodní sójová svíčka s bylinkovou vůní levandulových polí a ostrým, čerstvým eukalyptem. Perfektní do koupelny nebo ložnice jako relaxační rituál. Ručně vyrobená s láskou.',
    scent: 'Pravá levandule, eukalyptus, máta, čerstvý vzduch',
    materials: '100 % sójový vosk, bavlněný knot, přírodní éterické oleje',
    images: [
      'https://images.unsplash.com/photo-1608571423539-e951cb2b69b5?w=600&q=80',
      'https://images.unsplash.com/photo-1608571423539-e951cb2b69b5?w=600&q=80',
    ],
    inStock: true,
    weight: '220 g',
    burnTime: '45 hodín',
  },
  {
    id: '4',
    name: 'Včelí vosk — Natural wrap S (3 ks)',
    slug: 'vcelaci-vosk-wrap-small',
    price: 9.90,
    category: 'včelí vosk',
    shortDescription: 'Ekologická alternativa k potravinové fólii z přírodního včelího vosku.',
    description:
      'Sada tří malých voskovaných plátýnek (velikost S) jako udržitelná náhrada za plastovou potravinovou fólii. Přírodní včelí vosk, jojobový olej a pryskyřice stromu pinie zaručují pevné uzavření potravin. Pratelné ve studené vodě, vydrží 1 rok.',
    materials: 'Organická bavlna, včelí vosk, jojobový olej, pryskyřice pinie',
    badge: 'Bestseller',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    ],
    inStock: true,
  },
  {
    id: '5',
    name: 'Včelí vosk — Natural wrap M (3 ks)',
    slug: 'vcelaci-vosk-wrap-medium',
    price: 11.90,
    category: 'včelí vosk',
    shortDescription: 'Středně velká voskovaná plátýnka pro zeleninu a ovoce.',
    description:
      'Sada tří voskovaných plátýnek velikosti M. Ideální na zabalení sýrů, zeleniny, chleba nebo misek. Teplo rukou aktivuje vosk, který se pevně přitiskne k povrchu. 100 % přírodní, kompostovatelné.',
    materials: 'Organická bavlna, včelí vosk, jojobový olej, pryskyřice pinie',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    ],
    inStock: true,
  },
  {
    id: '6',
    name: 'Včelí vosk — Natural wrap L (2 ks)',
    slug: 'vcelaci-vosk-wrap-large',
    price: 11.90,
    category: 'včelí vosk',
    shortDescription: 'Velká voskovaná plátýnka na celé bochníky chleba a mísy.',
    description:
      'Dvě velká voskovaná plátýnka (velikost L) — ideální na zabalení větší zeleniny, celého bochníku chleba nebo na přikrytí mísy. Šetrné k planetě, krásný design s ručním potiskem.',
    materials: 'Organická bavlna, včelí vosk, jojobový olej, pryskyřice pinie',
    badge: 'Novinka',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    ],
    inStock: true,
  },
  {
    id: '7',
    name: 'Přírodní balzám na rty — Růžové lístky',
    slug: 'balzam-pery-ruzove-listky',
    price: 5.90,
    category: 'balzámy',
    shortDescription: 'Jemný výživný balzám s vůní čerstvých růží a mandlovým olejem.',
    description:
      'Intenzivně vyživující balzám na rty bez syntetických přísad. Kombinace rakytníkového oleje, bambuckého másla a růžové vody poskytuje dlouhotrvající hydrataci. Jemná růžová vůně dělá z každého použití příjemný rituál.',
    scent: 'Růžová voda, sladká mandle, jemná vanilka',
    materials: 'Včelí vosk, bambucké máslo, mandlový olej, rakytníkový olej, růžová voda, vitamín E',
    badge: 'Bestseller',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4e6232bf5e2f?w=600&q=80',
      'https://images.unsplash.com/photo-1586495777744-4e6232bf5e2f?w=600&q=80',
    ],
    inStock: true,
    weight: '10 g',
  },
  {
    id: '8',
    name: 'Přírodní balzám na rty — Mátová svěžest',
    slug: 'balzam-pery-mata-sviezost',
    price: 5.90,
    category: 'balzámy',
    shortDescription: 'Chladivý balzám s organickou mátou a kokosem.',
    description:
      'Osvěžující balzám na rty s organickým mátovým éterickým olejem a za studena lisovaným kokosovým olejem. Poskytuje okamžitou hydrataci a jemný chladivý efekt. Bez parafínu, bez silikonů — jen příroda.',
    scent: 'Organická máta peprná, kokos, jemný citrusový tón',
    materials: 'Včelí vosk, kokosový olej, mandlový olej, mátový éterický olej, vitamín E',
    badge: 'Novinka',
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
    ],
    inStock: true,
    weight: '10 g',
    variants: ['biela', 'čierna', 'červená', 'žltá', 'zelená', 'modrá', 'fialová', 'oranžová', 'čierna'],
  },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const getProductsByCategory = (category: string): Product[] =>
  products.filter((p) => p.category === category);
