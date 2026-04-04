// Phase 1 — Interrogation chat

export default function InterrogationPage({
  params,
}: {
  params: { caseId: string; suspectId: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <p className="label-caps text-mist">
        Interrogating {params.suspectId} — {params.caseId}
      </p>
    </main>
  );
}
