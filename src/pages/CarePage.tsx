import { motion } from 'framer-motion';
import { Flame, Droplets, Leaf } from 'lucide-react';

const sections = [
  {
    icon: <Flame size={20} />,
    title: 'Péče o svíčky',
    color: 'honey',
    tips: [
      'Při prvním zapálení nechte svíčku hořet alespoň 2 hodiny, dokud se neroztopí celý povrch vosku.',
      'Knot před každým zapálením zkraťte na cca 5 mm — prodloužíte tak životnost svíčky.',
      'Nikdy neskladujte svíčku na přímém slunci — vosk může změknout a ztratit tvar.',
      'Nenechávejte svíčku hořet déle než 4 hodiny v kuse.',
      'Před sfouknutím použijte víčko nebo zhášedlo — zabráníte kouři.',
    ],
  },
  {
    icon: <Leaf size={20} />,
    title: 'Péče o včelí vosk',
    color: 'stone',
    tips: [
      'Oplachujte vždy studenou vodou — horká voda vosk roztaví.',
      'Nepoužívejte na maso, ryby ani horká jídla.',
      'Po umytí nechte uschnout na vzduchu — ne v sušičce.',
      'Skladujte při pokojové teplotě, mimo radiátorů a slunce.',
      'Při běžném používání vydrží plátýnko 1 rok — poté ho zkompostujte.',
    ],
  },
  {
    icon: <Droplets size={20} />,
    title: 'Péče o balzámy',
    color: 'rose',
    tips: [
      'Nanášejte čistým prstem nebo přímo tyčinkou — předejdete kontaminaci.',
      'Skladujte na chladném místě, ne v kabelce na slunci.',
      'Spotřebujte do 12 měsíců od otevření.',
      'V létě může balzám změknout — jednoduše ho dejte na chvíli do lednice.',
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
        <p className="text-[10px] font-semibold uppercase tracking-widest text-honey">Návod k použití</p>
        <h1 className="font-serif text-4xl font-semibold text-anthracite">Péče o produkty</h1>
        <p className="text-stone max-w-xl mx-auto leading-relaxed">
          Přírodní produkty se chovají jinak než syntetické. Několik jednoduchých návyků prodlouží jejich životnost a zachová všechny jejich vlastnosti.
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
