import { Product } from '../types';
const photos = import.meta.glob('./photos/*.{jpeg,jpg,png,webp}', { eager: true, as: 'url' }) as Record<string, string>;
const photo = (fileName: string) => photos[`./photos/${fileName}`];

export const products: Product[] = [
  {
    id: '1',
    name: 'Květinové Velikonoční vajíčko',
    slug: 'kvetinove-velikonocni-vajicko',
    price: 110,
    category: 'svíčky',
    shortDescription: 'Ručně litá sójová svíčka.',
    description:
      'Přineste kousek jara do svého domova s naším ručně litým Velikonočním vajíčkem ze sójového vosku, zdobeným jemným lučním kvítím. Svíčka, která a zároveň dodá vašemu prostoru útulnou jarní atmosféru.',
    materials: '100 % sójový vosk, bavlněný knot, přírodní barvy do svíček',
    badge: 'Novinka',
    images: [
      photo('kvetinove_fialove.jpeg')
    ],
    variants: ['fialová'],
    inStock: true,
    weight: '151 g',
    burnTime: '5 hodin',
    handmadeTitle: 'Originální ruční práce',
    handmadeDescription:
      'Drobné odchylky, jako bublinky, rýhy nebo malé rozdíly v barvě, jsou známkou ruční výroby – každý kus je originál.',
    dimensions: 'výška: 8 cm | šířka: 6 cm',
  },
  {
    id: '2',
    name: 'Pruhované Velikonoční vajíčko ',
    slug: 'pruhované-velikonocni-vajicko',
    price: 70,
    category: 'svíčky',
    shortDescription: 'Ručně litá sójová svíčka.',
    description:
      'Jemné proužky a minimalistický design dělají z této svíčky dekoraci, která vyzdobí váš domov jarní a Velikonoční atmosférou.  Krásně vynikne samostatně i v kombinaci s Velikonočním vajíčkem s jemným reliéfem.',
    materials: '100 % sójový vosk, bavlněný knot, přírodní barvy do svíček',
    badge: 'Bestseller',
    images: [
      photo('pruhy_zelene.jpeg'),
      photo('pruhy_ruzove.jpeg'),
      photo('pruhy_zlte.jpeg'),
      photo('pruhy_fialove.jpeg'),
      photo('pruhy_cervene.jpeg'),
      photo('pruhy_svetlozelene.jpeg'),
      photo('pruhy_lososove.jpeg')
    ],
    variants: ['zelená', 'růžová', 'žlutá', 'fialová', 'červená', 'světlezelená', 'lososová'],
    inStock: true,
    weight: '70 g',
    burnTime: '4 hodiny',
    dimensions: 'výška: 7 cm | šířka: 4,5 cm',
    handmadeTitle: 'Originální ruční práce',
    handmadeDescription:
      'Drobné odchylky, jako bublinky, rýhy nebo malé rozdíly v barvě, jsou známkou ruční výroby – každý kus je originál.',

  },
  {
    id: '3',
    name: 'Velikonoční vajíčko s jemným reliéfem',
    slug: 'velikonocni-vajicko-s-jemnym-reliefem',
    price: 80,
    category: 'svíčky',
    shortDescription: 'Ručně litá sójová svíčka.',
    description:
      'Ručně litá svíčka ze sójového vosku díky své textuře působí přirozeně a elegantně, krásně vynikne samostatně i v kombinaci s pruhovaným Velikonočním vajíčkem. Utvoří vaši jarní či Velikonoční výzdobu.',
    materials: '100 % sójový vosk, bavlněný knot, přírodní barvy do svíček',
    images: [
      photo('relief_zlty.jpeg'),
      photo('relief_svetlomodra.jpeg'),
      photo('relief_zeleny.jpeg')
    ],
    variants: ['žlutá', 'světlemodrá', 'zelená'],
    inStock: true,
    weight: '80 g',
    burnTime: '4 hodiny',
    dimensions: 'výška: 6,5 cm | šířka: 5 cm',
    handmadeTitle: 'Originální ruční práce',
    handmadeDescription:
      'Drobné odchylky, jako bublinky, rýhy nebo malé rozdíly v barvě, jsou známkou ruční výroby – každý kus je originál.',
    }
  // {
  //   id: '4',
  //   name: 'Včelí vosk — Natural wrap S (3 ks)',
  //   slug: 'vcelaci-vosk-wrap-small',
  //   price: 9.90,
  //   category: 'včelí vosk',
  //   shortDescription: 'Ekologická alternativa k potravinové fólii z přírodního včelího vosku.',
  //   description:
  //     'Sada tří malých voskovaných plátýnek (velikost S) jako udržitelná náhrada za plastovou potravinovou fólii. Přírodní včelí vosk, jojobový olej a pryskyřice stromu pinie zaručují pevné uzavření potravin. Pratelné ve studené vodě, vydrží 1 rok.',
  //   materials: 'Organická bavlna, včelí vosk, jojobový olej, pryskyřice pinie',
  //   badge: 'Bestseller',
  //   images: [
  //     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  //     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  //   ],
  //   inStock: true,
  // },
  // {
  //   id: '5',
  //   name: 'Včelí vosk — Natural wrap M (3 ks)',
  //   slug: 'vcelaci-vosk-wrap-medium',
  //   price: 11.90,
  //   category: 'včelí vosk',
  //   shortDescription: 'Středně velká voskovaná plátýnka pro zeleninu a ovoce.',
  //   description:
  //     'Sada tří voskovaných plátýnek velikosti M. Ideální na zabalení sýrů, zeleniny, chleba nebo misek. Teplo rukou aktivuje vosk, který se pevně přitiskne k povrchu. 100 % přírodní, kompostovatelné.',
  //   materials: 'Organická bavlna, včelí vosk, jojobový olej, pryskyřice pinie',
  //   images: [
  //     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  //     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  //   ],
  //   inStock: true,
  // },
  // {
  //   id: '6',
  //   name: 'Včelí vosk — Natural wrap L (2 ks)',
  //   slug: 'vcelaci-vosk-wrap-large',
  //   price: 11.90,
  //   category: 'včelí vosk',
  //   shortDescription: 'Velká voskovaná plátýnka na celé bochníky chleba a mísy.',
  //   description:
  //     'Dvě velká voskovaná plátýnka (velikost L) — ideální na zabalení větší zeleniny, celého bochníku chleba nebo na přikrytí mísy. Šetrné k planetě, krásný design s ručním potiskem.',
  //   materials: 'Organická bavlna, včelí vosk, jojobový olej, pryskyřice pinie',
  //   badge: 'Novinka',
  //   images: [
  //     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  //     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  //   ],
  //   inStock: true,
  // },
  // {
  //   id: '7',
  //   name: 'Přírodní balzám na rty — Růžové lístky',
  //   slug: 'balzam-pery-ruzove-listky',
  //   price: 5.90,
  //   category: 'balzámy',
  //   shortDescription: 'Jemný výživný balzám s vůní čerstvých růží a mandlovým olejem.',
  //   description:
  //     'Intenzivně vyživující balzám na rty bez syntetických přísad. Kombinace rakytníkového oleje, bambuckého másla a růžové vody poskytuje dlouhotrvající hydrataci. Jemná růžová vůně dělá z každého použití příjemný rituál.',
  //   scent: 'Růžová voda, sladká mandle, jemná vanilka',
  //   materials: 'Včelí vosk, bambucké máslo, mandlový olej, rakytníkový olej, růžová voda, vitamín E',
  //   badge: 'Bestseller',
  //   images: [
  //     'https://images.unsplash.com/photo-1586495777744-4e6232bf5e2f?w=600&q=80',
  //     'https://images.unsplash.com/photo-1586495777744-4e6232bf5e2f?w=600&q=80',
  //   ],
  //   inStock: true,
  //   weight: '10 g',
  // },
  // {
  //   id: '8',
  //   name: 'Přírodní balzám na rty — Mátová svěžest',
  //   slug: 'balzam-pery-mata-sviezost',
  //   price: 5.90,
  //   category: 'balzámy',
  //   shortDescription: 'Chladivý balzám s organickou mátou a kokosem.',
  //   description:
  //     'Osvěžující balzám na rty s organickým mátovým éterickým olejem a za studena lisovaným kokosovým olejem. Poskytuje okamžitou hydrataci a jemný chladivý efekt. Bez parafínu, bez silikonů — jen příroda.',
  //   scent: 'Organická máta peprná, kokos, jemný citrusový tón',
  //   materials: 'Včelí vosk, kokosový olej, mandlový olej, mátový éterický olej, vitamín E',
  //   badge: 'Novinka',
  //   images: [
  //     'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
  //     'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
  //   ],
  //   inStock: true,
  //   weight: '10 g',
  //   variants: ['biela', 'čierna', 'červená', 'žltá', 'zelená', 'modrá', 'fialová', 'oranžová', 'čierna'],
  // },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const getProductsByCategory = (category: string): Product[] =>
  products.filter((p) => p.category === category);
