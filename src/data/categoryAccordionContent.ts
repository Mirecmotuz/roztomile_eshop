import type { ProductCategory } from '../types';

export interface CategoryAccordionSection {
  heading: string;
  bullets: string[];
}

export interface CategoryAccordionContent {
  title: string;
  sections: CategoryAccordionSection[];
  /** Odstavec pod sekcí bez odkazu. */
  footerPlain?: string;
  /** Odkaz na /care uprostřed věty (např. pro svíčky). */
  footerCareLink?: {
    before: string;
    linkLabel: string;
    after: string;
  };
}

export const categoryAccordionByCategory: Record<
  ProductCategory,
  CategoryAccordionContent | null
> = {
  'svíčky': {
    title: 'Použití, péče a bezpečnostní upozornění o svíčce',
    sections: [
      {
        heading: 'Co očekávat při hoření:',
        bullets: [
          'Nerovnoměrné odhořívání: U dekorativních svíček je kvůli jejich specifickému tvaru běžné a přirozené.',
          'Stékání vosku: Vzhledem k designu může vosk vytékat více než u klasických svíček. Vždy používejte dostatečně velký nehořlavý podnos, nikdy nestavte svíčku přímo na nábytek.',
        ],
      },
      {
        heading: 'Jak se o svíčku starat:',
        bullets: [
          'Knot: Před každým zapálením jej zkraťte na 3–5 mm. Zamezíte tím silnému kouření.',
          'Doba hoření: Ideálně maximálně 1 hodinu. Během hoření se svíčkou nemanipulujte, aby nedošlo k převržení nebo vytečení vosku.',
        ],
      },
      {
        heading: 'Bezpečnostní upozornění:',
        bullets: [
          'Určeno pouze pro dospělé a svéprávné osoby. Používejte na vlastní nebezpečí.',
          'Svíčky nejsou určeny ke konzumaci.',
          'Nikdy nenechávejte hořící svíčku bez dozoru.',
          'Upozornění pro citlivé osoby: Některé esenciální oleje nemusí být vhodné pro těhotné/kojící ženy, malé děti a zvířata. Naše oleje jsou bez parabenů a ftalátů a splňují normy IFRA.',
        ],
      },
    ],
    footerCareLink: {
      before: '💡 Kompletní informace o složení a podrobný návod najdete na stránce ',
      linkLabel: 'Péče o svíčky',
      after: '.',
    },
  },

  'voskové obaly': {
    title: 'Použití a péče o voskové ubrousky',
    sections: [
      {
        heading: 'Použití:',
        bullets: [
          'balení pečiva, ovoce a zeleniny',
          'zakrývání misek a nádob',
          'svačiny na cesty',
          'ubrousek stačí zahřát rukama a přizpůsobit požadovanému tvaru'
        ],
      },
      {
        heading: 'Údržba:',
        bullets: [
          'omývejte studenou nebo vlažnou vodou',
          'použijte jemný přírodní prostředek na nádobí',
          'nechte volně uschnout',
          'nevhodné do myčky, mikrovlnky ani na horké potraviny'
        ],
      },
      {
        heading: 'Životnost:',
        bullets: [
          'při správné péči vydrží ubrousky přibližně 6–12 měsíců. Poté je můžete znovu navoskovat nebo ekologicky zlikvidovat',
        ],
      },
      {
        heading: 'Upozornění:',
        bullets: [
          'nevhodné pro syrové maso a ryby',
          'neuchovávejte v blízkosti zdroje tepla',
          'přírodní materiál – každý kus je originál'
        ],
      },
      {
        heading: 'Proč si je zamilujete:',
        bullets: [
          'opakovaně použitelné ♻️',
          'šetrné k přírodě',
          'stylový doplněk do kuchyně',
          'pomáhají udržet potraviny čerstvé'
        ],
      },
    ],
  },

  'balzámy': {
    title: 'Použití a skladování balzámu',
    sections: [
      {
        heading: 'Použití:',
        bullets: [
          'Nanášejte tenkou vrstvu na rty podle potřeby; výhradně k vnějšímu použití.',
          'Po otevření spotřebujte v rozumné době a při změně vůně či barvy výrobek vyřaďte.',
        ],
      },
      {
        heading: 'Skladování:',
        bullets: ['Uchovávejte v chladu a suchu, mimo přímé slunce a zdroje tepla.'],
      },
      {
        heading: 'Upozornění:',
        bullets: [
          'Při podráždění přestaňte používat. U dětí do 3 let používejte jen pod dohledem dospělého.',
        ],
      },
    ],
  },
};
