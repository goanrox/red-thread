import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { TaglineCycler } from "@/components/landing/TaglineCycler";
import { CaseCard } from "@/components/case/CaseCard";
import { getFeaturedCases } from "@/data";
import {
  MapPin,
  Clock,
  Search,
  User,
  Activity,
  ChevronRight,
} from "lucide-react";

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
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        {/* Vertical accent lines */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-px h-20"
          style={{ background: "linear-gradient(to bottom, rgba(212,175,55,0.2), transparent)" }}
          aria-hidden="true"
        />

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-3xl animate-fade-up">
          {/* Season label */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-brass/30" />
            <span className="label-brass tracking-[0.8em]">Season One · Case One</span>
            <div className="h-px w-12 bg-brass/30" />
          </div>

          {/* Wordmark */}
          <h1
            className="font-serif italic text-gold-rich leading-none tracking-tight mb-6"
            style={{ fontSize: "clamp(72px, 12vw, 120px)" }}
          >
            Red Thread
          </h1>

          {/* Cycling tagline */}
          <div className="h-14 flex items-center justify-center mb-6">
            <TaglineCycler />
          </div>

          {/* Brand statement */}
          <p className="text-sm text-ivory/40 leading-relaxed font-light tracking-wide max-w-md mx-auto mb-12">
            The first premium narrative mystery platform. Investigate with
            discipline. Accuse with conviction.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/cases" className="btn-gold">
              Begin Investigation
            </Link>
            <Link href="/cases/thornwood" className="btn-outline-gold">
              The Thornwood Affair
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-pulse-gold">
          <span className="label-brass text-[8px] tracking-[0.6em]">Scroll</span>
          <div
            className="w-px h-16"
            style={{ background: "linear-gradient(to bottom, rgba(212,175,55,0.35), transparent)" }}
          />
        </div>
      </section>

      {/* ── Featured Case ────────────────────────────────────────────────── */}
      <section className="relative z-10 px-8 md:px-24 py-32">
        <div className="max-w-7xl mx-auto">
          <CinematicSectionHeader index="01" title="Current Investigation" />

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
            <div className="flex flex-col gap-5">
              {UPCOMING_CASES.slice(0, 2).map((c, i) => (
                <TeaserCard key={c.title} case={c} stagger={i + 3} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="relative z-10 px-8 md:px-24 py-32" style={{ backgroundColor: "rgba(12,12,23,0.6)" }}>
        <div
          className="pointer-events-none absolute inset-0 border-t border-b border-brass/[0.06]"
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto">
          <CinematicSectionHeader index="02" title="The Method" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.numeral}
                className={`framed-module p-7 animate-fade-up stagger-${i + 1}`}
              >
                <p
                  className="font-serif text-6xl leading-none mb-5"
                  style={{ color: "rgba(212,175,55,0.3)" }}
                >
                  {step.numeral}
                </p>
                <div className="h-px w-10 bg-brass/20 mb-5" />
                <h3 className="font-serif text-xl text-ivory mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="text-ivory/50 text-sm leading-relaxed font-light">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider-gold mx-8 md:mx-24" />

      {/* ── Season Two ───────────────────────────────────────────────────── */}
      <section className="relative z-10 px-8 md:px-24 py-32">
        <div className="max-w-7xl mx-auto">
          <CinematicSectionHeader index="03" title="Season Two" />

          <p className="font-serif italic text-ivory/50 text-xl max-w-lg leading-relaxed mb-16 -mt-6">
            New cases. New categories. New truths to uncover.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {UPCOMING_CASES.map((c, i) => (
              <div
                key={c.title}
                className={`framed-module relative p-6 animate-fade-up stagger-${Math.min(i + 1, 6)}`}
                style={{ opacity: 0.75 }}
              >
                <div className="absolute top-4 right-4">
                  <span className="label-brass border border-brass/15 bg-void/80 px-2 py-1 rounded-full text-[8px]">
                    Season 2
                  </span>
                </div>

                <span className="label-brass block mb-3 pr-16">{c.category}</span>
                <h3 className="font-serif text-xl text-ivory mb-1">{c.title}</h3>
                <p className="font-serif italic text-ivory/50 text-sm leading-relaxed mb-4">
                  {c.subtitle}
                </p>
                <p className="metadata-text">{c.setting}</p>
                <div className="mt-4 pt-4 border-t border-brass/[0.08]">
                  <span className="metadata-text" style={{ color: "rgba(92,90,120,0.5)" }}>
                    In Production
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-brass/[0.08] py-14">
        <div className="max-w-7xl mx-auto px-8 md:px-24 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-brass/30" />
            <span className="font-serif italic text-xl text-ivory/80 tracking-wider">
              Red Thread
            </span>
          </div>

          <nav className="flex items-center gap-8">
            <FooterLink href="/cases">Cases</FooterLink>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/profile">Detective</FooterLink>
          </nav>

          <p className="label-brass text-[9px]">
            &copy; {new Date().getFullYear()} Red Thread
          </p>
        </div>
      </footer>
    </PageWrapper>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CinematicSectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-14 animate-fade-up">
      <div className="flex items-center gap-4 mb-3">
        <span className="label-brass tracking-[0.6em]">{index}</span>
        <div
          className="h-px flex-1"
          style={{
            background: "linear-gradient(to right, rgba(212,175,55,0.25), rgba(212,175,55,0.05), transparent)",
          }}
        />
      </div>
      <h2 className="font-serif italic text-4xl md:text-5xl text-ivory tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function TeaserCard({
  case: c,
  stagger,
}: {
  case: { title: string; subtitle: string; setting: string; category: string };
  stagger: number;
}) {
  return (
    <div
      className={`framed-module relative p-5 animate-fade-up stagger-${Math.min(stagger, 6)}`}
      style={{ opacity: 0.72 }}
    >
      <div className="absolute top-4 right-4">
        <span className="label-brass border border-brass/15 bg-void/80 px-2 py-1 rounded-full text-[8px]">
          Season 2
        </span>
      </div>

      <span className="label-brass block mb-2 pr-16">{c.category}</span>
      <h3 className="font-serif text-xl text-ivory mb-1">{c.title}</h3>
      <p className="font-serif italic text-ivory/50 text-sm leading-snug mb-3">
        {c.subtitle}
      </p>
      <p className="metadata-text">{c.setting}</p>
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
      className="text-[9px] font-display uppercase tracking-[0.35em] text-ivory/30 hover:text-brass transition-colors duration-300"
    >
      {children}
    </Link>
  );
}
