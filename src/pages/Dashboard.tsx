import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, MapPin, Clock } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem, easeLuxury } from "@/components/shared/Motion";
import { packages, stables, horses } from "@/data/mock";
import { cn } from "@/lib/utils";

type Journey = {
  id: string;
  packageId: string;
  date: Date;
  party: number;
  horseId: string;
  status: "confirmed" | "completed" | "pending";
  reference: string;
};

const JOURNEYS: Journey[] = [
  { id: "j1", packageId: "p1", date: new Date(Date.now() + 86400000 * 9), party: 2, horseId: "h2", status: "confirmed", reference: "PYR-04821" },
  { id: "j2", packageId: "p2", date: new Date(Date.now() + 86400000 * 32), party: 4, horseId: "h5", status: "pending",   reference: "PYR-04822" },
  { id: "j3", packageId: "p4", date: new Date(Date.now() - 86400000 * 21), party: 2, horseId: "h1", status: "completed", reference: "PYR-04601" },
  { id: "j4", packageId: "p3", date: new Date(Date.now() - 86400000 * 96), party: 1, horseId: "h8", status: "completed", reference: "PYR-04488" },
];

const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const Dashboard = () => {
  const upcoming = JOURNEYS.filter((j) => j.status !== "completed").sort((a, b) => +a.date - +b.date);
  const past = JOURNEYS.filter((j) => j.status === "completed").sort((a, b) => +b.date - +a.date);

  return (
    <div className="container pt-32 pb-32 min-h-screen">
      {/* Header */}
      <Reveal>
        <p className="text-[11px] tracking-luxury uppercase text-ink-muted mb-4">Your private ledger</p>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <h1 className="font-display text-5xl md:text-7xl leading-[1] text-balance">Good morning, Yasmine.</h1>
          <Link to="/booking" className="inline-flex items-center gap-3 px-6 py-3.5 bg-foreground text-background text-[12px] tracking-[0.18em] uppercase group">
            Reserve another <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>

      {/* Stats */}
      <StaggerGroup className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-hairline border hairline" gap={0.06}>
        {[
          { label: "Upcoming", value: upcoming.length },
          { label: "Completed", value: past.length },
          { label: "Estates visited", value: 3 },
          { label: "Member since", value: "2024" },
        ].map((s) => (
          <StaggerItem key={s.label}>
            <div className="bg-background p-8">
              <p className="text-[10px] tracking-luxury uppercase text-ink-muted">{s.label}</p>
              <p className="mt-3 font-display text-5xl">{s.value}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Upcoming */}
      <section className="mt-24">
        <div className="flex items-end justify-between mb-10 border-b hairline pb-5">
          <h2 className="font-display text-3xl md:text-5xl">Upcoming</h2>
          <p className="text-[11px] tracking-luxury uppercase text-ink-muted">{upcoming.length} reservation{upcoming.length === 1 ? "" : "s"}</p>
        </div>

        {upcoming.length === 0 ? (
          <p className="text-ink-muted">Nothing on the calendar. <Link to="/packages" className="text-foreground underline-offset-4 hover:underline">Browse journeys</Link>.</p>
        ) : (
          <StaggerGroup className="grid gap-6 md:grid-cols-2" gap={0.1}>
            {upcoming.map((j) => <JourneyCard key={j.id} j={j} featured />)}
          </StaggerGroup>
        )}
      </section>

      {/* Past */}
      <section className="mt-24">
        <div className="flex items-end justify-between mb-10 border-b hairline pb-5">
          <h2 className="font-display text-3xl md:text-5xl">In the archive</h2>
          <p className="text-[11px] tracking-luxury uppercase text-ink-muted">{past.length} journey{past.length === 1 ? "" : "s"}</p>
        </div>
        <StaggerGroup className="space-y-0" gap={0.06}>
          {past.map((j, i) => {
            const pkg = packages.find((p) => p.id === j.packageId)!;
            const stable = stables.find((s) => s.id === pkg.stableId)!;
            return (
              <StaggerItem key={j.id}>
                <div className="grid md:grid-cols-12 gap-6 items-center py-6 border-t hairline last:border-b">
                  <div className="md:col-span-1 text-[11px] tracking-luxury uppercase text-ink-muted">№ {String(i + 1).padStart(2, "0")}</div>
                  <div className="md:col-span-5">
                    <h3 className="font-display text-2xl leading-tight">{pkg.name}</h3>
                    <p className="text-xs text-ink-muted mt-1">{stable.name}</p>
                  </div>
                  <div className="md:col-span-3 text-sm text-ink-soft">{fmt(j.date)}</div>
                  <div className="md:col-span-2 text-xs tracking-luxury uppercase text-ink-muted">{j.reference}</div>
                  <div className="md:col-span-1 flex md:justify-end">
                    <Link to={`/packages/${pkg.id}`} className="inline-flex size-9 items-center justify-center border hairline rounded-full hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-500">
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>
    </div>
  );
};

const JourneyCard = ({ j, featured }: { j: Journey; featured?: boolean }) => {
  const pkg = packages.find((p) => p.id === j.packageId)!;
  const stable = stables.find((s) => s.id === pkg.stableId)!;
  const horse = horses.find((h) => h.id === j.horseId)!;
  return (
    <article className="border hairline bg-surface-elevated/40 group overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <motion.img src={pkg.image} alt={pkg.name} className="h-full w-full object-cover" whileHover={{ scale: 1.04 }} transition={{ duration: 1.2, ease: easeLuxury }} />
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 bg-background/85 backdrop-blur text-[10px] tracking-luxury uppercase">
          <span className={cn("size-1.5 rounded-full", j.status === "confirmed" ? "bg-foreground" : "bg-ink-muted")} />
          {j.status}
        </div>
        <div className="absolute top-4 right-4 text-[10px] tracking-luxury uppercase text-background/90">{j.reference}</div>
      </div>
      <div className="p-7">
        <p className="text-[10px] tracking-luxury uppercase text-ink-muted">{stable.name}</p>
        <h3 className="font-display text-3xl mt-1 leading-tight">{pkg.name}</h3>

        <dl className="mt-6 grid grid-cols-3 gap-4 text-sm border-t hairline pt-5">
          <Meta icon={CalendarDays} label="Date" value={fmt(j.date)} />
          <Meta icon={MapPin} label="Horse" value={horse.name} />
          <Meta icon={Clock} label="Party" value={`${j.party}`} />
        </dl>

        {featured && (
          <div className="mt-7 flex items-center gap-3">
            <Link to={`/packages/${pkg.id}`} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-foreground text-background text-[11px] tracking-[0.18em] uppercase">
              View itinerary
            </Link>
            <button className="px-5 py-3 border hairline text-[11px] tracking-[0.18em] uppercase hover:bg-foreground hover:text-background hover:border-foreground transition-colors">Modify</button>
          </div>
        )}
      </div>
    </article>
  );
};

const Meta = ({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) => (
  <div>
    <p className="text-[10px] tracking-luxury uppercase text-ink-muted inline-flex items-center gap-1.5"><Icon className="size-3" /> {label}</p>
    <p className="mt-1.5 text-foreground truncate">{value}</p>
  </div>
);

export default Dashboard;
