import { generateAnonymizedDraft } from './server/geminiService';
import 'dotenv/config';

async function test() {
  console.log("Starting AI Anonymisation Test...");
  const metadata = {
    role: 'PhD Student',
    institutionType: 'University',
    region: 'London',
    discipline: 'Physics',
    timeWindow: 'Recent'
  };
  const text = "I am James and I work at Imperial College London in the Blackett building. Yesterday my supervisor Dr. Smith told me to use the laser without goggles. It was very dangerous.";
  
  try {
    const result = await generateAnonymizedDraft(metadata, text);
    console.log("SUCCESS:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("FAILED:", err);
  }
}

test();
