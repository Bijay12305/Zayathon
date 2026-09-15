"""
Tests for Person 1: Ingestion & Chunking
Run with: pytest test_ingest.py or python test_ingest.py
"""

import os
import sys
import tempfile

# Ensure person1_ingestion and parent directory are on sys.path
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
    from chunker import CodeChunker
    from scanner import RepoScanner
    from ingest import IngestionPipeline
except ImportError:
    from person1_ingestion.chunker import CodeChunker
    from person1_ingestion.scanner import RepoScanner
    from person1_ingestion.ingest import IngestionPipeline


def test_chunker_small_file():
    chunker = CodeChunker(window_size=50, overlap=10)
    sample_code = "line1\nline2\nline3\n"
    chunks = chunker.chunk_file_content("test.py", sample_code)
    assert len(chunks) == 1
    assert chunks[0].start_line == 1
    assert chunks[0].end_line == 3
    assert chunks[0].file_path == "test.py"


def test_chunker_overlapping_windows():
    chunker = CodeChunker(window_size=10, overlap=3)
    # 25 lines
    lines = [f"print({i})\n" for i in range(1, 26)]
    sample_code = "".join(lines)

    chunks = chunker.chunk_file_content("test_large.py", sample_code)
    assert len(chunks) > 1

    # Check window step progression
    # Chunk 1: 1-10
    # Chunk 2: 8-17 (starts at 7+1 = 8)
    assert chunks[0].start_line == 1
    assert chunks[0].end_line == 10
    assert chunks[1].start_line == 8
    assert chunks[1].end_line == 17


def test_scanner_and_pipeline():
    with tempfile.TemporaryDirectory() as tmp_dir:
        # Create dummy repo files
        f1 = os.path.join(tmp_dir, "app.py")
        with open(f1, "w", encoding="utf-8") as f:
            f.write("def main():\n    print('hello')\n")

        sub = os.path.join(tmp_dir, "sub")
        os.makedirs(sub, exist_ok=True)
        f2 = os.path.join(sub, "utils.py")
        with open(f2, "w", encoding="utf-8") as f:
            f.write("# Utils\ndef add(a, b):\n    return a + b\n")

        out_json = os.path.join(tmp_dir, "chunks.json")
        pipeline = IngestionPipeline(window_size=20, overlap=5)
        chunks = pipeline.process_repository(tmp_dir, out_json)

        assert len(chunks) >= 2
        assert os.path.exists(out_json)
        assert chunks[0]["file_path"] in ["app.py", "sub/utils.py", "sub\\utils.py"]


if __name__ == "__main__":
    test_chunker_small_file()
    test_chunker_overlapping_windows()
    test_scanner_and_pipeline()
    print("All Person 1 tests passed successfully!")
