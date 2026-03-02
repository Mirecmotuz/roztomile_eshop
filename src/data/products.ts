import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Veľkonočná sviečka — Jarná lúka',
    slug: 'velkonocna-sviecka-jarna-luka',
    price: 14.90,
    category: 'sviečky',
    shortDescription: 'Ručne liata sójová sviečka s vôňou čerstvých kvetov a trávy.',
    description:
      'Táto veľkonočná sviečka je ručne liata zo 100 % prírodného sójového vosku. Vôňa jemnej jarnej lúky prinesie do vášho domova pocit svežosti a obnovy. Ideálny darček na Veľkú noc alebo radosť pre seba.',
    scent: 'Jar, zelené stonky, biely kvet, jemná zemina',
    materials: '100 % sójový vosk, bavlnený knôt, prírodné éterické oleje',
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
    name: 'Veľkonočná sviečka — Vanilka & Tonka',
    slug: 'velkonocna-sviecka-vanilka-tonka',
    price: 14.90,
    category: 'sviečky',
    shortDescription: 'Teplá a zmyselná vôňa vanilky s hrejivým tónom tonky.',
    description:
      'Luxusná sviečka s bohatou kombináciou madagaskarskej vanilky a vzácneho tonkového bôbu. Hrejivý, sladký aróma vytvára útulnú atmosféru počas veľkonočných sviatkov. Ručne liata v malom množstve.',
    scent: 'Madagaskarská vanilka, tonkový bôb, santalové drevo',
    materials: '100 % sójový vosk, bavlnený knôt, parfumérske éterické oleje',
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
    name: 'Veľkonočná sviečka — Levanduľa & Eukalyptus',
    slug: 'velkonocna-sviecka-lavender-eukalyptus',
    price: 16.50,
    category: 'sviečky',
    shortDescription: 'Upokojujúca kombinácia levandule a čerstvého eukalyptu.',
    description:
      'Prírodná sójová sviečka s bylinkovou vôňou levanduľových polí a ostrým, čerstvým eukalyptom. Perfektná do kúpeľne alebo spálne ako relaxačný rituál. Ručne vyrobená s láskou.',
    scent: 'Pravá levanduľa, eukalyptus, mäta, čerstvý vzduch',
    materials: '100 % sójový vosk, bavlnený knôt, prírodné éterické oleje',
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
    shortDescription: 'Ekologická alternatíva k potravinovej fólii z prírodného včelieho vosku.',
    description:
      'Sada troch malých voskovaných plátienok (veľkosť S) ako udržateľná náhrada za plastikovú potravinovú fóliu. Prírodný včelí vosk, jojobový olej a živica stromu pinia zaručujú pevné uzavretie potravín. Prateľné studenou vodou, vydrží 1 rok.',
    materials: 'Organická bavlna, včelí vosk, jojobový olej, živica pinie',
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
    shortDescription: 'Stredne veľké voskované plátienka pre zeleninu a ovocie.',
    description:
      'Sada troch voskovaných plátienok veľkosti M. Ideálne na zabalenie syrov, zeleniny, chleba alebo misiek. Teplo rúk aktivuje vosk, ktorý sa pevne pritlačí na povrch. 100 % prírodné, kompostovateľné.',
    materials: 'Organická bavlna, včelí vosk, jojobový olej, živica pinie',
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
    shortDescription: 'Veľké voskované plátienka na celé bochníky chleba a misky.',
    description:
      'Dve veľké voskované plátienka (veľkosť L) — ideálne na zabalenie väčšej zeleniny, celého bochníka chleba alebo na prikrytie misy. Šetrné k planéte, krásny dizajn s ručnou potlačou.',
    materials: 'Organická bavlna, včelí vosk, jojobový olej, živica pinie',
    badge: 'Novinka',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    ],
    inStock: true,
  },
  {
    id: '7',
    name: 'Prírodný balzam na pery — Ružové lístky',
    slug: 'balzam-pery-ruzove-listky',
    price: 5.90,
    category: 'balzamy',
    shortDescription: 'Jemný výživný balzam s vôňou čerstvých ruží a mandľovým olejom.',
    description:
      'Intenzívne vyživujúci balzam na pery bez syntetických prísad. Kombinácia rakytníkového oleja, shea masla a ružovej vody poskytuje dlhotrvajúcu hydratáciu. Jemná ružová vôňa robí každé použitie príjemným rituálom.',
    scent: 'Ružová voda, sladká manduľa, jemná vanilka',
    materials: 'Včelí vosk, shea maslo, mandľový olej, rakytníkový olej, ružová voda, vitamín E',
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
    name: 'Prírodný balzam na pery — Mätová sviežosť',
    slug: 'balzam-pery-mata-sviezost',
    price: 5.90,
    category: 'balzamy',
    shortDescription: 'Chladivý balzam s organickou mätou a kokosom.',
    description:
      'Osviežujúci balzam na pery s organickým mätovým éterickým olejom a kokosovým olejom za studena lisovaným. Poskytuje okamžitú hydratáciu a jemný chladivý efekt. Bez parafínu, bez silikónov — len príroda.',
    scent: 'Organická mäta pieporná, kokos, jemná citrusová nota',
    materials: 'Včelí vosk, kokosový olej, mandľový olej, mätový éterický olej, vitamín E',
    badge: 'Novinka',
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
    ],
    inStock: true,
    weight: '10 g',
  },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const getProductsByCategory = (category: string): Product[] =>
  products.filter((p) => p.category === category);
