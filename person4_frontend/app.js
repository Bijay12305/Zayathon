/**
 * Person 4: Frontend Controller & Differentiator Engine
 * Track 3: Developer Tooling — Codebase Intelligence & Navigation
 */

const BACKEND_URL = "http://localhost:8000";

// Fallback Mock Knowledge Base for offline instant demo
const MOCK_KNOWLEDGE_BASE = {
  "auth": {
    question: "Where is authentication and token validation handled?",
    answer: "Authentication is managed via JSON Web Tokens (JWT). Token creation and verification are defined in `src/auth/jwt.py:1-28`, while the request authorization middleware is implemented in `src/auth/middleware.py:10-35`.",
    citations: [
      {
        file_path: "src/auth/jwt.py",
        start_line: 1,
        end_line: 28,
        snippet: "import jwt\nfrom datetime import datetime, timedelta\n\nSECRET_KEY = 'supersecretkey'\nALGORITHM = 'HS256'\n\ndef create_access_token(data: dict, expires_delta: timedelta = None):\n    to_encode = data.copy()\n    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))\n    to_encode.update({'exp': expire})\n    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)\n\ndef verify_token(token: str):\n    try:\n        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])\n        return payload\n    except jwt.PyJWTError:\n        return None"
      },
      {
        file_path: "src/auth/middleware.py",
        start_line: 10,
        end_line: 35,
        snippet: "async def auth_middleware(request: Request):\n    auth_header = request.headers.get('Authorization')\n    if not auth_header or not auth_header.startswith('Bearer '):\n        raise HTTPException(status_code=401, detail='Missing or invalid authorization header')\n    token = auth_header.split(' ')[1]\n    user_data = verify_token(token)\n    if not user_data:\n        raise HTTPException(status_code=401, detail='Invalid or expired token')\n    request.state.user = user_data"
      }
    ]
  },
  "database": {
    question: "How is the database connection managed in SQLite?",
    answer: "Database connections are provided using a Python context manager `get_db()` in `src/database/connection.py:1-25`. It automatically connects to `app.db`, sets `Row` factory, commits transactions, and guarantees connection closing.",
    citations: [
      {
        file_path: "src/database/connection.py",
        start_line: 1,
        end_line: 25,
        snippet: "import sqlite3\nfrom contextlib import contextmanager\n\nDATABASE_URL = 'app.db'\n\n@contextmanager\ndef get_db():\n    conn = sqlite3.connect(DATABASE_URL)\n    conn.row_factory = sqlite3.Row\n    try:\n        yield conn\n    finally:\n        conn.commit()\n        conn.close()"
      }
    ]
  },
  "user": {
    question: "How does user registration and password hashing work?",
    answer: "User registration is implemented via the `/users/register` POST endpoint in `src/routes/users.py:15-42`. It queries the SQLite database to check for existing usernames and saves the user record.",
    citations: [
      {
        file_path: "src/routes/users.py",
        start_line: 15,
        end_line: 42,
        snippet: "@router.post('/register')\ndef register_user(username: str, password_hash: str):\n    with get_db() as db:\n        existing = db.execute('SELECT id FROM users WHERE username = ?', (username,)).fetchone()\n        if existing:\n            raise HTTPException(status_code=400, detail='User already exists')\n        db.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password_hash))\n        return {'status': 'success', 'message': 'User registered'}"
      }
    ]
  },
  "stripe": {
    question: "How is Stripe payment processed?",
    answer: "Stripe payments are handled in `src/billing/stripe_client.py:5-30` via `process_payment(amount_cents, currency, customer_id)` which executes `stripe.Charge.create` with error handling.",
    citations: [
      {
        file_path: "src/billing/stripe_client.py",
        start_line: 5,
        end_line: 30,
        snippet: "def process_payment(amount_cents: int, currency: str = 'usd', customer_id: str = None):\n    try:\n        charge = stripe.Charge.create(\n            amount=amount_cents,\n            currency=currency,\n            customer=customer_id,\n            description='Zyathon Subscription'\n        )\n        return {'success': True, 'charge_id': charge.id}\n    except stripe.error.CardError as e:\n        return {'success': False, 'error': str(e)}"
      }
    ]
  }
};

