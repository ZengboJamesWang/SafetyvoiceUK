
import { SubmissionRecord, SubmissionStatus } from '../types';

function authHeaders(): Record<string, string> {
  const token = sessionStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const db = {
  async getAll(): Promise<SubmissionRecord[]> {
    const res = await fetch('/api/admin/submissions', { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to load submissions');
    return res.json();
  },

  async getPublished(): Promise<SubmissionRecord[]> {
    const res = await fetch('/api/stories');
    if (!res.ok) throw new Error('Failed to load stories');
    return res.json();
  },

  async save(record: Omit<SubmissionRecord, 'id' | 'createdAt'>): Promise<{ id: string; draft: Partial<SubmissionRecord> }> {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Submission failed');
    }
    return res.json();
  },

  async updateStatus(id: string, status: SubmissionStatus): Promise<void> {
    const res = await fetch(`/api/submissions/${id}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
  },
};
