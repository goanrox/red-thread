// Phase 1 — Timeline analysis

export default function TimelinePage({ params }: { params: { caseId: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <p className="label-caps text-mist">Timeline — {params.caseId}</p>
    </main>
  );
}
