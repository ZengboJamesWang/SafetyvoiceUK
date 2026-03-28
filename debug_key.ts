import { GoogleGenAI } from "@google/genai";

async function test() {
  const apiKey = "AIzaSyASP4DMgIT_B-eJ-IhxpsDxhHI7BBqR2jE";
  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent("Say hello");
    console.log("SUCCESS:", result.response.text());
  } catch (err: any) {
    console.error("FAILED:", err.message || err);
  }
}

test();
