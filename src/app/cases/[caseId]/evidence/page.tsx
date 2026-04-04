// Phase 1 — Evidence board

export default function EvidencePage({ params }: { params: { caseId: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <p className="label-caps text-mist">Evidence Board — {params.caseId}</p>
    </main>
  );
}
