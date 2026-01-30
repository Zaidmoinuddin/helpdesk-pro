# Helpdesk Pro — MVP Prototype

Helpdesk Pro is a lightweight prototype demonstrating a Retrieval-Augmented Generation (RAG) approach for automating customer support for SMBs. This repository contains a minimal full-stack scaffold you can iterate on.

Contents
- `src/` — React frontend (chat widget and simple admin views)
- `server/` — Node.js + Express API (FAQ store + chat endpoint)
- `docker-compose.yml` — quick dev environment (server + optional Postgres)

Highlights
- Quick FAQ-driven RAG: the API retrieves matching FAQ entries and (optionally) uses OpenAI to generate responses when `OPENAI_API_KEY` is set.
- Frontend features: quick questions, persistent chat (localStorage), typing indicator, mobile-responsive chat UI.

Quick Start (local)

1) Frontend

```powershell
# from project root
npm install
npm run dev
```

2) Backend (in separate terminal)

```powershell
cd server
npm install
npm run dev
```

3) Optional: Docker Compose

```bash
cp .env.example .env
# set OPENAI_API_KEY in .env if you want generated replies
docker-compose up --build
```

API Endpoints
- `GET /api/faqs` — list FAQs
- `POST /api/faqs` — add FAQ (`{ question, answer }`)
- `DELETE /api/faqs/:id` — delete FAQ
- `POST /api/chat` — chat (`{ message }`) -> `{ reply, source }`

Developer Notes & Next Steps
- Replace the JSON FAQ store with PostgreSQL (or vector DB + pgvector/Pinecone) for production-scale RAG.
- Add authentication, RBAC for admin routes, and input validation server-side.
- Implement embedding-based retrieval: generate embeddings for docs, store in vector DB, perform similarity search, then pass top-K context to OpenAI.
- Add logging, metrics, and monitoring (CloudWatch, Prometheus/Grafana).

Contact
For questions about this prototype or help extending it, open an issue or contact the maintainer.