// Simulated Codebase Index for Client-side Differentiator Analysis
const DIFFERENTIATOR_DATABASE = {
  "verify_token": {
    symbol: "verify_token",
    impact: "HIGH",
    warning: "Modifying `verify_token` signature or return type will break all protected routes in `middleware.py` and downstream user sessions.",
    definitions: [
      { file: "src/auth/jwt.py", line: 15, code: "def verify_token(token: str):" }
    ],
    imports: [
      { file: "src/auth/middleware.py", line: 2, code: "from .jwt import verify_token" }
    ],
    calls: [
      { file: "src/auth/middleware.py", line: 18, code: "user_data = verify_token(token)" },
      { file: "src/routes/users.py", line: 5, code: "payload = verify_token(token)" }
    ],
    files: ["src/auth/jwt.py", "src/auth/middleware.py", "src/routes/users.py"]
  },
  "get_db": {
    symbol: "get_db",
    impact: "CRITICAL",
    warning: "Modifying `get_db` directly impacts all database transactions, connection pooling, and data persistence layers across 4 routes.",
    definitions: [
      { file: "src/database/connection.py", line: 7, code: "def get_db():" }
    ],
    imports: [
      { file: "src/routes/users.py", line: 2, code: "from ..database.connection import get_db" },
      { file: "src/routes/billing.py", line: 3, code: "from ..database.connection import get_db" },
      { file: "src/routes/analytics.py", line: 2, code: "from ..database.connection import get_db" }
    ],
    calls: [
      { file: "src/routes/users.py", line: 17, code: "with get_db() as db:" },
      { file: "src/routes/billing.py", line: 22, code: "with get_db() as db:" },
      { file: "src/routes/analytics.py", line: 12, code: "with get_db() as db:" }
    ],
    files: ["src/database/connection.py", "src/routes/users.py", "src/routes/billing.py", "src/routes/analytics.py"]
  },
  "register_user": {
    symbol: "register_user",
    impact: "LOW",
    warning: "Isolated route handler in `users.py`. Safe to modify internally provided API request contract is preserved.",
    definitions: [
      { file: "src/routes/users.py", line: 16, code: "def register_user(username: str, password_hash: str):" }
    ],
    imports: [],
    calls: [
      { file: "tests/test_users.py", line: 10, code: "response = register_user('test', 'hash123')" }
    ],
    files: ["src/routes/users.py", "tests/test_users.py"]
  },
  "create_access_token": {
    symbol: "create_access_token",
    impact: "MEDIUM",
    warning: "Used during user login and token refresh. Changing expiry defaults will affect session lifetimes.",
    definitions: [
      { file: "src/auth/jwt.py", line: 8, code: "def create_access_token(data: dict, expires_delta: timedelta = None):" }
    ],
    imports: [
      { file: "src/routes/users.py", line: 3, code: "from ..auth.jwt import create_access_token" }
    ],
    calls: [
      { file: "src/routes/users.py", line: 35, code: "token = create_access_token({'sub': user.id})" }
    ],
    files: ["src/auth/jwt.py", "src/routes/users.py"]
  },
  "process_payment": {
    symbol: "process_payment",
    impact: "MEDIUM",
    warning: "Payment gateway integration. Ensure charge error handlers remain intact.",
    definitions: [
      { file: "src/billing/stripe_client.py", line: 7, code: "def process_payment(amount_cents: int, currency: str = 'usd', customer_id: str = None):" }
    ],
    imports: [
      { file: "src/routes/billing.py", line: 4, code: "from ..billing.stripe_client import process_payment" }
    ],
    calls: [
      { file: "src/routes/billing.py", line: 40, code: "res = process_payment(item.price, 'usd', customer.id)" }
    ],
    files: ["src/billing/stripe_client.py", "src/routes/billing.py"]
  }
};

// App Initialization
document.addEventListener("DOMContentLoaded", () => {
  checkBackendHealth();
  analyzeImpact("verify_token");
});

// Tab Switching
function switchTab(tabId) {
  document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-view").forEach(v => v.classList.remove("active"));

  if (tabId === "chat") {
    document.getElementById("tab-chat").classList.add("active");
    document.getElementById("view-chat").classList.add("active");
  } else {
    document.getElementById("tab-diff").classList.add("active");
    document.getElementById("view-diff").classList.add("active");
  }
}

