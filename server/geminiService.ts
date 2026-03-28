import 'dotenv/config';
import { GoogleGenAI, Type } from "@google/genai";

// Ensure we have a key
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are a Senior Editorial and Data Privacy Expert for SafetyVoice UK. Your task is to transform raw reports about laboratory safety into high-quality, professional, and fully anonymised narratives.

STRICT ANONYMISATION STANDARDS:
1. REMOVE ALL proper names (people, universities, specific companies, buildings, labs, or software brands).
2. GENERALISE locations: Instead of "Department of Chemistry at Oxford", use "a Chemistry department at a Russell Group university".
3. REMOVE specific dates: Use "In early 2024" or "During a routine inspection".
4. REMOVE specific identifiers: Serial numbers, room numbers, or unique project titles.
5. PRESERVE the core safety concern and the human impact, but remove any trail that could lead back to the individual.

WRITING & WORDING STANDARDS:
1. USE professional, academic, yet accessible British English (en-GB).
2. ENSURE zero grammatical, spelling, or punctuation errors.
3. TONE must be neutral, objective, and constructive. Avoid emotive hyperbole while acknowledging the submitter's distress.
4. STRUCTURE the story clearly using the provided headers.
5. COMPLETE REWRITE: Do not simply echo the raw input. Re-style it into a coherent, flowing narrative suitable for a professional platform.

OUTPUT REQUIREMENT:
You must output valid JSON only. Do not include any conversational text outside the JSON block.
`;

export async function generateAnonymizedDraft(metadata: any, sanitisedText: string) {
  // Upgraded to Gemini 3 Flash Preview for cutting-edge performance
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
Generate a professional, anonymised draft for publication from the provided raw input.

CONTEXT:
Role: ${metadata.role || 'Not specified'}
Institution: ${metadata.institutionType || 'Not specified'}
Region: ${metadata.region || 'Not specified'}
Field: ${metadata.discipline || 'Not specified'}
Timeframe: ${metadata.timeWindow || 'Not specified'}

RAW INPUT:
${sanitisedText}

INSTRUCTIONS:
1. Create a professional 'publish_title' (max 12 words).
2. Write a concise 'publish_summary' (max 40 words).
3. Expand the 'publish_story' into three clear sections:
   ### What happened
   [Detail the event objectively and professionally]
   
   ### Impact
   [Detail the consequences for research and wellbeing]
   
   ### What would help
   [Suggest constructive resolutions]
4. List your specific changes in 'anonymisation_notes'.
`;

  try {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in environment");
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            publish_title: { type: Type.STRING },
            publish_summary: { type: Type.STRING },
            publish_story: { type: Type.STRING },
            anonymisation_notes: { type: Type.ARRAY, items: { type: Type.STRING } },
            risk_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence: { type: Type.STRING, description: 'low|medium|high' }
          },
          required: ["publish_title", "publish_summary", "publish_story", "anonymisation_notes", "risk_flags", "confidence"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      publishTitle: result.publish_title,
      publishSummary: result.publish_summary,
      publishStory: result.publish_story,
      anonymisationNotes: result.anonymisation_notes,
      riskFlags: result.risk_flags,
      confidence: result.confidence
    };
  } catch (error: any) {
    console.error("Gemini 2.5 Pro API Error:", error?.message || error);
    return {
      publishTitle: "Submission Review Pending",
      publishSummary: "This submission is currently undergoing manual editorial review.",
      publishStory: "The automated anonymisation process encountered an error. Our team is manually reviewing the report to ensure privacy standards are met.",
      anonymisationNotes: [`AI generation failed: ${error?.message || 'Unknown Error'}`],
      riskFlags: ["System Processing Error"],
      confidence: "low"
    };
  }
}

export function localRedact(text: string): string {
  let redacted = text;
  redacted = redacted.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
  redacted = redacted.replace(/https?:\/\/[^\s]+(?<![.!,?])/g, '[REDACTED_LINK]');
  redacted = redacted.replace(/\+?(\d[\s-]?){8,15}\d/g, '[REDACTED_PHONE]');
  redacted = redacted.replace(/(Hi|Hello|Dear|Sincerely|Thanks,)\s+([A-Z][a-z]+(\s+[A-Z][a-z]+)*)/g, '$1 [REDACTED_PERSON]');
  return redacted.replace(/\s{2,}/g, ' ').trim();
}
