import { motion } from 'framer-motion';
import { Leaf, Heart, Package } from 'lucide-react';

const values = [
  {
    icon: <Leaf size={22} />,
    title: 'Přírodní suroviny',
    text: 'Používáme výhradně přírodní ingredience — sójový vosk, včelí vosk, éterické oleje a organické bylinky. Žádná chemie, žádné zkratky.',
  },
  {
    icon: <Heart size={22} />,
    title: 'Ručná výroba',
    text: 'Každý kousek vzniká v malém domácím ateliéru. Lité svíčky, šitá plátýnka, míchané balzámy — s rukama a srdcem.',
  },
  {
    icon: <Package size={22} />,
    title: 'Udržitelné balení',
    text: 'Balíme do recyklovatelných materiálů. Bez plastových obalů, bez zbytečného odpadu — jen to, co je skutečně potřeba.',
  },
];

export default function OurStoryPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 space-y-20">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="text-center space-y-6"
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-honey">Náš příběh</p>
        <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-anthracite leading-tight">
          Vzniklo to z lásky<br />k přírodním věcem
        </h1>
        <p className="text-stone text-lg leading-relaxed max-w-2xl mx-auto">
          Roztomile začalo jako malý projekt v kuchyni — s hrncem vosku, pár knoty a velkou chutí dělat věci jinak. Dnes každý kousek stále vzniká stejně: ručně, s pozorností a bez zbytečné chemie.
        </p>
      </motion.section>

      {/* Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="overflow-hidden aspect-video bg-stone/10"
      >
        <img
          src="https://images.unsplash.com/photo-1608571423539-e951cb2b69b5?w=1200&q=80"
          alt="Ateliér Roztomile"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Values */}
      <section className="space-y-8">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-honey mb-3">Co nás definuje</p>
          <h2 className="font-serif text-4xl text-anthracite">Naše hodnoty</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {values.map(({ icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col gap-4 p-6 bg-cream border border-anthracite/8"
            >
              <div className="flex items-center justify-center w-11 h-11 bg-honey-light text-honey">
                {icon}
              </div>
              <h3 className="font-serif text-lg font-semibold text-anthracite">{title}</h3>
              <p className="text-sm text-stone leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <motion.blockquote
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border-l-2 border-honey pl-6 py-2 max-w-2xl mx-auto"
      >
        <p className="font-serif text-2xl font-medium text-anthracite leading-relaxed italic">
          "Chci, aby každý kousek z Roztomile byl malou radostí v každodenním životě."
        </p>
        <footer className="mt-3 text-xs uppercase tracking-widest text-stone">— Zakladatelka Roztomile</footer>
      </motion.blockquote>
    </main>
  );
}
