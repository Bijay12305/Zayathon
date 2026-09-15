# Person 1: Ingestion & Chunking

**Track 3: Developer Tooling — Codebase Intelligence & Navigation**

> **Role Ownership:** Turning a raw repo into clean, embeddable pieces.

---

## 1. Features

- **Recursive Code Scanner:** Walks files, respects ignore rules (`.git`, `node_modules`, `.venv`, binaries).
- **Overlapping Fixed-Window Chunker:** Default 50 lines with 10-line overlap. Accurately tracks `file_path`, `start_line`, and `end_line`.
- **Embedding Generation:** Embeds chunks via Gemini `text-embedding-004` or offline fallback.
- **Dual Output Formats:** Direct output to JSON (`chunks.json`) or SQLite (`chunks.db`) for Person 2.

---

## 2. Usage

```bash
# Run ingestion on current repository
python ingest.py --repo ../ --output ../person2_retrieval/chunks.json

# Run unit tests
python test_ingest.py
```