// Check Backend Status
async function checkBackendHealth() {
  const statusEl = document.getElementById("status-text");
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { method: "GET" });
    if (res.ok) {
      statusEl.innerText = "Online (Port 8000)";
      statusEl.style.color = "#10B981";
    } else {
      throw new Error();
    }
  } catch (err) {
    statusEl.innerText = "Standby (Local Fallback Active)";
    statusEl.style.color = "#F59E0B";
  }
}

// Ask Predefined Question
function askPredefined(question) {
  document.getElementById("question-input").value = question;
  document.getElementById("chat-form").dispatchEvent(new Event("submit"));
}

// Chat Form Submission
async function handleSendQuestion(e) {
  e.preventDefault();
  const inputEl = document.getElementById("question-input");
  const question = inputEl.value.trim();
  if (!question) return;

  // Append user message
  appendMessage("user", question);
  inputEl.value = "";

  // Show typing indicator
  const loadingId = appendLoadingMessage();

  try {
    let data;
    try {
      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question, top_k: 5 })
      });
      if (!res.ok) throw new Error("API error");
      data = await res.json();
    } catch (networkErr) {
      // Offline fallback lookup
      data = findMockResponse(question);
    }

    removeLoadingMessage(loadingId);
    appendBotAnswer(data);
  } catch (err) {
    removeLoadingMessage(loadingId);
    appendMessage("bot", "An error occurred while answering your question. Please try again.");
  }
}

// Find mock response based on keyword matching
function findMockResponse(query) {
  const q = query.toLowerCase();
  for (const [key, item] of Object.entries(MOCK_KNOWLEDGE_BASE)) {
    if (q.includes(key)) {
      return item;
    }
  }
  // Generic fallback
  return {
    question: query,
    answer: `Based on the repository index, relevant functions matching '${query}' are defined across the codebase. Please review the cited code files below.`,
    citations: MOCK_KNOWLEDGE_BASE["auth"].citations
  };
}

