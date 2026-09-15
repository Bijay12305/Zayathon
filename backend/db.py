"""
ZAYATHON 2026 - Database Schema & Data Access Layer
Organized by ZAYA CODE HUB
SQLite persistent data store with tables for Admins, Teams, Participants, Notes, Logs, and Checklist.
"""

import sqlite3
import os
import json
import hashlib
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "zayathon.db")

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. Admins Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 2. Teams Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS teams (
        id TEXT PRIMARY KEY,
        team_name TEXT NOT NULL,
        track TEXT NOT NULL,
        project_title TEXT,
        project_abstract TEXT,
        team_size INTEGER DEFAULT 3,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 3. Participants Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS participants (
        id TEXT PRIMARY KEY,
        team_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        college TEXT NOT NULL,
        department TEXT,
        degree TEXT DEFAULT 'B.E. / B.Tech',
        year_of_study TEXT DEFAULT '3rd Year',
        role TEXT DEFAULT 'Member',
        status TEXT DEFAULT 'Pending',
        verified_by TEXT,
        verified_at TEXT,
        rejection_reason TEXT,
        checklist_state TEXT DEFAULT '[false,false,false,false,false]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (team_id) REFERENCES teams(id)
    )
    """)

    # 4. Admin Notes Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS admin_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        participant_id TEXT NOT NULL,
        author TEXT NOT NULL,
        note_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (participant_id) REFERENCES participants(id)
    )
    """)

    # 5. Activity History / Audit Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        participant_id TEXT,
        action TEXT NOT NULL,
        admin_name TEXT NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 6. Student Login Sessions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_logins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT NOT NULL,
        team_id TEXT,
        identifier TEXT NOT NULL,
        track TEXT,
        college TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()

    # Seed Admin User if not exists
    cursor.execute("SELECT COUNT(*) as count FROM admins WHERE email = 'admin@zayacodehub.com'")
    if cursor.fetchone()["count"] == 0:
        cursor.execute(
            "INSERT INTO admins (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
            ("ADM-001", "ZAYA CODE HUB Admin", "admin@zayacodehub.com", hash_password("admin2026"), "Super Administrator")
        )
        conn.commit()

    # Seed initial benchmark participants if empty
    cursor.execute("SELECT COUNT(*) as count FROM participants")
    if cursor.fetchone()["count"] == 0:
        seed_benchmark_data(conn)

    conn.close()

