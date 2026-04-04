// Phase 1 — Accusation screen

export default function AccusePage({ params }: { params: { caseId: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <p className="label-caps text-mist">Make Your Accusation — {params.caseId}</p>
    </main>
  );
}
