import { Product } from '../types';
const photos = import.meta.glob('./photos/*.{jpeg,jpg,png,webp,JPG}', {
  eager: true,
  as: 'url',
}) as Record<string, string>;

const photo = (fileName: string) => {
  const key = `./photos/${fileName}`;
  const url = photos[key];
  if (!url) {
    console.warn(`[products] Missing photo: ${key}`);
    return '';
  }
  return url;
};

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
      photo('kvetinove_fialove.JPG'),
      photo('kvetinove_ruzove.JPG'),
    ],
    variants: ['fialová', 'růžová'],
    enableVariantImageSwitch: true,
    variantImages: {
      fialová: photo('kvetinove_fialove.JPG'),
      růžová: photo('kvetinove_ruzove.JPG'),
    },
    inStock: false,
    weight: '151 g',
    burnTime: '7 hodin',
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
      photo('pruhy_zeleny.JPG'),
      photo('pruhy_ruzovy.JPG'),
      photo('pruhy_zluty.JPG'),
      photo('pruhy_fialovy.JPG'),
      photo('pruhy_svetlezeleny.JPG'),
      photo('pruhy_lososovy.JPG')
    ],
    variants: ['zelená', 'růžová', 'žlutá', 'fialová', 'světlezelená', 'lososová'],
    enableVariantImageSwitch: true,
    variantImages: {
      zelená: photo('pruhy_zeleny.JPG'),
      růžová: photo('pruhy_ruzovy.JPG'),
      žlutá: photo('pruhy_zluty.JPG'),
      fialová: photo('pruhy_fialovy.JPG'),
      světlezelená: photo('pruhy_svetlezeleny.JPG'),
      lososová: photo('pruhy_lososovy.JPG'),
    },
    inStock: false,
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
      photo('relief_zluty.JPG'),
      photo('relief_svetle_zeleny.JPG'),
      photo('relief_zeleny.JPG'),
      photo('relief_bily.JPG'),
      photo('relief_ruzovy.JPG'),
      photo('relief_fialovy.JPG'),
      photo('relief_modry.JPG'),
    ],
    variants: ['žlutá', 'světlezelená', 'zelená', 'bílá', 'růžová', 'fialová', 'modrá'],
    enableVariantImageSwitch: true,
    variantImages: {
      žlutá: photo('relief_zluty.JPG'),
      světlezelená: photo('relief_svetle_zeleny.JPG'),
      zelená: photo('relief_zeleny.JPG'),
      bílá: photo('relief_bily.JPG'),
      růžová: photo('relief_ruzovy.JPG'),
      fialová: photo('relief_fialovy.JPG'),
      modrá: photo('relief_modry.JPG'),
    },
    inStock: false,
    weight: '80 g',
    burnTime: '4 hodiny',
    dimensions: 'výška: 6,5 cm | šířka: 5 cm',
    handmadeTitle: 'Originální ruční práce',
    handmadeDescription:
      'Drobné odchylky, jako bublinky, rýhy nebo malé rozdíly v barvě, jsou známkou ruční výroby – každý kus je originál.',
    },
  {
    id: '4',
    name: 'Velikonoční vajíčko s loučním kvítím',
    slug: 'velikonocni-vajicko-s-loucnim-kvitim',
    price: 100,
    category: 'svíčky',
    shortDescription: 'Ručně litá sójová svíčka.',
    description:
      'Přineste kousek jara do svého domova s naším ručně litým Velikonočním vajíčkem ze sójového vosku, zdobeným jemným lučním kvítím. Svíčka, která a zároveň dodá vašemu prostoru útulnou jarní atmosféru.',
    materials: '100 % sójový vosk, bavlněný knot, přírodní barvy do svíček',
    badge: 'Bestseller',
    images: [
      photo('lucni_kviti_ruzovy.JPG'),
      photo('lucni_kviti_fialove.JPG'),
      photo('lucni_kviti_zeleny.JPG'),
    ],
    variants: ['růžová', 'fialová', 'zelená'],
    enableVariantImageSwitch: true,
    variantImages: {
      růžová: photo('lucni_kviti_ruzovy.JPG'),
      fialová: photo('lucni_kviti_fialove.JPG'),
      zelená: photo('lucni_kviti_zeleny.JPG'),
    },
    inStock: false,
    weight: '105 g',
    burnTime: '5 hodiny',
    dimensions: 'výška: 7,5 cm | šířka: 5,5 cm',
    handmadeTitle: 'Originální ruční práce',
    handmadeDescription:
      'Drobné odchylky, jako bublinky, rýhy nebo malé rozdíly v barvě, jsou známkou ruční výroby – každý kus je originál.',
    },
  {
    id: '5',
    name: 'Velikonoční vajíčko se zajíčkem',
    slug: 'velikonocni-vajicko-se-zajickem',
    price: 100,
    category: 'svíčky',
    shortDescription: 'Ručně litá sójová svíčka.',
    description:
      'Přineste kousek jara do svého domova s naším ručně litým Velikonočním vajíčkem ze sójového vosku, zdobeným krásným zajíčkem. Svíčka, která a zároveň dodá vašemu prostoru útulnou jarní atmosféru.',
    materials: '100 % sójový vosk, bavlněný knot, přírodní barvy do svíček',
    images: [
      photo('zajic_ruzova.JPG')
    ],
    variants: ['růžová'],
    enableVariantImageSwitch: true,
    variantImages: {
      růžová: photo('zajic_ruzova.JPG'),
    },
    inStock: false,
    weight: '100 g',
    burnTime: '5 hodin',
    dimensions: 'výška: 7 cm | šířka: 5,5 cm',
    handmadeTitle: 'Originální ruční práce',
    handmadeDescription:
      'Drobné odchylky, jako bublinky, rýhy nebo malé rozdíly v barvě, jsou známkou ruční výroby – každý kus je originál.',
  },
  
  // {
  //   id: '6',
  //   name: 'Voskovaný obrousek S',
  //   slug: 'voskovany-obrusek-s',
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
