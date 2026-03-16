import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const sections = [
  {
    icon: <Flame size={20} />,
    title: 'Péče o svíčky',
    color: 'honey',
    groups: [
      {
        heading: 'Co očekávat při hoření:',
        items: [
          'U dekorativních svíček může docházet k nerovnoměrnému odhořívání.',
          'Kvůli tvaru svíčky může vosk vytékat nebo stékat – je to běžné a u některých tvarů může být množství vosku výraznější než u klasických válcových svíček.',
        ],
      },
      {
        heading: 'Jak se o svíčky starat:',
        items: [
          'Před každým zapálením zkraťte knot na 3–5 mm.',
          'Dekorativní svíčku vždy umístěte na dostatečně velký nehořlavý podnos nebo talířek.',
          'Nikdy svíčku nestavte přímo na nábytek nebo citlivé povrchy.',
          'Hořet by měla ideálně maximálně 1 hodinu a během hoření s ní nemanipulujte, aby nedošlo k vytékání vosku nebo převrhnutí svíčky.',
        ],
      },
    ],
    highlight:
      '✨ Díky těmto jednoduchým pravidlům si můžete dekorativní svíčku užít bezpečně a zároveň ocenit její jedinečný design.',
  },
];

const colorMap: Record<string, { bg: string; icon: string; dot: string }> = {
  honey: { bg: 'bg-honey-light', icon: 'bg-honey/15 text-honey-dark', dot: 'bg-honey' },
  stone: { bg: 'bg-stone/8',    icon: 'bg-stone/15 text-stone',      dot: 'bg-stone' },
  rose:  { bg: 'bg-rose-50',    icon: 'bg-rose-100 text-rose-500',   dot: 'bg-rose-400' },
};

export default function CarePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-honey">Návod k použití</p>
        <h1 className="font-serif text-4xl font-semibold text-anthracite">Péče o produkty</h1>
        <p className="text-stone max-w-xl mx-auto leading-relaxed">
          Přírodní produkty se chovají jinak než syntetické. Několik jednoduchých návyků prodlouží jejich životnost a zachová všechny jejich vlastnosti.
        </p>
      </motion.div>

      <div className="space-y-6">
        {sections.map(({ icon, title, color, groups, highlight }, i) => {
          const c = colorMap[color];
          return (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className={`p-6 sm:p-8 ${c.bg} space-y-5`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-9 h-9 ${c.icon}`}>
                  {icon}
                </div>
                <h2 className="font-serif text-xl font-semibold text-anthracite">{title}</h2>
              </div>
              <div className="space-y-4">
                {groups.map((group) => (
                  <div key={group.heading} className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-anthracite">
                      {group.heading}
                    </p>
                    <ul className="space-y-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm text-stone leading-relaxed"
                        >
                          <span className={`mt-2 w-1 h-1 flex-shrink-0 ${c.dot}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {highlight && (
                  <p className="text-xs text-stone/70 italic mt-2">{highlight}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
