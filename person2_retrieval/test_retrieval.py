"""
Tests for Person 2: Retrieval & Storage
Run with: pytest test_retrieval.py or python test_retrieval.py
"""

import math
import os
import sys
import tempfile

# Ensure person2_retrieval and parent directory are on sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
for path in (CURRENT_DIR, PARENT_DIR):
    if path not in sys.path:
        sys.path.insert(0, path)

try:
    # pyrefly: ignore [missing-import]
    import pytest  # type: ignore
except (ImportError, ModuleNotFoundError):
    pytest = None  # type: ignore

try:
    from retrieval import (
        CodeChunk,
        CodebaseRetriever,
        EmbeddingProvider,
        SearchResult,
        StorageLoader,
        cosine_similarity,
        init_retriever,
        search,
    )
except ImportError:
    from person2_retrieval.retrieval import (
        CodeChunk,
        CodebaseRetriever,
        EmbeddingProvider,
        SearchResult,
        StorageLoader,
        cosine_similarity,
        init_retriever,
        search,
    )


def test_cosine_similarity_math():
    """Verify cosine similarity calculation."""
    # Identical vectors -> score 1.0
    v1 = [1.0, 0.0, 0.0]
    v2 = [1.0, 0.0, 0.0]
    score = cosine_similarity(v1, v2)
    val = score[0] if isinstance(score, (list, tuple)) or hasattr(score, "__getitem__") else score
    assert math.isclose(float(val), 1.0, rel_tol=1e-5)

    # Orthogonal vectors -> score 0.0
    v3 = [0.0, 1.0, 0.0]
    score_ortho = cosine_similarity(v1, v3)
    val_ortho = score_ortho[0] if isinstance(score_ortho, (list, tuple)) or hasattr(score_ortho, "__getitem__") else score_ortho
    assert math.isclose(float(val_ortho), 0.0, abs_tol=1e-5)

    # Opposite vectors -> score -1.0
    v4 = [-1.0, 0.0, 0.0]
    score_opp = cosine_similarity(v1, v4)
    val_opp = score_opp[0] if isinstance(score_opp, (list, tuple)) or hasattr(score_opp, "__getitem__") else score_opp
    assert math.isclose(float(val_opp), -1.0, rel_tol=1e-5)


def test_storage_json_roundtrip():
    """Test saving and loading chunks to JSON."""
    chunks = [
        CodeChunk("c1", "src/auth.py", 1, 10, "def login(): pass", [0.1, 0.2]),
        CodeChunk("c2", "src/db.py", 1, 15, "def connect(): pass", [0.3, 0.4]),
    ]
    with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        StorageLoader.save_to_json(chunks, tmp_path)
        loaded = StorageLoader.load_from_json(tmp_path)
        assert len(loaded) == 2
        assert loaded[0].chunk_id == "c1"
        assert loaded[0].file_path == "src/auth.py"
        assert loaded[0].text == "def login(): pass"
        assert loaded[0].embedding == [0.1, 0.2]
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def test_storage_sqlite_roundtrip():
    """Test saving and loading chunks to SQLite."""
    chunks = [
        CodeChunk("c1", "src/auth.py", 1, 10, "def login(): pass", [0.1, 0.2]),
        CodeChunk("c2", "src/db.py", 1, 15, "def connect(): pass", [0.3, 0.4]),
    ]
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        StorageLoader.save_to_sqlite(chunks, tmp_path)
        loaded = StorageLoader.load_from_sqlite(tmp_path)
        assert len(loaded) == 2
        assert loaded[0].chunk_id == "c1"
        assert loaded[0].file_path == "src/auth.py"
        assert loaded[1].text == "def connect(): pass"
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def test_retriever_search_ranking():
    """Test semantic ranking on mock chunks."""
    mock_file = os.path.join(CURRENT_DIR, "mock_chunks.json")
    retriever = CodebaseRetriever()
    retriever.load_storage(mock_file)

    # 1. Search for auth
    results_auth = retriever.search("where is authentication and jwt token handled?", top_k=2)
    assert len(results_auth) == 2
    assert "auth" in results_auth[0].file_path

    # 2. Search for database
    results_db = retriever.search("how does the database connection work?", top_k=1)
    assert len(results_db) == 1
    assert "database" in results_db[0].file_path

    # 3. Search for payment/stripe
    results_pay = retriever.search("how is stripe charge and payment processed?", top_k=1)
    assert len(results_pay) == 1
    assert "stripe" in results_pay[0].file_path or "billing" in results_pay[0].file_path


def test_search_output_contract_for_person_3():
    """Verify that Person 2 output satisfies Person 3's required shape."""
    mock_file = os.path.join(CURRENT_DIR, "mock_chunks.json")
    init_retriever(mock_file)

    results = search("what would break if I change user registration?", top_k=5)
    assert isinstance(results, list)
    assert len(results) <= 5

    for item in results:
        assert "chunk_id" in item
        assert "file_path" in item
        assert "start_line" in item
        assert "end_line" in item
        assert "text" in item
        assert "similarity_score" in item
        assert isinstance(item["file_path"], str)
        assert isinstance(item["start_line"], int)
        assert isinstance(item["end_line"], int)
        assert isinstance(item["text"], str)
        assert isinstance(item["similarity_score"], float)


if __name__ == "__main__":
    test_cosine_similarity_math()
    test_storage_json_roundtrip()
    test_storage_sqlite_roundtrip()
    test_retriever_search_ranking()
    test_search_output_contract_for_person_3()
    print("All Person 2 tests passed successfully!")
