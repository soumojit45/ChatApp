import "dotenv/config"

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",
    input: "who am i ?",
  });
  console.log(interaction.sdkHttpResponse.responseInternal.status)
  console.log(interaction.output_text);
}

main();