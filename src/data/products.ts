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
  
  {
    id: '6',
    name: 'Voskovaný ubrousek kuře',
    slug: 'voskovany-ubrousek-kure',
    price: 120,
    category: 'voskové obaly',
    shortDescription: 'Voskové ubrousky - ekologická alternativa k potravinové fólii a alobalu.',
    description:
      "Voskové ubrousky jsou ekologická alternativa k potravinové fólii a alobalu. Díky kombinaci bavlny a přírodního vosku jsou tvárné teplem rukou se přizpůsobí tvaru nádoby nebo potraviny a drží na místě. Používáním voskových ubrousků snižujete množství odpadu a zároveň uchováte potraviny déle čerstvé.",
    materials: '100% bavlna, včelí vosk, přírodní pryskyřice, jojobový olej',
    badge: 'Novinka',
    images: [
      photo('voskovy_ubrousek_kure_1.JPG'),
      photo('voskovy_ubrousek_kure_2.JPG'),
    ],
    variants: ['S', 'M', 'L'],
    enableVariantPriceSwitch: true,
    variantPrices: {
      S: 120,
      M: 180,
      L: 250,
    },
    variantDimensions: {
      S: 'výška: 20 cm | šířka: 20 cm',
      M: 'výška: 30 cm | šířka: 30 cm',
      L: 'výška: 45 cm | šířka: 45 cm',
    },
    inStock: true,
    dimensions: 'výška: 20 cm | šířka: 20 cm',
    handmadeTitle: 'Originální ruční práce',
    handmadeDescription:
      'Drobné odchylky, jako malé flíčky nebo rýhy, jsou známkou ruční výroby – každý kus je originál.',
  },
  {
    id: '7',
    name: 'Voskovaný ubrousek husy',
    slug: 'voskovany-ubrousek-husy',
    price: 120,
    category: 'voskové obaly',
    shortDescription: 'Voskové ubrousky - ekologická alternativa k potravinové fólii a alobalu.',
    description:
      'Voskové ubrousky jsou ekologická alternativa k potravinové fólii a alobalu. Díky kombinaci bavlny a přírodního vosku jsou tvárné teplem rukou se přizpůsobí tvaru nádoby nebo potraviny a drží na místě. Používáním voskových ubrousků snižujete množství odpadu a zároveň uchováte potraviny déle čerstvé.',
    materials: '100% bavlna, včelí vosk, přírodní pryskyřice, jojobový olej',
    badge: 'Novinka',
    images: [
      photo('voskovy_ubrousek_husy_1.JPG'),
      photo('voskovy_ubrousek_husy_2.JPG'),
    ],
    variants: ['S', 'M', 'L'],
    enableVariantPriceSwitch: true,
    variantPrices: {
      S: 120,
      M: 180,
      L: 250,
    },
    variantDimensions: {
      S: 'výška: 20 cm | šířka: 20 cm',
      M: 'výška: 30 cm | šířka: 30 cm',
      L: 'výška: 45 cm | šířka: 45 cm',
    },
    inStock: true,
    dimensions: 'výška: 20 cm | šířka: 20 cm',
    handmadeTitle: 'Originální ruční práce',
    handmadeDescription:
      'Drobné odchylky, jako malé flíčky nebo rýhy, jsou známkou ruční výroby – každý kus je originál.',
  },
  {
    id: '8',
    name: 'Voskovaný ubrousek čtverec',
    slug: 'voskovany-ubrousek-ctverec',
    price: 120,
    category: 'voskové obaly',
    shortDescription: 'Voskové ubrousky - ekologická alternativa k potravinové fólii a alobalu.',
    description:
      'Voskové ubrousky jsou ekologická alternativa k potravinové fólii a alobalu. Díky kombinaci bavlny a přírodního vosku jsou tvárné teplem rukou se přizpůsobí tvaru nádoby nebo potraviny a drží na místě. Používáním voskových ubrousků snižujete množství odpadu a zároveň uchováte potraviny déle čerstvé.',
    materials: '100% bavlna, včelí vosk, přírodní pryskyřice, jojobový olej',
    badge: 'Novinka',
    images: [
      photo('voskovy_ubrousek_ctverec_1.JPG'),
      photo('voskovy_ubrousek_ctverec_2.JPG'),
    ],
    variants: ['S', 'M', 'L'],
    enableVariantPriceSwitch: true,
    variantPrices: {
      S: 120,
      M: 180,
      L: 250,
    },
    variantDimensions: {
      S: 'výška: 20 cm | šířka: 20 cm',
      M: 'výška: 30 cm | šířka: 30 cm',
      L: 'výška: 45 cm | šířka: 45 cm',
    },
    inStock: true,
    dimensions: 'výška: 20 cm | šířka: 20 cm',
    handmadeTitle: 'Originální ruční práce',
    handmadeDescription:
      'Drobné odchylky, jako malé flíčky nebo rýhy, jsou známkou ruční výroby – každý kus je originál.',
  },
  {
    id: '9',
    name: 'Voskovaný ubrousek set S+M+L',
    slug: 'voskovany-ubrousek-set-S+M+L',
    price: 450,
    category: 'voskové obaly',
    shortDescription: 'Voskové ubrousky - ekologická alternativa k potravinové fólii a alobalu.',
    description:
      'Voskové ubrousky jsou ekologická alternativa k potravinové fólii a alobalu. Díky kombinaci bavlny a přírodního vosku jsou tvárné teplem rukou se přizpůsobí tvaru nádoby nebo potraviny a drží na místě. Používáním voskových ubrousků snižujete množství odpadu a zároveň uchováte potraviny déle čerstvé.',
    materials: '100% bavlna, včelí vosk, přírodní pryskyřice, jojobový olej',
    badge: 'Novinka',
    images: [
      photo('voskove_ubrousky_set_S+M+L.JPG'),
      photo('voskove_ubrousky_set_S+M+L_2.JPG'),
    ],
    variants: ['S+M+L'],
    inStock: true,
    dimensions: 'výška: 20 cm | šířka: 20 cm \n výška: 30 cm | šířka: 30 cm \n výška: 45 cm | šířka: 45 cm',
    handmadeTitle: 'Originální ruční práce',
    handmadeDescription:
      'Drobné odchylky, jako malé flíčky nebo rýhy, jsou známkou ruční výroby – každý kus je originál.',
  },
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
