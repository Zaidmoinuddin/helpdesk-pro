import React, { useEffect, useState } from 'react';
import { deleteFaq, getFaqs, postFaq } from '../services/api';

import { required } from '../utils/validate';

const DocumentsView = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const load = async () => {
    try {
      const data = await getFaqs();
      setFaqs(data);
    } catch (e) {
      setError('Failed to load FAQs');
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!required(question) || !required(answer)) {
      setError('Please provide both question and answer.');
      return;
    }

    setLoading(true);
    try {
      const res = await postFaq(question.trim(), answer.trim());
      setFaqs((prev) => [...prev, res]);
      setQuestion(''); setAnswer('');
      setSuccess('FAQ added successfully.');
    } catch (err) {
      if ((err.message || '').includes('401')) {
        setError('Unauthorized. If this server uses an admin token, set ADMIN_TOKEN on the server and provide credentials.');
      } else {
        setError(err.message || 'Failed to save FAQ');
      }
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    setError(null); setSuccess(null);
    try {
      await deleteFaq(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      setSuccess('FAQ deleted.');
    } catch (e) { setError('Delete failed'); }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>FAQ Manager</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 720, marginTop: 12, display: 'grid', gap: 8 }}>
        <label>Question</label>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Short question" />
        <label>Answer</label>
        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Full answer" rows={4} />

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Saving...' : 'Add FAQ'}</button>
          <button type="button" onClick={() => { setQuestion(''); setAnswer(''); setError(null); setSuccess(null); }} style={{ padding: '8px 12px' }}>Reset</button>
          {success && <div style={{ color: 'green' }}>{success}</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
      </form>

      <div style={{ marginTop: 24 }}>
        <h3>Existing FAQs</h3>
        <ul>
          {faqs.map((f) => (
            <li key={f.id} style={{ marginBottom: 8 }}>
              <strong>{f.question}</strong>
              <div>{f.answer}</div>
              <button onClick={() => handleDelete(f.id)} style={{ marginTop: 6 }}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DocumentsView;
