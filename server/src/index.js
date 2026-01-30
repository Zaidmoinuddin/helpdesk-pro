const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const chat = require('./routes/chat');
const faqs = require('./routes/faqs');

const app = express();

// Security headers
app.use(helmet());

// CORS: restrict to configured origins when provided
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || 'http://localhost:5173,http://localhost:5174,http://localhost:5175').split(',');
app.use(cors({
  origin: function (origin, callback) {
    // allow non-browser tools (no origin) and allowed origins
    if (!origin) return callback(null, true);
    if (FRONTEND_ORIGINS.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS not allowed'), false);
  }
}));

// Body size limits to avoid large payload attacks
app.use(bodyParser.json({ limit: '10kb' }));

// Rate limiters
const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });
const faqLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });

app.use('/api/chat', chatLimiter, chat);
app.use('/api/faqs', faqLimiter, faqs);

app.get('/', (req, res) => {
  res.json({ status: 'Helpdesk Pro API', version: '0.1.0' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Helpdesk Pro server running on ${port}`));
