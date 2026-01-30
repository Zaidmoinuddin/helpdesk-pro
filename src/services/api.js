// Lightweight API service with error handling and timeouts
const DEFAULT_TIMEOUT = 10000;

function timeoutFetch(url, opts = {}, ms = DEFAULT_TIMEOUT) {
  return Promise.race([
    fetch(url, opts),
    new Promise((_, rej) => setTimeout(() => rej(new Error('Request timeout')), ms)),
  ]);
}

export async function postChat(message) {
  const base = process.env.REACT_APP_API_URL || '';
  const url = `${base}/api/chat`;
  const res = await timeoutFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return res.json();
}

export async function getFaqs() {
  const base = process.env.REACT_APP_API_URL || '';
  const res = await timeoutFetch(`${base}/api/faqs`);
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return res.json();
}

export async function postFaq(question, answer, adminToken) {
  const base = process.env.REACT_APP_API_URL || '';
  const headers = { 'Content-Type': 'application/json' };
  if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
  const res = await timeoutFetch(`${base}/api/faqs`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ question, answer }),
  });
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return res.json();
}

export async function deleteFaq(id, adminToken) {
  const base = process.env.REACT_APP_API_URL || '';
  const headers = {};
  if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
  const res = await timeoutFetch(`${base}/api/faqs/${id}`, { method: 'DELETE', headers });
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return res.json();
}

export default { postChat, getFaqs, postFaq };
