
import React, { useState } from 'react';
import { db } from '../utils/db';
import { SubmissionStatus } from '../types';

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
    contactName: '',
    contactEmail: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.hp) return;

    setIsSubmitting(true);

    try {
      // 1. Save to local storage for offline resilience
      const localRecord = await db.save({
        ...formData,
        status: SubmissionStatus.PRIVATE
      });

      // 2. The backend now handles AI anonymisation and MariaDB persistence
      // We already call the backend inside db.save() via fetch('/api/submissions')
      
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
          All submissions are processed using Google Gemini AI for automated anonymisation and securely archived in line with UK GDPR and institutional data management standards.
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
              <option value="Undergraduate / Masters Student">Undergraduate / Masters Student</option>
              <option value="PhD Student">PhD Student</option>
              <option value="Postdoctoral Researcher">Postdoctoral Researcher</option>
              <option value="Research Fellow">Research Fellow</option>
              <option value="Academic Staff">Academic Staff (Lecturer / Senior Lecturer / Professor)</option>
              <option value="Technical Staff">Technical Staff / Technician</option>
              <option value="Laboratory Manager">Laboratory Manager</option>
              <option value="Health & Safety Officer">Health &amp; Safety Officer</option>
              <option value="Visiting Researcher / Scholar">Visiting Researcher / Scholar</option>
              <option value="Professional Services Staff">Professional Services / Administrative Staff</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Region / Location</label>
            <select name="region" required value={formData.region} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none appearance-none bg-slate-50">
              <option value="">Select...</option>
              <optgroup label="── UK Regions ──">
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
                <option value="Crown Dependencies">Crown Dependencies (Isle of Man / Channel Islands)</option>
              </optgroup>
              <optgroup label="── Outside UK ──">
                <option value="Europe (outside UK)">Europe (outside UK)</option>
                <option value="North America">North America</option>
                <option value="Asia Pacific">Asia Pacific</option>
                <option value="Middle East & Africa">Middle East &amp; Africa</option>
                <option value="Latin America">Latin America</option>
                <option value="Other / International">Other / International</option>
              </optgroup>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">Primarily serving UK institutions — international submissions are welcome.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Institution Name</label>
            <input
              type="text"
              name="institutionType"
              required
              value={formData.institutionType}
              onChange={handleChange}
              placeholder="e.g. University of Manchester"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none bg-slate-50"
            />
            <p className="text-[10px] text-slate-400 mt-1">Your institution name will be anonymised before publication.</p>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Scientific Discipline</label>
            <select name="discipline" required value={formData.discipline} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none appearance-none bg-slate-50">
              <option value="">Select...</option>
              <option value="Biology / Life Sciences">Biology / Life Sciences</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Physics">Physics</option>
              <option value="Engineering">Engineering</option>
              <option value="Materials Science">Materials Science</option>
              <option value="Environmental Science">Environmental Science</option>
              <option value="Computer Science / IT">Computer Science / IT</option>
              <option value="Mathematics / Statistics">Mathematics / Statistics</option>
              <option value="Medical / Clinical Sciences">Medical / Clinical Sciences</option>
              <option value="Psychology / Neuroscience">Psychology / Neuroscience</option>
              <option value="Social Sciences / Humanities">Social Sciences / Humanities</option>
              <option value="Geography / Earth Sciences">Geography / Earth Sciences</option>
              <option value="Interdisciplinary / Mixed">Interdisciplinary / Mixed</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">When did this occur?</label>
          <select name="timeWindow" value={formData.timeWindow} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none appearance-none bg-slate-50">
            <option value="">Select (optional)...</option>
            <option value="Within the last month">Within the last month</option>
            <option value="1–6 months ago">1–6 months ago</option>
            <option value="6–12 months ago">6–12 months ago</option>
            <option value="1–3 years ago">1–3 years ago</option>
            <option value="More than 3 years ago">More than 3 years ago</option>
            <option value="Ongoing">Ongoing / recurring</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
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

        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-5">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <div>
              <p className="text-sm font-bold text-slate-900">Optional — Contact Details</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                If you are happy for the project team to contact you for further discussion, please provide your name and email below. This information is stored securely, is visible only to administrators, and will <strong>never</strong> be published or shared with anyone outside the project team.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Your Name <span className="normal-case font-normal">(optional)</span></label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="e.g. Dr Jane Smith"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Contact Email <span className="normal-case font-normal">(optional)</span></label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="e.g. j.smith@university.ac.uk"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none bg-white"
              />
            </div>
          </div>
        </div>

        <div className="p-8 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <input type="checkbox" required name="consentPublish" checked={formData.consentPublish} onChange={handleChange} className="h-5 w-5 rounded border-amber-300 text-slate-900 focus:ring-slate-900 cursor-pointer" />
          </div>
          <div className="text-sm text-amber-900 font-medium leading-relaxed">
            I consent to the publication of an anonymised summary.
            <p className="text-amber-700 font-normal mt-1 text-xs">
              I acknowledge that my raw response will be securely preserved for a minimum of 10 years for archival purposes in line with UK GDPR and institutional data governance standards.
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
