const express = require('express');
const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '..', '..', 'data', 'faqs.json');

function loadFaqs() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

async function callOpenAI(prompt, openai) {
  const resp = await openai.createChatCompletion({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400
  });
  return resp.data.choices?.[0]?.message?.content || null;
}

router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || !message.trim()) return res.status(400).json({ error: 'message required' });

  // limit message size
  if (message.length > 2000) return res.status(400).json({ error: 'message too long' });

  const faqs = loadFaqs();

  // simple keyword match retrieval (case-insensitive)
  const lower = message.toLowerCase();
  let best = null;
  for (const f of faqs) {
    if ((f.question && lower.includes(f.question.toLowerCase())) || (f.answer && lower.includes(f.answer.toLowerCase()))) {
      best = f;
      break;
    }
  }

  // If OpenAI key provided, use it to generate RAG-style reply using best match as context
  if (process.env.OPENAI_API_KEY) {
    try {
      const cfg = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
      const openai = new OpenAIApi(cfg);

      const context = best ? `Reference doc:\nQ: ${best.question}\nA: ${best.answer}\n\n` : '';
      const prompt = `You are Helpdesk Pro assistant. Use the following context to answer the user briefly and helpfully.\n\n${context}User: ${message}`;
      const reply = await callOpenAI(prompt, openai);
      return res.json({ reply, source: best || null });
    } catch (e) {
      // avoid leaking internal details
      console.error('OpenAI error');
    }
  }

  // Fallback: canned responses or close match
  if (best) {
    return res.json({ reply: best.answer, source: best });
  }

  // final fallback — avoid echoing raw message back
  const safeEcho = message.length > 200 ? message.slice(0, 197) + '...' : message;
  return res.json({ reply: `Thanks — I received your message. Please provide more details or choose a quick question. (${safeEcho})`, source: null });
});

module.exports = router;
const express = require('express');
const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '..', '..', 'data', 'faqs.json');

function loadFaqs() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

async function callOpenAI(prompt, openai) {
  const resp = await openai.createChatCompletion({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400
  });
  return resp.data.choices?.[0]?.message?.content || null;
}

router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });

  const faqs = loadFaqs();

  // simple keyword match retrieval
  const lower = message.toLowerCase();
  let best = null;
  for (const f of faqs) {
    if (lower.includes(f.question.toLowerCase()) || lower.includes(f.answer.toLowerCase())) {
      best = f;
      break;
    }
  }

  // If OpenAI key provided, use it to generate RAG-style reply using best match as context
  if (process.env.OPENAI_API_KEY) {
    try {
      const cfg = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
      const openai = new OpenAIApi(cfg);

      const context = best ? `Reference doc:
Q: ${best.question}
A: ${best.answer}

` : '';
      const prompt = `You are Helpdesk Pro assistant. Use the following context to answer the user briefly and helpfully.\n\n${context}User: ${message}`;
      const reply = await callOpenAI(prompt, openai);
      return res.json({ reply, source: best || null });
    } catch (e) {
      console.error('OpenAI error', e.message || e);
    }
  }

  // Fallback: canned responses or close match
  if (best) {
    return res.json({ reply: best.answer, source: best });
  }

  // final fallback
  return res.json({ reply: `Thanks — I received: "${message}". Please provide more details or choose a quick question.`, source: null });
});

module.exports = router;
