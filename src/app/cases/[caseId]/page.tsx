// Phase 1 — Investigation hub

export default function InvestigationPage({ params }: { params: { caseId: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <p className="label-caps text-mist">Investigation Hub — {params.caseId}</p>
    </main>
  );
}
