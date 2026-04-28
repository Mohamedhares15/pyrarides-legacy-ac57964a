import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Check, CreditCard, Lock } from "lucide-react";
import { Reveal, easeLuxury } from "@/components/shared/Motion";
import { stables, packages, horses } from "@/data/mock";
import { cn } from "@/lib/utils";

type Sel = { stableId?: string; packageId?: string; date?: Date; party: number; horseId?: string };

const Checkout = () => {
  const { state } = useLocation() as { state?: { sel?: Sel } };
  const sel = state?.sel;
  const [confirmed, setConfirmed] = useState(false);

  if (!sel || !sel.stableId || !sel.packageId || !sel.horseId || !sel.date) {
    return <Navigate to="/booking" replace />;
  }

  const stable = stables.find((s) => s.id === sel.stableId)!;
  const pkg = packages.find((p) => p.id === sel.packageId)!;
  const horse = horses.find((h) => h.id === sel.horseId)!;
  const subtotal = pkg.price * sel.party;
  const concierge = subtotal * 0.08;
  const total = subtotal + concierge;

  return (
    <div className="container pt-32 pb-32 min-h-screen">
      <Link to="/booking" className="inline-flex items-center gap-2 text-[11px] tracking-luxury uppercase text-ink-muted hover:text-foreground transition-colors mb-10">
        <ArrowLeft className="size-3.5" /> Back to reservation
      </Link>

      {confirmed ? (
        <Confirmed stableName={stable.name} date={sel.date!} />
      ) : (
        <>
          <Reveal>
            <p className="text-[11px] tracking-luxury uppercase text-ink-muted mb-3">Concierge · Final review</p>
            <h1 className="font-display text-4xl md:text-6xl leading-[1] text-balance max-w-3xl">A frictionless farewell.</h1>
          </Reveal>

          <div className="mt-16 grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* DETAILS */}
            <div className="lg:col-span-7 space-y-12">
              <Reveal>
                <Section eyebrow="Your journey">
                  <div className="grid sm:grid-cols-12 gap-6 items-start">
                    <div className="sm:col-span-4 aspect-[4/5] overflow-hidden bg-surface">
                      <img src={pkg.image} alt={pkg.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div className="sm:col-span-8">
                      <p className="text-[10px] tracking-luxury uppercase text-ink-muted">{stable.name}</p>
                      <h3 className="font-display text-3xl mt-1 leading-tight">{pkg.name}</h3>
                      <p className="mt-2 text-ink-muted">{pkg.tagline}</p>

                      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                        <Meta label="Date" value={format(sel.date!, "d MMM yyyy")} />
                        <Meta label="Party" value={`${sel.party} guest${sel.party === 1 ? "" : "s"}`} />
                        <Meta label="Duration" value={pkg.duration} />
                        <Meta label="Horse" value={horse.name} />
                      </dl>
                    </div>
                  </div>
                </Section>
              </Reveal>

              <Reveal delay={0.1}>
                <Section eyebrow="Guest details">
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                    <Field label="Full name" placeholder="As on passport" />
                    <Field label="Email" type="email" placeholder="concierge@example.com" />
                    <Field label="Phone" type="tel" placeholder="+20 ·" />
                    <Field label="Riding experience" placeholder="Novice · Intermediate · Advanced" />
                    <div className="sm:col-span-2">
                      <Field label="Special requests" placeholder="Allergies, dietary notes, photographer, anything" textarea />
                    </div>
                  </div>
                </Section>
              </Reveal>

              <Reveal delay={0.15}>
                <Section eyebrow="Payment">
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="sm:col-span-2">
                      <Field label="Card number" placeholder="•••• •••• •••• ••••" icon={<CreditCard className="size-4 text-ink-muted" />} />
                    </div>
                    <Field label="Expiry" placeholder="MM / YY" />
                    <Field label="CVC" placeholder="•••" />
                  </div>
                  <p className="mt-6 inline-flex items-center gap-2 text-xs text-ink-muted">
                    <Lock className="size-3" /> No charge until your concierge confirms within 24 hours.
                  </p>
                </Section>
              </Reveal>
            </div>

            {/* SUMMARY */}
            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-28 border hairline bg-surface-elevated/60 p-8">
                <p className="text-[10px] tracking-luxury uppercase text-ink-muted mb-6">Reservation summary</p>

                <div className="space-y-3 text-sm">
                  <Line label={`${pkg.name} × ${sel.party}`} value={`$${subtotal.toFixed(0)}`} />
                  <Line label="Concierge service (8%)" value={`$${concierge.toFixed(0)}`} />
                </div>

                <div className="mt-6 pt-5 border-t hairline flex items-baseline justify-between">
                  <span className="text-[11px] tracking-luxury uppercase text-ink-muted">Total due</span>
                  <span className="font-display text-4xl">${total.toFixed(0)}</span>
                </div>

                <button
                  onClick={() => setConfirmed(true)}
                  className="mt-8 w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-foreground text-background text-[12px] tracking-[0.2em] uppercase group overflow-hidden relative"
                >
                  <span className="relative z-10">Confirm reservation</span>
                </button>

                <p className="mt-6 text-xs text-ink-muted text-pretty">
                  By confirming, you agree to the gracious cancellation policy: full refund up to 48 hours before arrival.
                </p>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
};

const Section = ({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) => (
  <section className="border-t hairline pt-8">
    <p className="text-[10px] tracking-luxury uppercase text-ink-muted mb-6">{eyebrow}</p>
    {children}
  </section>
);

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] tracking-luxury uppercase text-ink-muted">{label}</p>
    <p className="mt-1 text-foreground">{value}</p>
  </div>
);

const Field = ({ label, placeholder, type = "text", textarea, icon }: { label: string; placeholder?: string; type?: string; textarea?: boolean; icon?: React.ReactNode }) => (
  <label className="block">
    <span className="text-[10px] tracking-luxury uppercase text-ink-muted">{label}</span>
    <div className="relative mt-2">
      {textarea ? (
        <textarea rows={3} placeholder={placeholder} className={cn(
          "w-full bg-transparent border-b hairline pb-3 pt-1 text-foreground placeholder:text-ink-muted/60 focus:outline-none focus:border-foreground transition-colors resize-none",
        )} />
      ) : (
        <input type={type} placeholder={placeholder} className={cn(
          "w-full bg-transparent border-b hairline pb-3 pt-1 text-foreground placeholder:text-ink-muted/60 focus:outline-none focus:border-foreground transition-colors",
          icon && "pr-8",
        )} />
      )}
      {icon && <span className="absolute right-0 bottom-3.5">{icon}</span>}
    </div>
  </label>
);

const Line = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-4">
    <span className="text-ink-soft">{label}</span>
    <span className="text-foreground tabular-nums">{value}</span>
  </div>
);

const Confirmed = ({ stableName, date }: { stableName: string; date: Date }) => {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center pt-10">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: easeLuxury }}
        className="size-20 rounded-full bg-foreground text-background inline-flex items-center justify-center mb-10"
      >
        <Check className="size-8" />
      </motion.div>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: easeLuxury }}
        className="text-[11px] tracking-luxury uppercase text-ink-muted mb-4">Reservation received</motion.p>
      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.9, ease: easeLuxury }}
        className="font-display text-4xl md:text-6xl leading-[1.05] text-balance max-w-2xl">
        We'll see you at {stableName.split(" ")[0]}, on {format(date, "d MMMM")}.
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-6 max-w-md text-ink-soft text-pretty">
        Your concierge will write within 24 hours to confirm the precise hour, the linen, and the route.
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}
        className="mt-12 flex gap-4">
        <Link to="/dashboard" className="inline-flex px-6 py-3.5 bg-foreground text-background text-[12px] tracking-[0.2em] uppercase">View your journeys</Link>
        <Link to="/" className="inline-flex px-6 py-3.5 border hairline text-[12px] tracking-[0.2em] uppercase hover:bg-foreground hover:text-background hover:border-foreground transition-colors">Return home</Link>
      </motion.div>
    </div>
  );
};

export default Checkout;
