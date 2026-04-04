import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="label-caps text-crimson">Case Not Found</p>
      <h1 className="font-serif text-4xl text-parchment">The trail has gone cold.</h1>
      <p className="max-w-sm text-mist">
        The page you&apos;re looking for doesn&apos;t exist — or the evidence has been destroyed.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-xl border border-border px-6 py-3 text-sm text-mist transition-colors hover:border-gold hover:text-parchment"
      >
        Return to headquarters
      </Link>
    </main>
  );
}
