# Person 2: Retrieval & Storage

**Track 3: Developer Tooling — Codebase Intelligence & Navigation**

> **Role Ownership:** Turning stored embeddings into *"here are the 5 most relevant chunks for this question."*

---

## 1. Quick Concept: Cosine Similarity

Cosine similarity measures the cosine of the angle between two vectors in multi-dimensional space.
$$\text{similarity}(\mathbf{A}, \mathbf{B}) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|}$$

- **`1.0`**: Exactly identical in semantic direction / meaning
- **`0.0`**: Orthogonal (unrelated)
- **`-1.0`**: Diametrically opposite

We compute this using vector matrix multiplication in `numpy` across all code chunks in milliseconds.

---

## 2. Sync Point 1: Storage Format (Person 1 ↔ Person 2)

Person 1 outputs chunks to a JSON file (`chunks.json`) or SQLite DB (`chunks.db`). Person 2 loads either format seamlessly.

### JSON Storage Schema:
```json
[
  {
    "chunk_id": "chunk_auth_01",
    "file_path": "src/auth/jwt.py",
    "start_line": 1,
    "end_line": 28,
    "text": "def create_access_token(data: dict): ...",
    "embedding": [0.0123, -0.0456, 0.0891, ...],
    "metadata": {}
  }
]
```

### SQLite Schema (`chunks` table):
- `chunk_id` (TEXT PRIMARY KEY)
- `file_path` (TEXT)
- `start_line` (INTEGER)
- `end_line` (INTEGER)
- `text` (TEXT)
- `embedding` (TEXT - JSON serialized float array)
- `metadata` (TEXT - JSON serialized object)

---

## 3. Sync Point 2: Query Function Contract (Person 2 ↔ Person 3)

Person 3's FastAPI `/ask` endpoint can directly import and call Person 2's `search()`:

```python
from person2_retrieval.retrieval import init_retriever, search

# 1. Initialize with chunks file at server startup
init_retriever("path/to/chunks.json")

# 2. In Person 3's /ask endpoint handler:
top_chunks = search("where is auth handled?", top_k=5)
```

### Return Shape:
```json
[
  {
    "chunk_id": "chunk_auth_01",
    "file_path": "src/auth/jwt.py",
    "start_line": 1,
    "end_line": 28,
    "text": "def create_access_token(data: dict): ...",
    "similarity_score": 0.8924
  }
]
```

---

## 4. File Structure

```
person2_retrieval/
├── retrieval.py         # Main engine (vector math, storage loader, search)
├── mock_chunks.json     # Ready-to-use sample dataset
├── test_retrieval.py    # Complete test suite (math, storage, ranking)
├── demo.py              # CLI demo with realistic code queries
├── requirements.txt     # Dependencies (numpy, google-generativeai, pytest)
└── README.md            # Integration documentation
```

---

## 5. Running the Tests & Demo

```bash
# Run tests
python test_retrieval.py

# Run interactive demo
python demo.py

# Custom query test
python demo.py --query "where is auth handled?"
```
