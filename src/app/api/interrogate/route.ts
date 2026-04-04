// Phase 3 — AI interrogation endpoint
// Stub until Phase 3 implementation.

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "AI interrogation is not enabled in this phase." },
    { status: 501 }
  );
}
