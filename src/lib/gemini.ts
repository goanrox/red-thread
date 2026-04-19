import { GoogleGenAI } from "@google/genai";

export async function generateHeroImage(): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `A masterpiece cinematic background for a prestige mystery product.
  Style: ultra-premium manor noir, Apple-level polish, cinematic title sequence, deep atmospheric mystery.
  Visuals: deep charcoal and navy shadows, a very subtle and atmospheric silhouette of a grand manor in layered fog, warm gold light bloom emanating from a single distant window, faint floating gold dust particles, soft vignette, cinematic depth with multiple layers of mist.
  Composition: widescreen, high resolution, minimalist but rich in detail, expensive aesthetic, no text, no UI, no people.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) return null;
    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Error generating hero image:", error);
  }

  return null;
}
