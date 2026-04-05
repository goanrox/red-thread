import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { TaglineCycler } from "@/components/landing/TaglineCycler";
import { CaseCard } from "@/components/case/CaseCard";
import { getFeaturedCases } from "@/data";

// ─── Static content ───────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    numeral: "I",
    title: "Choose Your Case",
    body: "Browse curated mysteries by setting and era. Each case is crafted — every clue fair, every suspect solvable.",
  },
  {
    numeral: "II",
    title: "Investigate the Scene",
    body: "Explore locations, examine physical evidence, and build your case file. Nothing is decorative. Everything means something.",
  },
  {
    numeral: "III",
    title: "Interrogate Suspects",
    body: "Each suspect has a psychology, a motive, and a tell. Ask the right questions. Cross-reference the contradictions.",
  },
  {
    numeral: "IV",
    title: "Make Your Accusation",
    body: "One irreversible choice. You either deliver justice or watch a killer walk free. The consequence is real.",
  },
];

const UPCOMING_CASES = [
  {
    title: "The Bellamy Gala",
    subtitle: "Champagne, poison, and a room full of perfect alibis.",
    setting: "Paris, 1928",
    category: "High Society",
  },
  {
    title: "The Coldwater File",
    subtitle: "A case from 1978. Someone remembers. Someone wishes they didn't.",
    setting: "Yorkshire Moors, 1978",
    category: "Cold Case",
  },
  {
    title: "The Ashford Merger",
    subtitle: "A CFO found dead. The deal closes in 48 hours.",
    setting: "London, Present Day",
    category: "Corporate Thriller",
  },
  {
    title: "Small Mercies",
    subtitle: "The town calls it an accident. The town is lying.",
    setting: "Rural Vermont, Present Day",
    category: "Small Town Secrets",
  },
  {
    title: "The Unseen Hand",
    subtitle: "Three cities. One thread. An operation that doesn't officially exist.",
    setting: "International, 1989",
    category: "Espionage",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const featured = getFeaturedCases()[0];

  return (
    <PageWrapper>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient glow — gold */}
        <div
          className="absolute pointer-events-none animate-float"
          style={{
            top: "35%",
            left: "15%",
            width: "640px",
            height: "640px",
            background:
              "radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 65%)",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
          }}
          aria-hidden="true"
        />
        {/* Ambient glow — crimson, offset */}
        <div
          className="absolute pointer-events-none animate-float"
          style={{
            top: "65%",
            right: "10%",
            width: "520px",
            height: "520px",
            background:
              "radial-gradient(circle, rgba(139,34,50,0.07) 0%, transparent 65%)",
            transform: "translate(50%, -50%)",
            borderRadius: "50%",
            animationDelay: "-3s",
          }}
          aria-hidden="true"
        />

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-2xl px-6 animate-fade-up">
          {/* Season label */}
          <p className="label-caps text-gold mb-8 tracking-[0.3em]">
            Season One · Case One
          </p>

          {/* Wordmark */}
          <h1
            className="font-serif text-parchment leading-none tracking-[-0.02em] mb-8"
            style={{ fontSize: "clamp(64px, 10vw, 100px)" }}
          >
            Red Thread
          </h1>

          {/* Cycling tagline */}
          <TaglineCycler />

          {/* Brand statement */}
          <p className="font-serif text-mist text-xl leading-relaxed mt-6 max-w-lg mx-auto">
            The first premium narrative mystery platform. Investigate with
            discipline. Accuse with conviction.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link
              href="/cases"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gold text-void font-sans font-semibold text-sm tracking-widest uppercase transition-colors duration-200 hover:bg-gold-light"
            >
              Begin Investigation
            </Link>
            <Link
              href="/cases/thornwood"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-gold/40 text-gold font-sans font-semibold text-sm tracking-widest uppercase transition-colors duration-200 hover:border-gold hover:bg-gold/10"
            >
              The Thornwood Affair
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 animate-pulse-gold">
          <span className="label-caps text-shadow">scroll</span>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
            <path
              d="M6 1v18M6 19l-4-4M6 19l4-4"
              stroke="#5c5a78"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* ── Featured Case ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <div className="mb-14 animate-fade-up stagger-1">
          <p className="label-caps text-gold mb-3">Now Available</p>
          <h2 className="font-serif text-5xl text-parchment leading-tight">
            The Current Investigation
          </h2>
          <p className="font-serif italic text-mist text-lg mt-3 max-w-xl">
            One complete case. Fully playable. Every clue placed with intent.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Featured case — spans 2 columns */}
          <div className="lg:col-span-2 animate-fade-up stagger-2">
            {featured && (
              <CaseCard
                id={featured.id}
                title={featured.title}
                subtitle={featured.subtitle}
                category={featured.category}
                difficulty={featured.difficulty}
                estimatedMinutes={featured.estimatedMinutes}
                setting={featured.setting}
                isNew={featured.isNew}
                suspectCount={6}
                clueCount={12}
                className="h-full"
              />
            )}
          </div>

          {/* Upcoming teasers */}
          <div className="flex flex-col gap-6">
            {UPCOMING_CASES.slice(0, 2).map((c, i) => (
              <TeaserCard key={c.title} case={c} stagger={i + 3} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div className="divider-gold mx-6 md:mx-16" />

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section
        className="py-28"
        style={{ backgroundColor: "#0c0c17" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 animate-fade-up">
            <p className="label-caps text-gold mb-3">The Method</p>
            <h2 className="font-serif text-5xl text-parchment leading-tight">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.numeral}
                className={`animate-fade-up stagger-${i + 1}`}
              >
                {/* Roman numeral */}
                <p
                  className="font-serif text-5xl leading-none mb-5"
                  style={{ color: "rgba(201,168,76,0.25)" }}
                >
                  {step.numeral}
                </p>
                <h3 className="font-serif text-xl text-parchment mb-3">
                  {step.title}
                </h3>
                <p className="text-mist text-sm leading-relaxed font-sans">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div className="divider-gold mx-6 md:mx-16" />

      {/* ── Coming in Season 2 ───────────────────────────────────────────── */}
      <section className="py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 animate-fade-up">
            <p className="label-caps text-shadow mb-3">What Comes Next</p>
            <h2 className="font-serif text-5xl text-parchment leading-tight mb-4">
              Season Two
            </h2>
            <p className="font-serif italic text-mist text-xl max-w-lg leading-relaxed">
              New cases. New categories. New truths to uncover. Each season
              curated for the detective who demands more.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {UPCOMING_CASES.map((c, i) => (
              <div
                key={c.title}
                className={cn(
                  "border border-[#2a2a45] rounded-2xl p-6",
                  "bg-surface opacity-60",
                  `animate-fade-up stagger-${Math.min(i + 1, 6)}`
                )}
              >
                <p className="label-caps text-shadow mb-3">{c.category}</p>
                <h3 className="font-serif text-xl text-parchment mb-1">
                  {c.title}
                </h3>
                <p className="font-serif italic text-mist text-sm leading-relaxed mb-4">
                  {c.subtitle}
                </p>
                <p className="label-caps text-shadow">{c.setting}</p>
                <div className="mt-4 pt-4 border-t border-[#2a2a45]">
                  <span className="label-caps text-[#2a2a45]">
                    Coming Season 2
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#2a2a45] py-14">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg text-parchment tracking-wider">
              Red Thread
            </span>
            <span
              className="h-px w-5 opacity-40"
              style={{
                background: "linear-gradient(to right, #c9a84c, transparent)",
              }}
            />
          </div>

          <nav className="flex items-center gap-8">
            <FooterLink href="/cases">Cases</FooterLink>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/profile">Detective</FooterLink>
          </nav>

          <p className="label-caps text-shadow text-[10px]">
            &copy; {new Date().getFullYear()} Red Thread
          </p>
        </div>
      </footer>
    </PageWrapper>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TeaserCard({
  case: c,
  stagger,
}: {
  case: { title: string; subtitle: string; setting: string; category: string };
  stagger: number;
}) {
  return (
    <div
      className={cn(
        "relative border border-[#2a2a45] rounded-2xl p-5 bg-surface overflow-hidden",
        `animate-fade-up stagger-${Math.min(stagger, 6)}`
      )}
    >
      {/* Subtle lock overlay */}
      <div className="absolute inset-0 bg-void/40 backdrop-blur-[1px] flex items-end p-5 rounded-2xl">
        <span className="label-caps text-shadow">Coming in Season 2</span>
      </div>

      <p className="label-caps text-shadow mb-2">{c.category}</p>
      <h3 className="font-serif text-xl text-parchment mb-1">{c.title}</h3>
      <p className="font-serif italic text-mist text-sm leading-snug mb-3">
        {c.subtitle}
      </p>
      <p className="label-caps text-shadow">{c.setting}</p>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="label-caps text-shadow hover:text-mist transition-colors duration-200"
    >
      {children}
    </Link>
  );
}

// Utility — inline to avoid import for a single use
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
