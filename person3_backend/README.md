# Person 3: Backend + LLM Answer Layer

**Track 3: Developer Tooling — Codebase Intelligence & Navigation**

> **Role Ownership:** The FastAPI service and prompt design — the piece that turns retrieved chunks into a real, cited answer.

---

## 1. How It Works

```
Person 4 (Frontend)
       │  POST /ask { "question": "where is auth handled?" }
       ▼
Person 3 (FastAPI Service)
       │
       ├─► 1. Calls Person 2 `search(question, top_k=5)`
       │      └── Returns top-ranked code chunks with similarity scores
       │
       ├─► 2. Assembles Grounded Prompt with citations rule
       │      └── "Answer using ONLY these snippets. Cite file:lines."
       │
       ├─► 3. Calls LLM (Google Gemini / Grounded Mock Fallback)
       │      └── Generates concise answer citing sources
       │
       ▼
Returns JSON Response with Answer + Citations to Person 4
```

---

## 2. API Contract with Person 4 (Frontend)

### Request: `POST /ask`
**Headers:** `Content-Type: application/json`
```json
{
  "question": "where is auth handled?",
  "top_k": 5
}
```

### Response: `200 OK`
```json
{
  "question": "where is auth handled?",
  "answer": "Authentication is handled in `src/auth/jwt.py:1-28` using JWT token generation and in `src/auth/middleware.py:10-35` for token validation...",
  "citations": [
    {
      "file_path": "src/auth/jwt.py",
      "start_line": 1,
      "end_line": 28,
      "snippet": "import jwt\nfrom datetime import datetime...",
      "similarity_score": 0.8924
    },
    {
      "file_path": "src/auth/middleware.py",
      "start_line": 10,
      "end_line": 35,
      "snippet": "async def auth_middleware(request: Request):...",
      "similarity_score": 0.8412
    }
  ],
  "chunks_retrieved": 2
}
```

---

## 3. Directory Structure

```
person3_backend/
├── app.py             # FastAPI service (/ask, /health, CORS enabled)
├── models.py          # Pydantic request/response schemas
├── prompts.py         # Grounded citation prompt construction
├── llm_client.py      # Google Gemini integration with offline fallback
├── test_backend.py    # Test suite using FastAPI TestClient
├── requirements.txt   # Dependencies
└── README.md          # Documentation & API specs
```

---

## 4. Running the Server & Tests

```bash
# 1. Run automated tests
python test_backend.py

# 2. Start the FastAPI server on port 8000
python app.py
# or:
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Interactive Swagger API docs available at: `http://localhost:8000/docs`
