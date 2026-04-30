import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, CalendarIcon, Check, Minus, Plus, MapPin, Lock, ChevronDown, AlertTriangle,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { easeLuxury } from "@/components/shared/Motion";
import { stables, packages, horses, transportZones, currentUser, TIER_THRESHOLDS, type AdminTier } from "@/data/mock";
import { toast } from "sonner";

const STEPS = ["Stable", "Package", "Date & Party", "Horse"] as const;

type Selection = {
  stableId?: string;
  packageId?: string;
  date?: Date;
  party: number;
  horseId?: string;
  transportZoneId?: string;
};

// Mocked welfare ledger — count of rides already booked per horse for the selected day.
// In production this is a 400 from POST /api/bookings (Horse Welfare: max 2 AM, 1 PM).
const MOCK_DAILY_RIDES: Record<string, number> = { h1: 2, h6: 3 };

const tierMeets = (rankPoints: number, tier: AdminTier) => rankPoints >= TIER_THRESHOLDS[tier];

const Booking = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [sel, setSel] = useState<Selection>({
    stableId: params.get("stable") ?? undefined,
    party: 2,
  });

  const [overrideHorse, setOverrideHorse] = useState<string | null>(null);
  const [welfareHorse, setWelfareHorse] = useState<string | null>(null);

  // Auto-advance if a stable is preselected via URL
  useEffect(() => { if (params.get("stable")) setStep(1); }, []); // eslint-disable-line

  const stable = stables.find((s) => s.id === sel.stableId);
  const pkg = packages.find((p) => p.id === sel.packageId);
  const horse = horses.find((h) => h.id === sel.horseId);
  const zone = transportZones.find((z) => z.id === sel.transportZoneId);

  const stablePackages = useMemo(
    () => packages.filter((p) => p.stableId === sel.stableId),
    [sel.stableId],
  );
  const stableHorses = useMemo(
    () => horses.filter((h) => h.stableId === sel.stableId && h.isActive),
    [sel.stableId],
  );

  const requiresZone = !!pkg?.hasTransportation;

  const canNext = [
    !!sel.stableId,
    !!sel.packageId && (!requiresZone || !!sel.transportZoneId),
    !!sel.date && sel.party > 0,
    !!sel.horseId,
  ][step];

  const next = () => {
    if (step < STEPS.length - 1) { setDirection(1); setStep(step + 1); }
    else navigate("/checkout", { state: { sel } });
  };
  const back = () => { if (step > 0) { setDirection(-1); setStep(step - 1); } };

  const subtotal = pkg ? pkg.price * sel.party : 0;
  const transport = zone ? zone.price : 0;
  const concierge = (subtotal + transport) * 0.08;
  const total = subtotal + transport + concierge;

  return (
    <div className="container pt-32 pb-32 min-h-screen">
      {/* Header */}
      <div className="mb-12 md:mb-16 flex items-end justify-between gap-6">
        <div>
          <p className="text-[11px] tracking-luxury uppercase text-ink-muted mb-3">Concierge · Reservation</p>
          <h1 className="font-display text-4xl md:text-6xl leading-[1] text-balance">
            {step === 0 ? "Choose your estate." :
             step === 1 ? "Select your journey." :
             step === 2 ? "When, and how many." :
                          "Your horse for the day."}
          </h1>
        </div>
        <Link to="/" className="hidden sm:inline-flex items-center gap-2 text-[11px] tracking-luxury uppercase text-ink-muted hover:text-foreground transition-colors">
          <ArrowLeft className="size-3.5" /> Cancel
        </Link>
      </div>

      {/* Progress */}
      <ol className="mb-14 grid grid-cols-4 gap-2 md:gap-6">
        {STEPS.map((label, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <li key={label} className="relative">
              <div className="relative h-px w-full bg-hairline overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ scaleX: done ? 1 : active ? 0.5 : 0 }}
                  transition={{ duration: 0.7, ease: easeLuxury }}
                  style={{ originX: 0 }}
                  className="absolute inset-0 bg-foreground"
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={cn("text-[10px] tracking-luxury uppercase transition-colors", active || done ? "text-foreground" : "text-ink-muted")}>
                  0{i + 1} · {label}
                </span>
                {done && <Check className="size-3 text-foreground" />}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        {/* STEP CONTENT */}
        <div className="lg:col-span-8 min-h-[460px] relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.5, ease: easeLuxury }}
            >
              {step === 0 && (
                <div className="grid gap-4 md:grid-cols-3">
                  {stables.map((s) => {
                    const active = sel.stableId === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSel({ ...sel, stableId: s.id, packageId: undefined, horseId: undefined })}
                        className={cn(
                          "group text-left transition-all duration-500 relative overflow-hidden",
                          active ? "ring-1 ring-foreground" : "ring-1 ring-transparent hover:ring-hairline",
                        )}
                      >
                        <div className="aspect-[4/5] overflow-hidden bg-surface">
                          <motion.img src={s.image} alt={s.name} className="h-full w-full object-cover" whileHover={{ scale: 1.04 }} transition={{ duration: 1.2, ease: easeLuxury }} />
                        </div>
                        <div className="p-5 bg-surface-elevated/60">
                          <p className="text-[10px] tracking-luxury uppercase text-ink-muted">Est. {s.established}</p>
                          <h3 className="font-display text-2xl mt-1 leading-tight">{s.name}</h3>
                          <p className="mt-1 text-xs tracking-[0.14em] uppercase text-ink-muted inline-flex items-center gap-1.5">
                            <MapPin className="size-3" /> {s.location}
                          </p>
                        </div>
                        {active && (
                          <motion.span layoutId="select-mark" className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-full bg-foreground text-background">
                            <Check className="size-3.5" />
                          </motion.span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-0">
                  {stablePackages.length === 0 && (
                    <p className="text-ink-muted">No packages for this estate.</p>
                  )}
                  {stablePackages.map((p, i) => {
                    const active = sel.packageId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSel({ ...sel, packageId: p.id })}
                        className={cn(
                          "w-full grid md:grid-cols-12 gap-6 items-center py-6 border-t hairline last:border-b text-left transition-colors duration-500 relative",
                          active ? "bg-surface" : "hover:bg-surface/50",
                        )}
                      >
                        <div className="md:col-span-1 px-4 text-[11px] tracking-luxury uppercase text-ink-muted">№ {String(i + 1).padStart(2, "0")}</div>
                        <div className="md:col-span-6 px-4">
                          <h3 className="font-display text-2xl md:text-3xl leading-tight">{p.name}</h3>
                          <p className="mt-1.5 text-ink-muted text-sm">{p.tagline}</p>
                          <p className="mt-2 text-xs text-ink-muted">{p.duration} · {p.minPeople}–{p.maxPeople} guests</p>
                        </div>
                        <div className="md:col-span-3 px-4 text-sm">
                          <p className="text-ink-muted text-[11px] tracking-luxury uppercase">From</p>
                          <p className="font-display text-2xl">${p.price}<span className="text-sm text-ink-muted"> / guest</span></p>
                        </div>
                        <div className="md:col-span-2 px-4 flex md:justify-end">
                          <span className={cn(
                            "inline-flex size-9 items-center justify-center rounded-full border transition-all duration-500",
                            active ? "bg-foreground text-background border-foreground" : "border-hairline text-ink-muted",
                          )}>
                            {active ? <Check className="size-4" /> : <Plus className="size-4" />}
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {pkg?.hasTransportation && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: easeLuxury }}
                      className="mt-10 border-t hairline pt-8"
                    >
                      <p className="text-[10px] tracking-luxury uppercase text-ink-muted mb-4">Transportation · pick-up zone</p>
                      <div className="grid md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-8 relative">
                          <select
                            value={sel.transportZoneId ?? ""}
                            onChange={(e) => setSel({ ...sel, transportZoneId: e.target.value || undefined })}
                            className="w-full appearance-none bg-transparent border-b hairline pb-3 pt-1 pr-8 font-display text-2xl md:text-3xl text-foreground focus:outline-none focus:border-foreground transition-colors cursor-pointer"
                          >
                            <option value="" disabled>Select your pick-up</option>
                            {transportZones.map((z) => (
                              <option key={z.id} value={z.id}>{z.name}{z.price > 0 ? `  ·  +$${z.price}` : "  ·  included"}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-0 bottom-3.5 size-4 text-ink-muted pointer-events-none" />
                        </div>
                        <div className="md:col-span-4 text-right">
                          <p className="text-[10px] tracking-luxury uppercase text-ink-muted">Add-on</p>
                          <p className="font-display text-2xl">{zone ? (zone.price ? `+$${zone.price}` : "Included") : "—"}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-ink-muted">A private chauffeur will collect your party 60 minutes before departure.</p>
                    </motion.div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <p className="text-[10px] tracking-luxury uppercase text-ink-muted mb-3">Date</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className={cn(
                          "w-full flex items-center justify-between gap-3 border-b hairline pb-4 text-left transition-colors hover:border-foreground",
                          sel.date ? "text-foreground" : "text-ink-muted",
                        )}>
                          <span className="font-display text-2xl md:text-3xl">
                            {sel.date ? format(sel.date, "EEEE, d MMMM yyyy") : "Choose your morning"}
                          </span>
                          <CalendarIcon className="size-5 shrink-0" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-surface-elevated border hairline" align="start">
                        <Calendar
                          mode="single"
                          selected={sel.date}
                          onSelect={(d) => setSel({ ...sel, date: d })}
                          disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="mt-4 text-sm text-ink-muted">Sunrise rides depart 90 minutes before first light. Your concierge will confirm the exact hour.</p>
                  </div>

                  <div>
                    <p className="text-[10px] tracking-luxury uppercase text-ink-muted mb-3">Party</p>
                    <div className="flex items-center justify-between gap-6 border-b hairline pb-4">
                      <button
                        onClick={() => setSel({ ...sel, party: Math.max(1, sel.party - 1) })}
                        className="size-12 inline-flex items-center justify-center border hairline hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                        aria-label="Decrease party"
                      >
                        <Minus className="size-4" />
                      </button>
                      <div className="text-center">
                        <p className="font-display text-5xl leading-none">{sel.party}</p>
                        <p className="mt-2 text-xs tracking-luxury uppercase text-ink-muted">guest{sel.party === 1 ? "" : "s"}</p>
                      </div>
                      <button
                        onClick={() => setSel({ ...sel, party: Math.min(pkg?.maxPeople ?? 12, sel.party + 1) })}
                        className="size-12 inline-flex items-center justify-center border hairline hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                        aria-label="Increase party"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                    {pkg && (
                      <p className="mt-4 text-sm text-ink-muted">
                        This journey accommodates {pkg.minPeople}–{pkg.maxPeople} guests.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {stableHorses.map((h) => {
                    const active = sel.horseId === h.id;
                    return (
                      <button
                        key={h.id}
                        onClick={() => setSel({ ...sel, horseId: h.id })}
                        className={cn(
                          "group text-left relative overflow-hidden transition-all duration-500",
                          active ? "ring-1 ring-foreground" : "ring-1 ring-transparent hover:ring-hairline",
                        )}
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-surface">
                          <motion.img src={h.image} alt={h.name} className="h-full w-full object-cover" whileHover={{ scale: 1.05 }} transition={{ duration: 1.2, ease: easeLuxury }} />
                        </div>
                        <div className="p-4 bg-surface-elevated/60">
                          <h3 className="font-display text-xl leading-tight">{h.name}</h3>
                          <p className="mt-1 text-[11px] tracking-[0.14em] uppercase text-ink-muted">{h.breed} · {h.age} yrs</p>
                          <p className="mt-1.5 text-xs text-ink-soft">{h.temperament}</p>
                        </div>
                        {active && (
                          <motion.span layoutId="select-mark" className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-full bg-foreground text-background">
                            <Check className="size-3.5" />
                          </motion.span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="mt-14 flex items-center justify-between border-t hairline pt-6">
            <button
              onClick={back}
              disabled={step === 0}
              className="inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-ink-muted hover:text-foreground disabled:opacity-30 disabled:hover:text-ink-muted transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Back
            </button>
            <button
              onClick={next}
              disabled={!canNext}
              className={cn(
                "group inline-flex items-center gap-3 px-6 py-3.5 text-[12px] tracking-[0.18em] uppercase transition-all",
                canNext ? "bg-foreground text-background" : "bg-foreground/20 text-foreground/40 cursor-not-allowed",
              )}
            >
              {step === STEPS.length - 1 ? "Review & checkout" : "Continue"}
              {step === STEPS.length - 1
                ? <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                : <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5" />}
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 border hairline bg-surface-elevated/60 p-7">
            <p className="text-[10px] tracking-luxury uppercase text-ink-muted mb-5">Your reservation</p>

            <Row label="Estate" value={stable?.name ?? "—"} />
            <Row label="Journey" value={pkg?.name ?? "—"} />
            <Row label="Date" value={sel.date ? format(sel.date, "d MMM yyyy") : "—"} />
            <Row label="Party" value={`${sel.party} guest${sel.party === 1 ? "" : "s"}`} />
            <Row label="Horse" value={horse?.name ?? "—"} last />

            <div className="mt-6 pt-5 border-t hairline space-y-2 text-sm">
              <Line label="Subtotal" value={subtotal ? `$${subtotal.toFixed(0)}` : "—"} />
              <Line label="Concierge (8%)" value={subtotal ? `$${concierge.toFixed(0)}` : "—"} />
            </div>
            <div className="mt-4 pt-4 border-t hairline flex items-baseline justify-between">
              <span className="text-[11px] tracking-luxury uppercase text-ink-muted">Total</span>
              <span className="font-display text-3xl">{subtotal ? `$${total.toFixed(0)}` : "—"}</span>
            </div>

            <p className="mt-6 text-xs text-ink-muted text-pretty">
              No charge until your concierge confirms availability. Cancellation, gracious; up to 48 hours before arrival.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const Row = ({ label, value, last }: { label: string; value: string; last?: boolean }) => (
  <div className={cn("flex items-baseline justify-between gap-4 py-2.5", !last && "border-b hairline")}>
    <span className="text-[10px] tracking-luxury uppercase text-ink-muted shrink-0">{label}</span>
    <span className="text-sm text-foreground text-right truncate">{value}</span>
  </div>
);

const Line = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-ink-muted">{label}</span>
    <span className="text-foreground tabular-nums">{value}</span>
  </div>
);

export default Booking;
