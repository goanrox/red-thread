// Phase 1 — Result / reveal screen

export default function ResultPage({ params }: { params: { caseId: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <p className="label-caps text-mist">Case Result — {params.caseId}</p>
    </main>
  );
}
