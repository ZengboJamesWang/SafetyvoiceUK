
import { GoogleGenAI, Type } from "@google/genai";

// Note: This file is intended for the server environment where process.env is defined.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are an anonymisation and editorial assistant for a public website publishing anonymised experiences about laboratory safety enforcement in Higher Education. 
Remove identifying information. Preserve meaning. Maintain neutral constructive tone. 
Do not invent facts. Do not include names of people, universities, buildings, departments, room numbers, email addresses, phone numbers, URLs, or exact dates. 
Generalise potentially identifying details. If allegations are present, frame as the submitter’s perspective using cautious language. 
Output valid JSON only matching the requested schema.
`;

export async function generateAnonymizedDraft(metadata: any, sanitisedText: string) {
  const model = process.env.GOOGLE_MODEL || 'gemini-3-flash-preview';
  
  const prompt = `
Generate an anonymised publishable draft from the following experience.

Metadata:
Role: ${metadata.role || 'Not specified'}
Institution type: ${metadata.institutionType || 'Not specified'}
Region: ${metadata.region || 'Not specified'}
Discipline: ${metadata.discipline || 'Not specified'}
Time window: ${metadata.timeWindow || 'Not specified'}

Sanitised text:
${sanitisedText}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            publish_title: { type: Type.STRING, description: 'Short catchy title for the story' },
            publish_summary: { type: Type.STRING, description: '1-2 sentence overview' },
            publish_story: { type: Type.STRING, description: 'The main narrative with headings: What happened / Impact / What would help' },
            anonymisation_notes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Internal notes on what was changed' },
            risk_flags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Any concerns for moderators' },
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
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback safe result
    return {
      publishTitle: "Experience Submission",
      publishSummary: "Summary pending manual review.",
      publishStory: sanitisedText,
      anonymisationNotes: ["AI generation failed, using sanitised text fallback."],
      riskFlags: ["Generation error"],
      confidence: "low"
    };
  }
}

export function localRedact(text: string): string {
  let redacted = text;
  // Emails
  redacted = redacted.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
  // URLs
  redacted = redacted.replace(/https?:\/\/[^\s]+/g, '[REDACTED_LINK]');
  // Phone numbers (simple pattern)
  redacted = redacted.replace(/\+?(\d[\s-]?){8,15}\d/g, '[REDACTED_PHONE]');
  // Salutations
  redacted = redacted.replace(/(Hi|Hello|Dear|Sincerely|Thanks,)\s+[A-Z][a-z]+/g, '$1 [REDACTED_PERSON]');
  
  return redacted;
}
