import { GoogleGenAI } from "@google/genai";

export async function generateHeroImage() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `A masterpiece cinematic background for a prestige mystery product.
Style: ultra-premium manor noir, Apple-level polish, cinematic title sequence, deep atmospheric mystery.
Visuals: deep charcoal and navy shadows, a very subtle and atmospheric silhouette of a grand manor in layered fog, warm gold light bloom emanating from a single distant window, faint floating gold dust particles, soft vignette, cinematic depth with multiple layers of mist.
Composition: widescreen, high resolution, minimalist but rich in detail, expensive aesthetic, no text, no UI, no people.`;

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1505843513577-22bb7d21ef45?q=80&w=2574&auto=format&fit=crop&grayscale=true&blur=2";

  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is missing. Using fallback hero image.");
    return FALLBACK_IMAGE;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData?.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED")) {
      console.info("Gemini API quota exhausted. Using cinematic fallback image.");
    } else {
      console.error("Error generating hero image:", error?.message || error);
    }
    return FALLBACK_IMAGE;
  }

  return FALLBACK_IMAGE;
}