const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '..', '..', 'data', 'faqs.json');

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || null;

function loadFaqs() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

// atomic write: write to temp then rename
function saveFaqs(list) {
  try {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    const tmp = DATA_PATH + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(list, null, 2), 'utf8');
    fs.renameSync(tmp, DATA_PATH);
  } catch (e) {
    console.error('Failed to save faqs', e);
  }
}

function isValidText(s, max = 2000) {
  if (typeof s !== 'string') return false;
  if (!s.trim()) return false;
  if (s.length > max) return false;
  // basic reject of script tags to reduce stored XSS risk
  const lower = s.toLowerCase();
  if (lower.includes('<script') || lower.includes('javascript:')) return false;
  return true;
}

function requireAdmin(req, res, next) {
  if (!ADMIN_TOKEN) return next(); // no admin token configured => allow (dev mode)
  const auth = req.get('authorization') || req.get('x-admin-token') || '';
  if (auth.startsWith('Bearer ')) {
    if (auth.slice(7) === ADMIN_TOKEN) return next();
  } else if (auth === ADMIN_TOKEN) {
    return next();
  }
  return res.status(401).json({ error: 'unauthorized' });
}

router.get('/', (req, res) => {
  const faqs = loadFaqs();
  res.json(faqs);
});

router.post('/', requireAdmin, (req, res) => {
  const { question, answer } = req.body;
  if (!isValidText(question) || !isValidText(answer)) return res.status(400).json({ error: 'invalid question or answer' });
  const faqs = loadFaqs();
  const newFaq = { id: Date.now().toString(), question: question.trim(), answer: answer.trim() };
  faqs.push(newFaq);
  saveFaqs(faqs);
  res.json(newFaq);
});

router.delete('/:id', requireAdmin, (req, res) => {
  const faqs = loadFaqs();
  const next = faqs.filter((f) => f.id !== req.params.id);
  saveFaqs(next);
  res.json({ ok: true });
});

module.exports = router;
