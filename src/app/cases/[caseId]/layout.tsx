import { CaseNav } from "@/components/layout/CaseNav";

export default async function CaseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;

  return (
    <div className="min-h-screen bg-void">
      <CaseNav caseId={caseId} />
      {/* pt-16 (global nav) + pt-12 (case nav top bar = 48px) */}
      <div className="pt-28">{children}</div>
    </div>
  );
}
