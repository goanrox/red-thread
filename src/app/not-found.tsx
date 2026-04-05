import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function NotFound() {
  return (
    <PageWrapper>
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{
          background: "radial-gradient(ellipse at center, rgba(107,99,212,0.06) 0%, transparent 60%)",
        }}
      >
        <p className="label-caps text-iris mb-6 tracking-[0.3em]">404</p>
        <h1 className="font-serif text-5xl md:text-6xl text-parchment leading-tight mb-4">
          This corridor leads nowhere.
        </h1>
        <p className="font-serif italic text-mist text-xl max-w-md leading-relaxed mb-12">
          The clue you&apos;re looking for doesn&apos;t exist — or perhaps it was never real. The best detectives know when to backtrack.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center px-8 py-4 rounded-xl border border-gold/40 text-gold font-sans font-semibold text-sm tracking-widest uppercase hover:bg-gold hover:text-void hover:border-gold transition-colors duration-200"
        >
          Return to the Investigation
        </Link>
      </div>
    </PageWrapper>
  );
}
