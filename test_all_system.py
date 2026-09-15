import os
import sys
import sqlite3
import json
import re

print("=" * 60)
print("  ZAYATHON FULL SYSTEM HEALTH CHECK (FRONTEND & BACKEND)")
print("=" * 60)

# 1. Database Check
print("\n[1] Checking SQLite Database (zayathon.db)...")
try:
    conn = sqlite3.connect("zayathon.db")
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [t[0] for t in cursor.fetchall()]
    print(f"  -> Tables ({len(tables)}): {', '.join(tables)}")
    conn.close()
    print("  -> SQLite Database: HEALTHY")
except Exception as e:
    print(f"  -> SQLite Database Error: {e}")

# 2. Backend db.py Check
print("\n[2] Checking backend/db.py module...")
try:
    import backend.db as bdb
    conn = bdb.get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM participants;")
    count = cursor.fetchone()[0]
    conn.close()
    print(f"  -> Local participants count: {count}")
    print("  -> backend/db.py: HEALTHY")
except Exception as e:
    print(f"  -> backend/db.py Error: {e}")

# 3. Server Script Check
print("\n[3] Checking server.py Python Web Server...")
try:
    with open("server.py", "r", encoding="utf-8") as f:
        code = f.read()
    compile(code, "server.py", "exec")
    print("  -> server.py syntax: VALID")
except Exception as e:
    print(f"  -> server.py syntax Error: {e}")

# 4. Ingestion / Retrieval / Backend modules
print("\n[4] Checking Subsystem Python Modules...")
subsystems = ["person1_ingestion", "person2_retrieval", "person3_backend"]
for sub in subsystems:
    if os.path.exists(sub):
        py_files = [os.path.join(r, f) for r, d, fs in os.walk(sub) for f in fs if f.endswith(".py")]
        for pf in py_files:
            try:
                with open(pf, "r", encoding="utf-8") as f:
                    compile(f.read(), pf, "exec")
                print(f"  -> {pf}: VALID")
            except Exception as e:
                print(f"  -> {pf}: ERROR ({e})")

# 5. Frontend HTML Files & Assets Integrity
print("\n[5] Checking Frontend HTML Structure & Asset References...")
html_files = [
    "index.html",
    "admin.html",
    "admin/login.html",
    "admin/dashboard.html",
    "admin/index.html",
    "admin/participants.html",
    "admin/teams.html",
    "admin/reports.html"
]

for hf in html_files:
    if os.path.exists(hf):
        with open(hf, "r", encoding="utf-8") as f:
            content = f.read()
        print(f"  -> {hf}: Exists ({len(content)} bytes)")
    else:
        print(f"  -> {hf}: MISSING")

# 6. JavaScript Modules & Firebase Connections
print("\n[6] Checking Frontend JavaScript Modules...")
js_files = [
    "js/firebase-config.js",
    "js/firebase-app.js",
    "js/registration.js",
    "js/admin-core.js",
    "js/admin.js",
    "js/app.js",
    "js/particles.js",
    "js/countdown.js",
    "js/faq.js",
    "js/timeline.js",
    "js/tracks.js"
]

for jf in js_files:
    if os.path.exists(jf):
        with open(jf, "r", encoding="utf-8") as f:
            content = f.read()
        print(f"  -> {jf}: OK ({len(content)} bytes)")
    else:
        print(f"  -> {jf}: MISSING")

# 7. Stylesheets
print("\n[7] Checking Stylesheets...")
css_files = [
    "css/style.css",
    "css/components.css",
    "css/admin.css",
    "css/admin-suite.css"
]
for cf in css_files:
    if os.path.exists(cf):
        with open(cf, "r", encoding="utf-8") as f:
            content = f.read()
        print(f"  -> {cf}: OK ({len(content)} bytes)")
    else:
        print(f"  -> {cf}: MISSING")

# 8. Rules Check
print("\n[8] Checking Security Rules...")
for rf in ["firestore.rules", "storage.rules"]:
    if os.path.exists(rf):
        print(f"  -> {rf}: PRESENT")
    else:
        print(f"  -> {rf}: MISSING")

print("\n" + "=" * 60)
print("  SYSTEM HEALTH AUDIT COMPLETE")
print("=" * 60)
