
import React, { useState } from 'react';
import { db } from '../utils/db';
import { SubmissionStatus } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

const SubmitPage: React.FC = () => {
  const [formData, setFormData] = useState({
    role: '',
    institutionType: '',
    region: '',
    discipline: '',
    timeWindow: '',
    whatHappened: '',
    impact: '',
    improvement: '',
    consentPublish: false,
    hp: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateAiDraft = async (data: typeof formData) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const systemInstruction = `
      You are an expert anonymisation assistant for SafetyVoice UK. 
      Your task is to take a raw laboratory safety experience and rewrite it into a professional, anonymised narrative for public consumption.
      RULES:
      1. REMOVE: Names, University names, Department names, specific Room numbers, and exact Dates.
      2. GENERALISE: Specific equipment brands (e.g., replace 'Nikon Ti2' with 'high-end inverted microscope').
      3. TONE: Maintain a constructive, neutral, and professional tone.
      4. STRUCTURE: Use "### What happened", "### Impact", and "### What would help" headers.
      5. FORMAT: Return valid JSON matching the schema provided.
    `;

    const prompt = `
      Please anonymise and draft a story for a: ${data.role} in ${data.discipline} at a ${data.institutionType} in ${data.region}.
      
      RAW EXPERIENCE:
      ${data.whatHappened}
      
      IMPACT:
      ${data.impact}
      
      SUGGESTED IMPROVEMENTS:
      ${data.improvement}
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              publishTitle: { type: Type.STRING, description: 'A neutral title' },
              publishSummary: { type: Type.STRING, description: '1-sentence summary' },
              publishStory: { type: Type.STRING, description: 'Markdown formatted story with required headers' },
              anonymisationNotes: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: 'Brief list of what was changed for privacy'
              },
              confidence: { type: Type.STRING, description: 'high|medium|low' }
            },
            required: ["publishTitle", "publishSummary", "publishStory", "anonymisationNotes", "confidence"]
          }
        }
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error("AI Generation failed:", error);
      return {
        publishTitle: "Experience Report",
        publishSummary: "Report pending manual anonymisation review.",
        publishStory: `### What happened\n${data.whatHappened}\n\n### Impact\n${data.impact}\n\n### What would help\n${data.improvement}`,
        anonymisationNotes: ["AI processing failed - manual redaction required."],
        confidence: "low",
        riskFlags: ["API_ERROR"]
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.hp) return;

    setIsSubmitting(true);

    try {
      const aiDraft = await generateAiDraft(formData);

      db.save({
        ...formData,
        ...aiDraft,
        riskFlags: aiDraft.riskFlags || [],
        status: SubmissionStatus.DRAFT_GENERATED
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Error during submission. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-xl">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Submission Successful</h1>
          <p className="text-slate-600 leading-relaxed font-normal mb-8">
            Your report has been securely saved. Our Gemini AI has prepared an anonymised draft for our editorial team. 
            <br/><br/>
            <span className="font-bold text-slate-800 italic">Why is my story not showing yet?</span><br/>
            To protect contributor privacy, every AI-drafted story must be <strong>manually reviewed</strong> by a human moderator before it appears in the "Published Stories" feed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.hash = '/'} 
              className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition"
            >
              Return Home
            </button>
            <button 
              onClick={() => window.location.hash = '/admin'} 
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
            >
              Go to Admin Moderation
            </button>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-100">
             <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
               Data Governance: 10-Year Archival Record Created
             </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Share your experience</h1>
        <p className="text-slate-500 font-normal">
          Participate in the 2026-2029 Safety Culture project. All data is processed using Google Gemini AI for automated anonymisation and archived for 10 years in line with UKRI principles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-bold text-slate-900">AI Anonymisation in Progress</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-xs">Rewriting your experience into a safe, anonymised narrative. This ensures compliance with UK GDPR and research integrity guidelines.</p>
          </div>
        )}

        <input type="text" name="hp" value={formData.hp} onChange={handleChange} className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Your Role</label>
            <select name="role" required value={formData.role} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none appearance-none bg-slate-50">
              <option value="">Select...</option>
              <option value="Academic Staff">Academic Staff</option>
              <option value="PhD Student">PhD Student</option>
              <option value="Technical Staff">Technical Staff</option>
              <option value="Research Fellow">Research Fellow</option>
              <option value="Laboratory Manager">Laboratory Manager</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">UK Region</label>
            <select name="region" required value={formData.region} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none appearance-none bg-slate-50">
              <option value="">Select...</option>
              <option value="East Midlands">East Midlands</option>
              <option value="East of England">East of England</option>
              <option value="London">London</option>
              <option value="North East">North East</option>
              <option value="North West">North West</option>
              <option value="Northern Ireland">Northern Ireland</option>
              <option value="Scotland">Scotland</option>
              <option value="South East">South East</option>
              <option value="South West">South West</option>
              <option value="Wales">Wales</option>
              <option value="West Midlands">West Midlands</option>
              <option value="Yorkshire and the Humber">Yorkshire and the Humber</option>
              <option value="Crown Dependencies (Isle of Man/Channel Islands)">Crown Dependencies (Isle of Man/Channel Islands)</option>
              <option value="Other / Outside UK">Other / Outside UK</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Institution Type</label>
            <select name="institutionType" required value={formData.institutionType} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none appearance-none bg-slate-50">
              <option value="">Select...</option>
              <option value="Russell Group">Russell Group</option>
              <option value="Post-92 University">Post-92 University</option>
              <option value="Research Institute">Research Institute</option>
              <option value="Specialist Institution">Specialist Institution</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Scientific Discipline</label>
            <select name="discipline" required value={formData.discipline} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none appearance-none bg-slate-50">
              <option value="">Select...</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology / Life Sciences">Biology / Life Sciences</option>
              <option value="Engineering">Engineering</option>
              <option value="Materials Science">Materials Science</option>
              <option value="Environmental Science">Environmental Science</option>
            </select>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">What happened? *</label>
            <textarea required name="whatHappened" value={formData.whatHappened} onChange={handleChange} rows={5} className="w-full border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-slate-900 outline-none font-normal leading-relaxed" placeholder="Describe the safety event. AI will strip names, university names, buildings and room numbers." />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">Impact & Wellbeing *</label>
            <textarea required name="impact" value={formData.impact} onChange={handleChange} rows={4} className="w-full border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-slate-900 outline-none font-normal leading-relaxed" placeholder="How did this affect your research output, mental wellbeing, or dignity?" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">Suggested Resolution *</label>
            <textarea required name="improvement" value={formData.improvement} onChange={handleChange} rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-slate-900 outline-none font-normal leading-relaxed" placeholder="How could this have been handled to preserve both safety and dignity?" />
          </div>
        </div>

        <div className="p-8 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <input type="checkbox" required name="consentPublish" checked={formData.consentPublish} onChange={handleChange} className="h-5 w-5 rounded border-amber-300 text-slate-900 focus:ring-slate-900 cursor-pointer" />
          </div>
          <div className="text-sm text-amber-900 font-medium leading-relaxed">
            I consent to the publication of an anonymised summary. 
            <p className="text-amber-700 font-normal mt-1 text-xs">
              I acknowledge that my raw response will be preserved for 10 years (until 2039) for research archival purposes in line with UKRI principles.
            </p>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white font-bold py-5 px-6 rounded-2xl hover:bg-slate-800 transition disabled:opacity-50 shadow-xl shadow-slate-200 active:scale-[0.99]">
          {isSubmitting ? 'AI Processing...' : 'Submit to Moderation Queue'}
        </button>
      </form>
    </div>
  );
};

export default SubmitPage;