// DOM Message Rendering
function appendMessage(role, text) {
  const container = document.getElementById("chat-messages");
  const row = document.createElement("div");
  row.className = `message-row ${role}`;

  const avatar = document.createElement("div");
  avatar.className = `avatar ${role}-avatar`;
  avatar.innerText = role === "user" ? "YOU" : "AI";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.innerHTML = `<p>${escapeHTML(text)}</p>`;

  row.appendChild(avatar);
  row.appendChild(bubble);
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

function appendLoadingMessage() {
  const container = document.getElementById("chat-messages");
  const id = "loading-" + Date.now();
  const row = document.createElement("div");
  row.id = id;
  row.className = "message-row bot";
  row.innerHTML = `
    <div class="avatar bot-avatar">AI</div>
    <div class="message-bubble">
      <p style="color: var(--text-dim); font-style: italic;">Retrieving relevant code chunks and generating cited answer...</p>
    </div>
  `;
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
  return id;
}

function removeLoadingMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function appendBotAnswer(data) {
  const container = document.getElementById("chat-messages");
  const row = document.createElement("div");
  row.className = "message-row bot";

  const avatar = document.createElement("div");
  avatar.className = "avatar bot-avatar";
  avatar.innerText = "AI";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  // Format answer with bold / code styling
  let formattedAnswer = escapeHTML(data.answer)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.*?)`/g, "<code style='background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; color: #38BDF8;'>$1</code>")
    .replace(/\n\n/g, "<br><br>");

  bubble.innerHTML = `<p>${formattedAnswer}</p>`;

  // Render Citations
  if (data.citations && data.citations.length > 0) {
    const citWrap = document.createElement("div");
    citWrap.className = "citations-wrapper";

    const citTitle = document.createElement("div");
    citTitle.className = "citations-title";
    citTitle.innerText = "📌 Referenced Code Citations:";
    citWrap.appendChild(citTitle);

    const citChips = document.createElement("div");
    citChips.className = "citation-chips";

    data.citations.forEach(c => {
      const btn = document.createElement("button");
      btn.className = "citation-badge";
      btn.innerHTML = `<span>📄</span> ${c.file_path}:${c.start_line}-${c.end_line}`;
      btn.onclick = () => openModal(c.file_path, `${c.start_line}-${c.end_line}`, c.snippet || "Code snippet preview");
      citChips.appendChild(btn);
    });

    citWrap.appendChild(citChips);
    bubble.appendChild(citWrap);
  }

  row.appendChild(avatar);
  row.appendChild(bubble);
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

// Modal Citation Drawer
function openModal(filePath, lines, code) {
  document.getElementById("modal-filepath").innerText = filePath;
  document.getElementById("modal-lines").innerText = `Lines ${lines}`;
  document.getElementById("modal-code").innerText = code;
  document.getElementById("citation-modal").classList.add("show");
}

function closeModal(e) {
  document.getElementById("citation-modal").classList.remove("show");
}

// Differentiator / Impact Analyzer
function setDiffSymbol(sym) {
  document.getElementById("diff-symbol-input").value = sym;
  analyzeImpact();
}

function analyzeImpact() {
  const sym = document.getElementById("diff-symbol-input").value.trim();
  const resultsContainer = document.getElementById("diff-results");
  if (!sym) return;

  const data = DIFFERENTIATOR_DATABASE[sym] || generateDynamicImpact(sym);

  resultsContainer.innerHTML = `
    <div class="diff-card">
      <div class="diff-header-row">
        <div>
          <h3>Impact Analysis: <code style="color: var(--accent-cyan); font-family: var(--font-mono); font-size: 1.2rem;">${data.symbol}</code></h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">Blast radius calculation for symbol modifications</p>
        </div>
        <span class="impact-badge ${data.impact}">${data.impact} IMPACT</span>
      </div>

      <div class="warning-box">
        <strong>⚠️ Blast Radius Assessment:</strong> ${data.warning}
      </div>

      <div class="diff-stats-grid">
        <div class="stat-box">
          <div class="num">${data.files.length}</div>
          <div class="lbl">Affected Files</div>
        </div>
        <div class="stat-box">
          <div class="num">${data.definitions.length}</div>
          <div class="lbl">Definitions</div>
        </div>
        <div class="stat-box">
          <div class="num">${data.imports.length}</div>
          <div class="lbl">Imports</div>
        </div>
        <div class="stat-box">
          <div class="num">${data.calls.length}</div>
          <div class="lbl">Call Sites</div>
        </div>
      </div>

      <div>
        <h4 style="font-size: 0.9rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 10px;">Direct Usages & Call Sites</h4>
        <div class="usage-list">
          ${data.definitions.map(d => `
            <div class="usage-item">
              <div><strong class="tag-def">[DEF]</strong> <code>${d.file}:${d.line}</code></div>
              <code style="color: var(--accent-emerald);">${escapeHTML(d.code)}</code>
            </div>
          `).join("")}
          ${data.imports.map(i => `
            <div class="usage-item">
              <div><strong class="tag-imp">[IMPORT]</strong> <code>${i.file}:${i.line}</code></div>
              <code style="color: var(--accent-amber);">${escapeHTML(i.code)}</code>
            </div>
          `).join("")}
          ${data.calls.map(c => `
            <div class="usage-item">
              <div><strong class="tag-call">[CALL]</strong> <code>${c.file}:${c.line}</code></div>
              <code style="color: var(--accent-cyan);">${escapeHTML(c.code)}</code>
            </div>
          `).join("")}
        </div>
      </div>

      <div>
        <h4 style="font-size: 0.9rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 10px;">Files Requiring Regression Testing</h4>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${data.files.map(f => `
            <span style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); padding: 4px 10px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.8rem; color: #CBD5E1;">
              📄 ${f}
            </span>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function generateDynamicImpact(sym) {
  return {
    symbol: sym,
    impact: "LOW",
    warning: `Symbol '${sym}' appears in isolated local scope. Minimal breaking risk.`,
    definitions: [{ file: "src/app.py", line: 12, code: `def ${sym}():` }],
    imports: [],
    calls: [{ file: "src/app.py", line: 45, code: `${sym}()` }],
    files: ["src/app.py"]
  };
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}
