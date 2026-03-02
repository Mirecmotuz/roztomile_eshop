import { motion } from 'framer-motion';
import { Flame, Droplets, Leaf } from 'lucide-react';

const sections = [
  {
    icon: <Flame size={20} />,
    title: 'Starostlivosť o sviečky',
    color: 'honey',
    tips: [
      'Prvé zapálenie nechajte horieť aspoň 2 hodiny, kým sa celý povrch vosku roztopí.',
      'Knôt pred každým zapálením skráťte na cca 5 mm — predĺžite tým životnosť sviečky.',
      'Nikdy neskladujte sviečku na priamom slnku — vosk môže zmäknúť a stratiť tvar.',
      'Nenechávajte sviečku horieť dlhšie ako 4 hodiny naraz.',
      'Pred sfúknutím použite viečko alebo záhasník — zabránite dymeniu.',
    ],
  },
  {
    icon: <Leaf size={20} />,
    title: 'Starostlivosť o včelí vosk',
    color: 'stone',
    tips: [
      'Oplachujte vždy studenou vodou — horúca voda vosk roztopí.',
      'Nepoužívajte na mäso, ryby ani horúce jedlá.',
      'Po umytí nechajte vyschnúť vo vzduchu — nie v sušičke.',
      'Skladujte pri izbovej teplote, mimo radiátorov a slnka.',
      'Pri bežnom používaní vydrží plátienka 1 rok — potom ho skompostujte.',
    ],
  },
  {
    icon: <Droplets size={20} />,
    title: 'Starostlivosť o balzamy',
    color: 'rose',
    tips: [
      'Nanášajte čistým prstom alebo priamo tyčinkou — predíde kontaminácii.',
      'Skladujte na chladnom mieste, nie v kabelke na slnku.',
      'Spotrebujte do 12 mesiacov od otvorenia.',
      'V lete môže balzam zmäknúť — jednoducho ho dajte na chvíľu do chladničky.',
    ],
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
        <p className="text-[10px] font-semibold uppercase tracking-widest text-honey">Návod na použitie</p>
        <h1 className="font-serif text-4xl font-semibold text-anthracite">Starostlivosť o produkty</h1>
        <p className="text-stone max-w-xl mx-auto leading-relaxed">
          Prírodné produkty sa správajú inak ako syntetické. Zopár jednoduchých návykov predĺži ich životnosť a zachová všetky ich vlastnosti.
        </p>
      </motion.div>

      <div className="space-y-6">
        {sections.map(({ icon, title, color, tips }, i) => {
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
              <ul className="space-y-3">
                {tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-3 text-sm text-stone leading-relaxed">
                    <span className={`mt-2 w-1 h-1 flex-shrink-0 ${c.dot}`} />
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
