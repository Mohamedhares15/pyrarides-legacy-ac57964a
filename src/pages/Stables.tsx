import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem, easeLuxury } from "@/components/shared/Motion";
import { stables } from "@/data/mock";

const Stables = () => {
  return (
    <>
      <section className="container pt-40 pb-20">
        <Reveal>
          <p className="text-[11px] tracking-luxury uppercase text-ink-muted mb-6">The Stables · {stables.length} estates</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-5xl">Three estates. One plateau. A century of horses.</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-10 max-w-xl text-ink-soft text-pretty">Each of our partner stables has been chosen for one quiet reason: their horses, their history, and the way they keep both. Select an estate to enter.</p>
        </Reveal>
      </section>

      <section className="container pb-32">
        <StaggerGroup className="grid gap-6 md:grid-cols-3" gap={0.12}>
          {stables.map((s) => (
            <StaggerItem key={s.id}>
              <Link to={`/stables/${s.id}`} className="group block">
                <motion.div layoutId={`stable-image-${s.id}`} className="relative aspect-[4/5] overflow-hidden bg-surface">
                  <motion.img
                    src={s.image} alt={s.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 1.2, ease: easeLuxury }}
                  />
                  <div className="absolute top-4 left-4 text-[10px] tracking-luxury uppercase text-background/90">Est. {s.established}</div>
                </motion.div>
                <div className="pt-5 flex items-start justify-between gap-4">
                  <div>
                    <motion.h3 layoutId={`stable-name-${s.id}`} className="font-display text-2xl leading-tight">{s.name}</motion.h3>
                    <p className="mt-1.5 text-xs tracking-[0.14em] uppercase text-ink-muted inline-flex items-center gap-1.5">
                      <MapPin className="size-3" /> {s.location}
                    </p>
                  </div>
                  <ArrowUpRight className="size-4 text-ink-muted transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="mt-3 text-sm text-ink-soft text-pretty">{s.description}</p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </>
  );
};

export default Stables;
