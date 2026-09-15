# Person 4: Frontend + Differentiator

**Track 3: Developer Tooling — Codebase Intelligence & Navigation**

> **Role Ownership:** The UI and the standout feature that makes this more than a generic Q&A chatbot — the differentiator (*"What would break if I change this?"*).

---

## 1. Features

### Feature A: Codebase Q&A Chat UI
- Plain English codebase questioning interface.
- Sends questions to Person 3's `/ask` endpoint (`http://localhost:8000/ask`).
- Interactive citation pills with file path and line badges.
- Click citation pill to open full code snippet drawer.
- Built-in instant fallback mock responses for zero-downtime demonstrations.

### Feature B: The Standout Differentiator ("What Breaks?")
- Scans symbol definitions (`def`, `function`, `class`), import statements, and call-sites across the entire codebase.
- Computes:
  - **Blast Radius & Impact Rating:** `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
  - **Affected Files List:** All files requiring regression testing.
  - **Call Site Explorer:** Exact lines and code where the function is executed.

---

## 2. Directory Structure

```
person4_frontend/
├── index.html         # Modern dark-mode interface
├── style.css          # Glassmorphic cyberpunk styling & animations
├── app.js             # API caller, citation renderer & differentiator engine
├── differentiator.py  # Python CLI / scanner for blast radius calculation
└── README.md          # Documentation
```

---

## 3. Running the Frontend

Open `person4_frontend/index.html` directly in any web browser, or serve it with Python:

```bash
# Serve frontend on http://localhost:3000
python -m http.server 3000 --directory c:\project1\Zyathon\person4_frontend
```
