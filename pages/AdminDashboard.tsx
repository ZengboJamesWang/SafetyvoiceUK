
import React, { useState, useEffect } from 'react';
import { SubmissionRecord, SubmissionStatus } from '../types';
import { db } from '../utils/db';

const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<SubmissionRecord | null>(null);
  
  const [showPassModal, setShowPassModal] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', next: '', confirm: '' });
  const [passStatus, setPassStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  const loadData = () => {
    setSubmissions(db.getAll());
    setLoading(false);
  };

  useEffect(() => {
    if (!sessionStorage.getItem('admin_auth')) {
      window.location.hash = '/admin';
      return;
    }
    loadData();
  }, []);

  const updateStatus = (id: string, newStatus: SubmissionStatus) => {
    db.updateStatus(id, newStatus);
    loadData();
    setSelectedSub(null);
  };

  const handlePassChange = (e: React.FormEvent) => {
    e.preventDefault();
    const currentStored = localStorage.getItem('admin_password') || 'admin123';
    if (passForm.current !== currentStored) {
      setPassStatus({ type: 'error', msg: 'Current password is incorrect.' });
      return;
    }
    if (passForm.next !== passForm.confirm) {
      setPassStatus({ type: 'error', msg: 'New passwords do not match.' });
      return;
    }
    localStorage.setItem('admin_password', passForm.next);
    setPassStatus({ type: 'success', msg: 'Password updated successfully.' });
    setPassForm({ current: '', next: '', confirm: '' });
    setTimeout(() => { setShowPassModal(false); setPassStatus(null); }, 1500);
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-medium">Loading database...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Moderation Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Found {submissions.length} submissions in the local database.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowPassModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shadow-sm">
            Security
          </button>
          <button onClick={() => { sessionStorage.removeItem('admin_auth'); window.location.hash = '/'; }} className="px-4 py-2 text-sm text-red-500 font-semibold hover:bg-red-50 rounded-xl transition">
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role/Region</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {submissions.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {new Date(sub.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-tighter ${
                      sub.status === 'published' ? 'bg-green-50 text-green-700' :
                      sub.status === 'draft_generated' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {sub.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <div className="font-semibold text-slate-900">{sub.role || 'Unspecified'}</div>
                    <div className="text-xs text-slate-400">{sub.region || 'Unknown Region'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => setSelectedSub(sub)} className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPassModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-8 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Update Admin Password</h2>
            <form onSubmit={handlePassChange} className="space-y-4">
              <input type="password" required placeholder="Current Password" value={passForm.current} onChange={e => setPassForm(p => ({...p, current: e.target.value}))} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
              <input type="password" required placeholder="New Password" value={passForm.next} onChange={e => setPassForm(p => ({...p, next: e.target.value}))} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
              <input type="password" required placeholder="Confirm New" value={passForm.confirm} onChange={e => setPassForm(p => ({...p, confirm: e.target.value}))} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
              {passStatus && <div className={`p-3 rounded-lg text-xs font-bold ${passStatus.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{passStatus.msg}</div>}
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => { setShowPassModal(false); setPassStatus(null); }} className="flex-1 bg-slate-100 font-bold py-3 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedSub && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Reviewing {selectedSub.id}</h2>
              <button onClick={() => setSelectedSub(null)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <div className="flex-grow overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">Raw Data</h3>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-sm space-y-4 font-normal text-slate-600">
                  <p><strong>What happened:</strong><br/>{selectedSub.whatHappened}</p>
                  <p><strong>Impact:</strong><br/>{selectedSub.impact}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">Anonymised Draft</h3>
                <div className="space-y-4">
                  <input className="w-full text-lg font-bold border-b border-slate-200 py-2 outline-none" defaultValue={selectedSub.publishTitle} />
                  <textarea className="w-full text-sm border border-slate-200 p-4 rounded-xl outline-none h-48 font-normal" defaultValue={selectedSub.publishStory} />
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => updateStatus(selectedSub.id, SubmissionStatus.REJECTED)} className="px-6 py-3 bg-white text-red-600 rounded-xl font-bold">Reject</button>
              <button onClick={() => updateStatus(selectedSub.id, SubmissionStatus.PUBLISHED)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg">Approve & Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
