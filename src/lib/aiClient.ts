// Phase 3 placeholder — AI interrogation client
// This file will wrap the Anthropic SDK once Phase 3 begins.
// In Phase 1, all responses are served from static question data.

export async function getAIResponse(_suspectId: string, _questionText: string): Promise<string> {
  throw new Error("AI interrogation is not enabled in this phase.");
}
