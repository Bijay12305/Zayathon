"""
Person 3: FastAPI Backend Service
---------------------------------
Owns: The FastAPI service and prompt design — turning retrieved chunks into a real, cited answer.

Connects:
- Upstream: Person 2 (Retrieval & Storage search() function)
- Downstream: Person 4 (Frontend chat interface via /ask)
"""

import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Add parent directory to path to enable importing person2_retrieval
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

try:
    from person2_retrieval.retrieval import init_retriever, search as search_chunks
except ImportError:
    # Fallback if running standalone
    def init_retriever(*args, **kwargs): pass
    def search_chunks(query, top_k=5): return []

from models import AskRequest, AskResponse, CitationItem, HealthResponse
from llm_client import LLMClient

# Initialize FastAPI application
app = FastAPI(
    title="Codebase Intelligence API",
    description="Track 3: Developer Tooling — Codebase Q&A with Grounded Citations",
    version="1.0.0"
)

# Enable CORS for Person 4 frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM Client
llm_client = LLMClient()

# Initialize Person 2 retriever with mock chunks or custom storage
CHUNKS_PATH = os.path.join(PARENT_DIR, "person2_retrieval", "mock_chunks.json")
if os.path.exists(CHUNKS_PATH):
    init_retriever(CHUNKS_PATH)


@app.on_event("startup")
def startup_event():
    """Ensure retriever and LLM engine are loaded."""
    if os.path.exists(CHUNKS_PATH):
        init_retriever(CHUNKS_PATH)
        print(f"[Person 3 Backend] Connected to Person 2 storage: {CHUNKS_PATH}")


@app.get("/", tags=["Info"])
def root():
    return {
        "service": "Codebase Intelligence Backend (Person 3)",
        "docs": "/docs",
        "endpoints": {
            "ask": "POST /ask",
            "health": "GET /health"
        }
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health():
    return HealthResponse(
        status="healthy",
        service="codebase-intelligence-backend",
        version="1.0.0"
    )


@app.post("/ask", response_model=AskResponse, tags=["Q&A"])
def ask(req: AskRequest):
    """
    Main Person 3 endpoint:
    1. Receives question
    2. Calls Person 2's search() function to retrieve top chunks
    3. Builds prompt with question + snippets
    4. Calls LLM (Gemini or grounded fallback)
    5. Returns cited answer and structured citations for Person 4
    """
    question = req.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    # 1. Retrieve top matching chunks from Person 2
    top_chunks = search_chunks(question, top_k=req.top_k or 5)

    # 2. Call LLM to generate cited answer
    answer = llm_client.generate_answer(question, top_chunks)

    # 3. Format citations for Person 4
    citations = []
    for c in top_chunks:
        citations.append(CitationItem(
            file_path=c.get("file_path", "unknown"),
            start_line=c.get("start_line", 1),
            end_line=c.get("end_line", 1),
            snippet=c.get("text", "")[:200] + "..." if len(c.get("text", "")) > 200 else c.get("text", ""),
            similarity_score=c.get("similarity_score")
        ))

    return AskResponse(
        question=question,
        answer=answer,
        citations=citations,
        chunks_retrieved=len(top_chunks)
    )


if __name__ == "__main__":
    import uvicorn
    print("[Person 3] Starting FastAPI server on http://127.0.0.1:8000 ...")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