def seed_benchmark_data(conn):
    cursor = conn.cursor()
    
    seeds = [
        {
            "team_id": "ZT-2026-01",
            "team_name": "CyberPulse",
            "track": "Artificial Intelligence & Agentic AI",
            "project_title": "Autonomous Multi-Agent Emergency Dispatcher",
            "project_abstract": "An autonomous swarm agent system that coordinates emergency medical response in rural districts using edge AI.",
            "team_size": 4,
            "members": [
                {
                    "id": "ZP-2026-0101",
                    "name": "Aarav Sharma",
                    "email": "aarav.sharma@sonatech.ac.in",
                    "phone": "+91 98451 23410",
                    "college": "Sona College of Technology, Salem",
                    "department": "Computer Science & Engineering",
                    "year": "3rd Year (6th Sem)",
                    "role": "Team Leader",
                    "status": "Verified",
                    "verified_by": "Super Admin (ZAYA CODE HUB)",
                    "verified_at": "2026-03-02 11:30 AM",
                    "checklist": [True, True, True, True, True]
                },
                {
                    "id": "ZP-2026-0102",
                    "name": "Kavya Ramesh",
                    "email": "kavya.ramesh@sonatech.ac.in",
                    "phone": "+91 98451 23411",
                    "college": "Sona College of Technology, Salem",
                    "department": "AI & Data Science",
                    "year": "3rd Year (6th Sem)",
                    "role": "Team Member",
                    "status": "Verified",
                    "verified_by": "Super Admin (ZAYA CODE HUB)",
                    "verified_at": "2026-03-02 11:32 AM",
                    "checklist": [True, True, True, True, True]
                }
            ]
        },
        {
            "team_id": "ZT-2026-02",
            "team_name": "ZeroKnowledge",
            "track": "Web3, Blockchain & DeFi Solutions",
            "project_title": "ZK-Rollup Academic Credential Registry",
            "project_abstract": "Tamper-proof on-chain verification for university degrees using zero-knowledge proofs and smart contracts.",
            "team_size": 3,
            "members": [
                {
                    "id": "ZP-2026-0201",
                    "name": "Priya Varma",
                    "email": "priya.varma@annauniv.edu",
                    "phone": "+91 97123 45678",
                    "college": "College of Engineering, Guindy (Anna University)",
                    "department": "Information Technology",
                    "year": "3rd Year (5th Sem)",
                    "role": "Team Leader",
                    "status": "Pending",
                    "verified_by": None,
                    "verified_at": None,
                    "checklist": [True, True, True, False, False]
                }
            ]
        },
        {
            "team_id": "ZT-2026-03",
            "team_name": "QuantumShield",
            "track": "Cybersecurity & Zero Trust Architecture",
            "project_title": "Real-Time Cloud Microsegmentation Sentinel",
            "project_abstract": "Zero-trust automated policy enforcement engine using eBPF kernel telemetry to prevent lateral movement in cloud-native workloads.",
            "team_size": 4,
            "members": [
                {
                    "id": "ZP-2026-0301",
                    "name": "Karthik Rajan",
                    "email": "karthik.r@psgtech.ac.in",
                    "phone": "+91 94432 10987",
                    "college": "PSG College of Technology, Coimbatore",
                    "department": "Electronics & Communication Engineering",
                    "year": "2nd Year (4th Sem)",
                    "role": "Team Leader",
                    "status": "Verified",
                    "verified_by": "Lead Validator (ZAYA CODE HUB)",
                    "verified_at": "2026-03-04 10:15 AM",
                    "checklist": [True, True, True, True, True]
                }
            ]
        },
        {
            "team_id": "ZT-2026-04",
            "team_name": "FinMatrix",
            "track": "FinTech & Algorithmic Trading Systems",
            "project_title": "Sub-Millisecond Arbitrage Engine for DEXs",
            "project_abstract": "Decentralized liquidity routing algorithm with predictive slippage dampening.",
            "team_size": 2,
            "members": [
                {
                    "id": "ZP-2026-0401",
                    "name": "Rohan Nair",
                    "email": "rohan.nair@vit.ac.in",
                    "phone": "+91 96541 23098",
                    "college": "Vellore Institute of Technology (VIT)",
                    "department": "Computer Science & Engineering",
                    "year": "4th Year (8th Sem)",
                    "role": "Team Leader",
                    "status": "Rejected",
                    "verified_by": "Compliance Team (ZAYA CODE HUB)",
                    "verified_at": "2026-03-05 03:20 PM",
                    "rejection_reason": "Ineligible Year of Study (4th Year / Final Year)",
                    "checklist": [True, True, True, True, False]
                }
            ]
        },
        {
            "team_id": "ZT-2026-05",
            "team_name": "MediBotics",
            "track": "Healthcare & MedTech AI Innovations",
            "project_title": "Edge AI Diabetic Retinopathy Scanner",
            "project_abstract": "Low-cost portable smartphone attachment for retinal screening powered by quantized vision models for rural clinics.",
            "team_size": 4,
            "members": [
                {
                    "id": "ZP-2026-0501",
                    "name": "Sneha Mukherjee",
                    "email": "sneha.m@nitt.edu",
                    "phone": "+91 98840 55123",
                    "college": "National Institute of Technology (NIT), Trichy",
                    "department": "Bio-Medical Engineering",
                    "year": "2nd Year (3rd Sem)",
                    "role": "Team Leader",
                    "status": "Pending",
                    "verified_by": None,
                    "verified_at": None,
                    "checklist": [True, True, True, False, False]
                }
            ]
        }
    ]

    for seed in seeds:
        cursor.execute(
            "INSERT INTO teams (id, team_name, track, project_title, project_abstract, team_size) VALUES (?, ?, ?, ?, ?, ?)",
            (seed["team_id"], seed["team_name"], seed["track"], seed["project_title"], seed["project_abstract"], seed["team_size"])
        )
        for m in seed["members"]:
            cursor.execute(
                """INSERT INTO participants 
                   (id, team_id, name, email, phone, college, department, year_of_study, role, status, verified_by, verified_at, rejection_reason, checklist_state) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    m["id"], seed["team_id"], m["name"], m["email"], m["phone"], m["college"], 
                    m.get("department", "CSE"), m["year"], m["role"], m["status"], 
                    m.get("verified_by"), m.get("verified_at"), m.get("rejection_reason"),
                    json.dumps(m.get("checklist", [False]*5))
                )
            )
            cursor.execute(
                "INSERT INTO activity_logs (participant_id, action, admin_name, details) VALUES (?, ?, ?, ?)",
                (m["id"], "Registration Submitted", "System", f"Team {seed['team_name']} registered.")
            )

    conn.commit()
