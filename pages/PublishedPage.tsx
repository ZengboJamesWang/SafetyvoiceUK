
import React, { useState, useEffect } from 'react';
import { SubmissionRecord } from '../types';
import { db } from '../utils/db';

const PublishedPage: React.FC = () => {
  const [stories, setStories] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<SubmissionRecord | null>(null);

  useEffect(() => {
    // Fetch live published stories from simulation
    const data = db.getPublished();
    setStories(data);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 font-medium">Fetching published stories...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Published Experiences</h1>
        <p className="text-slate-500 max-w-2xl text-lg leading-relaxed font-normal">
          Reflections from the UK Higher Education community, anonymised to protect contributors.
        </p>
      </div>

      {stories.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-20 text-center border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium italic">No stories have been published to the community yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {stories.map(story => (
            <div 
              key={story.id} 
              className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition duration-300 cursor-pointer flex flex-col"
              onClick={() => setSelectedStory(story)}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-1 rounded">{story.region || 'UK'}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-1 rounded">{story.discipline || 'General'}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{story.publishTitle}</h2>
              <p className="text-sm text-slate-600 mb-8 flex-grow leading-relaxed font-normal">{story.publishSummary}</p>
              <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {story.publishedAt ? new Date(story.publishedAt).toLocaleDateString('en-GB') : 'Recently Published'}
                <span className="text-slate-900 text-xs">Read →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedStory && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-10 md:p-14">
            <button onClick={() => setSelectedStory(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="flex items-center gap-3 mb-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {selectedStory.discipline} • {selectedStory.region}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-10 leading-tight">{selectedStory.publishTitle}</h1>
            
            <div className="space-y-10">
               {selectedStory.publishStory?.split('###').filter(Boolean).map((section, i) => {
                 const lines = section.trim().split('\n');
                 const header = lines[0].trim();
                 const content = lines.slice(1).join('\n').trim();
                 return (
                   <div key={i} className="space-y-3">
                     <h3 className="text-lg font-bold text-slate-900">{header}:</h3>
                     <p className="text-base font-normal text-slate-700 leading-relaxed whitespace-pre-wrap">{content}</p>
                   </div>
                 );
               })}
            </div>
            <div className="mt-16 pt-8 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedStory(null)} className="bg-slate-100 px-8 py-3 rounded-xl font-bold text-slate-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishedPage;
