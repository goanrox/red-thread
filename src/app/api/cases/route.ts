// Phase 4 — Dynamic case API
// Stub until Phase 4 implementation.

import { NextResponse } from "next/server";
import { getCaseSummaries } from "@/data";

export async function GET() {
  return NextResponse.json(getCaseSummaries());
}
