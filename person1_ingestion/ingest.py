"""
Person 1: Full Ingestion Pipeline
---------------------------------
Turns a raw codebase repository into clean, embedded chunks saved in JSON or SQLite.

Usage:
    python ingest.py --repo ../ --output ../person2_retrieval/chunks.json
"""

import argparse
import json
import math
import os
import sys
from pathlib import Path
from typing import Any, Dict, List

# Setup sys.path for robust standalone execution and modular imports
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
for path in (CURRENT_DIR, PARENT_DIR):
    if path not in sys.path:
        sys.path.insert(0, path)

try:
    from person2_retrieval.retrieval import EmbeddingProvider
except ImportError:
    try:
        from retrieval import EmbeddingProvider
    except ImportError:
        class EmbeddingProvider:  # type: ignore
            def __init__(self, *args, **kwargs): pass
            def embed_text(self, text: str) -> List[float]:
                vec = [0.0] * 128
                words = text.lower().split()
                if not words:
                    return vec
                for w in words:
                    vec[abs(hash(w)) % 128] += 1.0
                norm = math.sqrt(sum(x * x for x in vec))
                return [x / norm for x in vec] if norm > 0 else vec

try:
    from chunker import CodeChunker
    from scanner import RepoScanner
except ImportError:
    from person1_ingestion.chunker import CodeChunker
    from person1_ingestion.scanner import RepoScanner


class IngestionPipeline:
    def __init__(self, window_size: int = 50, overlap: int = 10, api_key: str = None):
        self.scanner = RepoScanner()
        self.chunker = CodeChunker(window_size=window_size, overlap=overlap)
        self.embedder = EmbeddingProvider(api_key=api_key)

    def process_repository(self, repo_dir: str, output_path: str, format: str = "json") -> List[Dict[str, Any]]:
        """
        Scans, chunks, embeds, and saves repo files.
        """
        print(f"[*] Scanning repository: {repo_dir}")
        all_chunks = []
        file_count = 0

        for rel_path, content in self.scanner.scan(repo_dir):
            file_count += 1
            raw_chunks = self.chunker.chunk_file_content(rel_path, content)
            for rc in raw_chunks:
                # Generate embedding
                vec = self.embedder.embed_text(rc.text)

                chunk_dict = {
                    "chunk_id": rc.chunk_id,
                    "file_path": rc.file_path,
                    "start_line": rc.start_line,
                    "end_line": rc.end_line,
                    "text": rc.text,
                    "embedding": vec,
                    "metadata": {
                        "total_file_lines": rc.total_file_lines
                    }
                }
                all_chunks.append(chunk_dict)

        print(f"[+] Scanned {file_count} files.")
        print(f"[+] Generated {len(all_chunks)} embedded chunks.")

        # Save to output file
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        if format.lower() == "json" or output_path.endswith(".json"):
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(all_chunks, f, indent=2)
            print(f"[+] Successfully saved JSON chunks to: {output_path}")
        else:
            # SQLite format
            import sqlite3
            conn = sqlite3.connect(output_path)
            cur = conn.cursor()
            cur.execute("""
                CREATE TABLE IF NOT EXISTS chunks (
                    chunk_id TEXT PRIMARY KEY,
                    file_path TEXT,
                    start_line INTEGER,
                    end_line INTEGER,
                    text TEXT,
                    embedding TEXT,
                    metadata TEXT
                )
            """)
            for c in all_chunks:
                cur.execute(
                    "INSERT OR REPLACE INTO chunks VALUES (?, ?, ?, ?, ?, ?, ?)",
                    (
                        c["chunk_id"], c["file_path"], c["start_line"], c["end_line"],
                        c["text"], json.dumps(c["embedding"]), json.dumps(c["metadata"])
                    )
                )
            conn.commit()
            conn.close()
            print(f"[+] Successfully saved SQLite chunks to: {output_path}")

        return all_chunks


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Person 1 Repository Ingestion & Chunking")
    parser.add_argument("--repo", "-r", type=str, default=".", help="Path to repository folder")
    parser.add_argument("--output", "-o", type=str, default="chunks.json", help="Output file path (.json or .db)")
    parser.add_argument("--window", "-w", type=int, default=50, help="Line window size per chunk")
    parser.add_argument("--overlap", "-l", type=int, default=10, help="Line overlap between windows")
    args = parser.parse_args()

    pipeline = IngestionPipeline(window_size=args.window, overlap=args.overlap)
    pipeline.process_repository(args.repo, args.output)
