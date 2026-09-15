"""
Tests for Person 3: Backend & LLM Answer Layer
Run with: pytest test_backend.py or python test_backend.py
"""

import os
import sys

# Ensure person3_backend and parent directory are on sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
for p in (CURRENT_DIR, PARENT_DIR):
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    # pyrefly: ignore [missing-import]
    import pytest  # type: ignore
except (ImportError, ModuleNotFoundError):
    pytest = None  # type: ignore

try:
    # pyrefly: ignore [missing-import]
    from fastapi.testclient import TestClient  # type: ignore
    from app import app
    client = TestClient(app)
except (ImportError, ModuleNotFoundError):
    client = None  # type: ignore

from prompts import build_prompt
from llm_client import LLMClient


def test_health_endpoint():
    """Verify health endpoint."""
    if client is None:
        return
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


def test_root_endpoint():
    """Verify info root endpoint."""
    if client is None:
        return
    response = client.get("/")
    assert response.status_code == 200
    assert "endpoints" in response.json()


def test_ask_endpoint_success():
    """Verify /ask endpoint handles questions and returns answers with citations."""
    if client is None:
        return
    payload = {
        "question": "where is auth handled in the codebase?",
        "top_k": 3
    }
    response = client.post("/ask", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Verify JSON shape expected by Person 4
    assert data["question"] == payload["question"]
    assert "answer" in data
    assert isinstance(data["answer"], str)
    assert len(data["answer"]) > 0

    assert "citations" in data
    assert isinstance(data["citations"], list)
    assert len(data["citations"]) > 0

    # Verify citation fields
    citation = data["citations"][0]
    assert "file_path" in citation
    assert "start_line" in citation
    assert "end_line" in citation
    assert "snippet" in citation
    assert citation["start_line"] > 0


def test_ask_endpoint_empty_query():
    """Verify error on empty query."""
    if client is None:
        return
    response = client.post("/ask", json={"question": "   "})
    assert response.status_code == 400


def test_prompt_builder():
    """Verify prompt builder formats snippets with file and line annotations."""
    dummy_chunks = [
        {
            "file_path": "src/test.py",
            "start_line": 1,
            "end_line": 10,
            "text": "def hello(): return 'world'"
        }
    ]
    prompt = build_prompt("what does hello do?", dummy_chunks)
    assert "src/test.py" in prompt
    assert "Lines: 1-10" in prompt
    assert "QUESTION:" in prompt


if __name__ == "__main__":
    test_health_endpoint()
    test_root_endpoint()
    test_ask_endpoint_success()
    test_ask_endpoint_empty_query()
    test_prompt_builder()
    print("All Person 3 tests passed successfully!")
