import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";

const STEPS = [
  {
    numeral: "I",
    title: "Choose a Case",
    body: "Each case has a setting, a victim, six suspects, and a single truth. Browse by category and difficulty. The Thornwood Affair is always free.",
  },
  {
    numeral: "II",
    title: "Investigate the Scenes",
    body: "Explore physical locations. Find clues hidden in the environment. Every clue is placed deliberately — nothing is decorative, everything is evidence.",
  },
  {
    numeral: "III",
    title: "Interrogate the Suspects",
    body: "Each suspect has a psychology, a motive, and a tell. Questions unlock as you gather evidence. The more you know, the more they reveal — or conceal.",
  },
  {
    numeral: "IV",
    title: "Make Your Accusation",
    body: "When you're ready, accuse. One choice. Final and irreversible. Justice served — or a killer walks free.",
  },
];

const RANKS = [
  { rank: "Rookie",          threshold: "0 pts",    desc: "Your first steps in the dark." },
  { rank: "Investigator",    threshold: "500 pts",  desc: "You've found the thread." },
  { rank: "Detective",       threshold: "1,200 pts", desc: "You know how to pull it." },
  { rank: "Senior Detective",threshold: "2,500 pts", desc: "The evidence speaks to you." },
  { rank: "Chief Inspector", threshold: "4,500 pts", desc: "Nothing escapes your attention." },
  { rank: "Master Detective",threshold: "7,500 pts", desc: "The rarest rank. Reserved for the relentless." },
];

export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24">
        {/* Header */}
        <div className="mb-16">
          <p className="label-caps text-gold mb-3">About</p>
          <h1 className="font-serif text-5xl md:text-6xl text-parchment leading-tight mb-6">
            What is Red Thread?
          </h1>
          <p className="font-serif text-mist text-xl leading-relaxed mb-4">
            Red Thread is the first premium narrative mystery platform built for people who love a great story but have never played a game in their life.
          </p>
          <p className="font-serif text-mist text-xl leading-relaxed">
            It occupies a space no product has claimed: the intersection of prestige crime television, literary mystery craft, and interactive deduction. Every case is crafted with the discipline of a published novelist — fair, solvable, and genuinely satisfying.
          </p>
        </div>

        <div className="divider-gold mb-16" />

        {/* How it works */}
        <section className="mb-16">
          <p className="label-caps text-gold mb-3">The Method</p>
          <h2 className="font-serif text-4xl text-parchment mb-12">How It Works</h2>
          <div className="space-y-10">
            {STEPS.map((step) => (
              <div key={step.numeral} className="flex gap-6">
                <p
                  className="font-serif text-5xl leading-none shrink-0 w-10"
                  style={{ color: "rgba(201,168,76,0.3)" }}
                >
                  {step.numeral}
                </p>
                <div>
                  <h3 className="font-serif text-xl text-parchment mb-2">{step.title}</h3>
                  <p className="text-mist text-sm leading-relaxed font-sans">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider-gold mb-16" />

        {/* The Cases */}
        <section className="mb-16">
          <p className="label-caps text-gold mb-3">The Cases</p>
          <h2 className="font-serif text-4xl text-parchment mb-6">A Note on Fairness</h2>
          <p className="font-serif text-mist text-lg leading-relaxed mb-4">
            Every Red Thread case is designed to be genuinely solvable. The killer can always be deduced from the available evidence — no luck required, no unfair hidden information, no pixel-hunting.
          </p>
          <p className="font-serif text-mist text-lg leading-relaxed mb-4">
            There are red herrings. There are suspects who seem guilty and aren't. There are details that mislead. That is the mystery. But the solution is always reachable through careful observation and logical deduction.
          </p>
          <p className="font-serif italic text-mist text-lg leading-relaxed">
            When you finish a case — whether you solved it or not — you will understand exactly why the answer was what it was. That clarity is a promise.
          </p>
        </section>

        <div className="divider-gold mb-16" />

        {/* Rank system */}
        <section className="mb-16">
          <p className="label-caps text-gold mb-3">Progression</p>
          <h2 className="font-serif text-4xl text-parchment mb-8">Detective Ranks</h2>
          <div className="space-y-4">
            {RANKS.map((r, i) => (
              <div key={r.rank} className="flex items-start gap-4 p-4 bg-surface border border-[#2a2a45] rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#2a2a45] flex items-center justify-center text-xs font-serif text-mist shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="font-serif text-parchment">{r.rank}</span>
                    <span className="label-caps text-shadow text-[10px]">{r.threshold}</span>
                  </div>
                  <p className="font-serif italic text-mist text-sm">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <p className="font-serif italic text-mist text-xl mb-8">
            Ready to investigate?
          </p>
          <Link
            href="/cases"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-gold text-void font-sans font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-colors duration-200"
          >
            Begin Investigation
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
