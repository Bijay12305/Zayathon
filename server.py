"""
ZAYATHON 2026 - Master Backend REST API & Web Server
Organized by ZAYA CODE HUB
Includes SQLite Persistence, Authentication, Participant Workflows, Audit History, Metrics, and Static Hosting.
"""

import http.server
import socketserver
import os
import sys
import json
import urllib.parse
import hashlib
import random
from datetime import datetime

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from backend.db import get_db, init_db, hash_password

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ACTIVE_SESSIONS = {}

class ZayathonAPIHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def _send_json(self, data, status_code=200):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def _parse_json_body(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            return {}
        raw_body = self.rfile.read(content_length).decode('utf-8')
        try:
            return json.loads(raw_body)
        except json.JSONDecodeError:
            return {}

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # 1. API: Metrics
        if path == "/api/admin/metrics":
            self._handle_get_metrics()
            return

        # 2. API: Activity Logs
        if path == "/api/admin/activity":
            self._handle_get_activity()
            return

        # 3. API: Participants List
        if path == "/api/admin/participants":
            self._handle_get_participants(query)
            return

        # 4. API: Single Participant Detail
        if path.startswith("/api/admin/participants/"):
            p_id = path.replace("/api/admin/participants/", "").strip()
            self._handle_get_single_participant(p_id)
            return

        # 5. API: Teams List
        if path == "/api/admin/teams":
            self._handle_get_teams()
            return

        # 6. API: Reports & Analytics
        if path == "/api/admin/reports/analytics":
            self._handle_get_analytics()
            return

        # 7. API: CSV Export
        if path == "/api/admin/export/csv":
            self._handle_export_csv()
            return

        # 8. API: Participant Lookup (Public)
        if path == "/api/participant/lookup":
            search_query = query.get('query', [''])[0]
            self._handle_participant_lookup(search_query)
            return

        # Static file fallback
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self._parse_json_body()

        # 1. Auth: Login
        if path == "/api/auth/login":
            self._handle_auth_login(body)
            return

        # 2. Auth: Logout
        if path == "/api/auth/logout":
            self._handle_auth_logout()
            return

        # 3. Public: Team Registration
        if path == "/api/register":
            self._handle_public_registration(body)
            return

        # 4. Admin: Verify Participant
        if path.startswith("/api/admin/participants/") and path.endswith("/verify"):
            p_id = path.split("/")[4]
            self._handle_verify_participant(p_id, body)
            return

        # 5. Admin: Reject Participant
        if path.startswith("/api/admin/participants/") and path.endswith("/reject"):
            p_id = path.split("/")[4]
            self._handle_reject_participant(p_id, body)
            return

        # 6. Admin: Update Checklist
        if path.startswith("/api/admin/participants/") and path.endswith("/checklist"):
            p_id = path.split("/")[4]
            self._handle_update_checklist(p_id, body)
            return

        # 7. Admin: Add Note
        if path.startswith("/api/admin/participants/") and path.endswith("/notes"):
            p_id = path.split("/")[4]
            self._handle_add_note(p_id, body)
            return

        self._send_json({"error": "Endpoint not found"}, 404)

    # --------------------------------------------------------------------------
    # Handlers
    # --------------------------------------------------------------------------
    def _handle_auth_login(self, body):
        email = body.get("email", "").strip()
        password = body.get("password", "")

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM admins WHERE email = ?", (email,))
        admin = cursor.fetchone()
        conn.close()

        if admin and admin["password_hash"] == hash_password(password):
            token = "zaya_sess_" + hashlib.md5(f"{email}{datetime.now()}".encode()).hexdigest()
            admin_data = {
                "id": admin["id"],
                "name": admin["name"],
                "email": admin["email"],
                "role": admin["role"]
            }
            ACTIVE_SESSIONS[token] = admin_data
            self._send_json({"success": True, "token": token, "admin": admin_data}, 200)
        else:
            self._send_json({"success": False, "message": "Invalid admin email or password credentials."}, 401)

    def _handle_auth_logout(self):
        auth_header = self.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            ACTIVE_SESSIONS.pop(token, None)
        self._send_json({"success": True}, 200)

    def _handle_public_registration(self, body):
        team_name = body.get("teamName", "").strip()
        college = body.get("college", "").strip()
        team_size = int(body.get("teamSize", 3))
        leader_name = body.get("leaderName", "").strip()
        leader_email = body.get("leaderEmail", "").strip()
        leader_phone = body.get("leaderPhone", "").strip()
        year_of_study = body.get("yearOfStudy", "3rd Year")
        track = body.get("track", "Artificial Intelligence & Agentic AI")
        project_title = body.get("projectTitle", "").strip()
        project_abstract = body.get("ideaSummary", "").strip()

        if not team_name or not leader_name or not leader_email:
            self._send_json({"error": "Missing required registration parameters"}, 400)
            return

        team_id = f"ZT-2026-{random.randint(1000, 9999)}"
        participant_id = f"ZP-2026-{random.randint(1000, 9999)}"

        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute(
            "INSERT INTO teams (id, team_name, track, project_title, project_abstract, team_size) VALUES (?, ?, ?, ?, ?, ?)",
            (team_id, team_name, track, project_title, project_abstract, team_size)
        )

        cursor.execute(
            """INSERT INTO participants 
               (id, team_id, name, email, phone, college, department, year_of_study, role, status, checklist_state) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                participant_id, team_id, leader_name, leader_email, leader_phone, 
                college, "Engineering & Technology", year_of_study, "Team Leader", "Pending",
                json.dumps([True, True, True, False, False])
            )
        )

        cursor.execute(
            "INSERT INTO activity_logs (participant_id, action, admin_name, details) VALUES (?, ?, ?, ?)",
            (participant_id, "Registration Submitted", "Public Portal", f"Team {team_name} registered for {track}.")
        )

        cursor.execute(
            "INSERT INTO student_logins (student_name, team_id, identifier, track, college, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (leader_name, team_id, leader_email, track, college, self.client_address[0], self.headers.get('User-Agent', ''))
        )

        conn.commit()
        conn.close()

        self._send_json({
            "success": True,
            "ticketId": team_id,
            "participantId": participant_id,
            "teamName": team_name,
            "leaderName": leader_name,
            "college": college,
            "track": track,
            "status": "Pending"
        }, 201)

    def _handle_participant_lookup(self, query):
        q = query.strip().lower()
        if not q:
            self._send_json({"error": "Query required"}, 400)
            return

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT p.*, t.team_name, t.track as team_track, t.project_title, t.team_size
            FROM participants p
            JOIN teams t ON p.team_id = t.id
            WHERE LOWER(p.id) = ? OR LOWER(p.email) = ? OR LOWER(t.id) = ? OR LOWER(t.team_name) = ?
            LIMIT 1
        """, (q, q, q, q))
        row = cursor.fetchone()

        if row:
            cursor.execute(
                "INSERT INTO student_logins (student_name, team_id, identifier, track, college, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (row["name"], row["team_id"], row["email"], row["team_track"], row["college"], self.client_address[0], self.headers.get('User-Agent', ''))
            )
            conn.commit()

            data = {
                "ticketId": row["team_id"],
                "participantId": row["id"],
                "teamName": row["team_name"],
                "leaderName": row["name"],
                "college": row["college"],
                "track": row["team_track"],
                "teamSize": row["team_size"],
                "status": row["status"]
            }
            conn.close()
            self._send_json({"success": True, "data": data}, 200)
        else:
            conn.close()
            self._send_json({"success": False, "message": "Registration ID or email not found."}, 404)

    def _handle_get_metrics(self):
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) as c FROM participants")
        total = cursor.fetchone()["c"]

        cursor.execute("SELECT COUNT(*) as c FROM participants WHERE status = 'Pending'")
        pending = cursor.fetchone()["c"]

        cursor.execute("SELECT COUNT(*) as c FROM participants WHERE status = 'Verified'")
        verified = cursor.fetchone()["c"]

        cursor.execute("SELECT COUNT(*) as c FROM participants WHERE status = 'Rejected'")
        rejected = cursor.fetchone()["c"]

        cursor.execute("SELECT COUNT(*) as c FROM teams")
        total_teams = cursor.fetchone()["c"]

        cursor.execute("SELECT COUNT(*) as c FROM student_logins")
        total_logins = cursor.fetchone()["c"]

        conn.close()
        self._send_json({
            "totalParticipants": total,
            "pendingVerification": pending,
            "verifiedParticipants": verified,
            "rejectedParticipants": rejected,
            "totalTeams": total_teams,
            "totalStudentLogins": total_logins
        }, 200)

    def _handle_get_activity(self):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT l.*, p.name as participant_name, p.team_id, t.team_name
            FROM activity_logs l
            LEFT JOIN participants p ON l.participant_id = p.id
            LEFT JOIN teams t ON p.team_id = t.id
            ORDER BY l.id DESC
            LIMIT 15
        """)
        rows = cursor.fetchall()
        conn.close()

        activities = [
            {
                "id": r["id"],
                "action": r["action"],
                "admin": r["admin_name"],
                "time": r["created_at"],
                "meta": r["details"],
                "participantName": r["participant_name"] or "System",
                "participantId": r["participant_id"],
                "teamName": r["team_name"] or "General"
            }
            for r in rows
        ]
        self._send_json(activities, 200)

    def _handle_get_participants(self, query):
        search = query.get('search', [''])[0].strip().lower()
        status = query.get('status', ['all'])[0]
        track = query.get('track', ['all'])[0]
        college = query.get('college', ['all'])[0]

        conn = get_db()
        cursor = conn.cursor()

        sql = """
            SELECT p.*, t.team_name, t.track, t.project_title
            FROM participants p
            JOIN teams t ON p.team_id = t.id
            WHERE 1=1
        """
        params = []

        if status != 'all':
            sql += " AND LOWER(p.status) = LOWER(?)"
            params.append(status)

        if track != 'all':
            sql += " AND t.track = ?"
            params.append(track)

        if college != 'all':
            sql += " AND p.college = ?"
            params.append(college)

        if search:
            sql += " AND (LOWER(p.name) LIKE ? OR LOWER(p.email) LIKE ? OR LOWER(p.id) LIKE ? OR LOWER(t.team_name) LIKE ?)"
            s_param = f"%{search}%"
            params.extend([s_param, s_param, s_param, s_param])

        sql += " ORDER BY p.id DESC"
        cursor.execute(sql, params)
        rows = cursor.fetchall()
        conn.close()

        participants = []
        for r in rows:
            participants.append({
                "id": r["id"],
                "name": r["name"],
                "email": r["email"],
                "phone": r["phone"],
                "college": r["college"],
                "department": r["department"],
                "degree": r["degree"],
                "year": r["year_of_study"],
                "teamId": r["team_id"],
                "teamName": r["team_name"],
                "role": r["role"],
                "track": r["track"],
                "projectTitle": r["project_title"],
                "regDate": r["created_at"],
                "status": r["status"],
                "verifiedBy": r["verified_by"],
                "verifiedAt": r["verified_at"],
                "rejectionReason": r["rejection_reason"]
            })

        self._send_json(participants, 200)

    def _handle_get_single_participant(self, p_id):
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT p.*, t.team_name, t.track, t.project_title, t.project_abstract, t.team_size
            FROM participants p
            JOIN teams t ON p.team_id = t.id
            WHERE p.id = ?
        """, (p_id,))
        p = cursor.fetchone()

        if not p:
            conn.close()
            self._send_json({"error": "Participant not found"}, 404)
            return

        cursor.execute("SELECT * FROM admin_notes WHERE participant_id = ? ORDER BY id DESC", (p_id,))
        notes = [{"author": n["author"], "time": n["created_at"], "text": n["note_text"]} for n in cursor.fetchall()]

        cursor.execute("SELECT * FROM activity_logs WHERE participant_id = ? ORDER BY id DESC", (p_id,))
        history = [{"action": h["action"], "admin": h["admin_name"], "time": h["created_at"], "meta": h["details"]} for h in cursor.fetchall()]

        conn.close()

        res = {
            "id": p["id"],
            "name": p["name"],
            "email": p["email"],
            "phone": p["phone"],
            "college": p["college"],
            "department": p["department"],
            "degree": p["degree"],
            "year": p["year_of_study"],
            "teamId": p["team_id"],
            "teamName": p["team_name"],
            "role": p["role"],
            "track": p["track"],
            "projectTitle": p["project_title"],
            "projectAbstract": p["project_abstract"],
            "teamSize": p["team_size"],
            "regDate": p["created_at"],
            "status": p["status"],
            "verifiedBy": p["verified_by"],
            "verifiedAt": p["verified_at"],
            "rejectionReason": p["rejection_reason"],
            "checklist": json.loads(p["checklist_state"] or "[false,false,false,false,false]"),
            "documents": [
                {"name": f"{p['name'].replace(' ', '_')}_College_ID.pdf", "type": "College ID Card", "size": "1.4 MB"}
            ],
            "notes": notes,
            "history": history
        }

        self._send_json(res, 200)

    def _handle_verify_participant(self, p_id, body):
        admin_name = body.get("adminName", "Super Admin (ZAYA CODE HUB)")
        timestamp = datetime.now().strftime("%Y-%m-%d %I:%M %p")

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE participants 
            SET status = 'Verified', verified_by = ?, verified_at = ?, checklist_state = '[true,true,true,true,true]'
            WHERE id = ?
        """, (admin_name, timestamp, p_id))

        cursor.execute(
            "INSERT INTO activity_logs (participant_id, action, admin_name, details) VALUES (?, ?, ?, ?)",
            (p_id, "Participant Verified", admin_name, "Verified participant details and issued admit pass.")
        )

        conn.commit()
        conn.close()

        self._send_json({"success": True, "status": "Verified", "verifiedAt": timestamp}, 200)

    def _handle_reject_participant(self, p_id, body):
        reason = body.get("reason", "Ineligible Criteria")
        note = body.get("note", "")
        admin_name = body.get("adminName", "Super Admin (ZAYA CODE HUB)")
        timestamp = datetime.now().strftime("%Y-%m-%d %I:%M %p")

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE participants 
            SET status = 'Rejected', rejection_reason = ?, verified_by = ?, verified_at = ?
            WHERE id = ?
        """, (reason, admin_name, timestamp, p_id))

        cursor.execute(
            "INSERT INTO activity_logs (participant_id, action, admin_name, details) VALUES (?, ?, ?, ?)",
            (p_id, "Participant Rejected", admin_name, f"Reason: {reason}. Note: {note}")
        )

        if note:
            cursor.execute(
                "INSERT INTO admin_notes (participant_id, author, note_text) VALUES (?, ?, ?)",
                (p_id, admin_name, f"Rejection Note: {note}")
            )

        conn.commit()
        conn.close()

        self._send_json({"success": True, "status": "Rejected"}, 200)

    def _handle_update_checklist(self, p_id, body):
        checklist = body.get("checklist", [False]*5)
        admin_name = body.get("adminName", "Admin")

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("UPDATE participants SET checklist_state = ? WHERE id = ?", (json.dumps(checklist), p_id))
        completed = sum(1 for c in checklist if c)

        cursor.execute(
            "INSERT INTO activity_logs (participant_id, action, admin_name, details) VALUES (?, ?, ?, ?)",
            (p_id, "Checklist Updated", admin_name, f"Verification checklist updated: {completed}/5 completed.")
        )

        conn.commit()
        conn.close()

        self._send_json({"success": True, "checklist": checklist}, 200)

    def _handle_add_note(self, p_id, body):
        text = body.get("text", "").strip()
        admin_name = body.get("adminName", "Admin")
        if not text:
            self._send_json({"error": "Note text is required"}, 400)
            return

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("INSERT INTO admin_notes (participant_id, author, note_text) VALUES (?, ?, ?)", (p_id, admin_name, text))
        cursor.execute(
            "INSERT INTO activity_logs (participant_id, action, admin_name, details) VALUES (?, ?, ?, ?)",
            (p_id, "Admin Note Added", admin_name, f'Note: "{text[:40]}"')
        )

        conn.commit()
        conn.close()

        self._send_json({"success": True}, 201)

    def _handle_get_teams(self):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM teams ORDER BY id DESC")
        teams = cursor.fetchall()

        result = []
        for t in teams:
            cursor.execute("SELECT * FROM participants WHERE team_id = ?", (t["id"],))
            members = [dict(m) for m in cursor.fetchall()]
            leader = next((m["name"] for m in members if m["role"] == "Team Leader"), "N/A")
            result.append({
                "teamId": t["id"],
                "teamName": t["team_name"],
                "track": t["track"],
                "projectTitle": t["project_title"],
                "leader": leader,
                "members": members
            })

        conn.close()
        self._send_json(result, 200)

    def _handle_get_analytics(self):
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("SELECT t.track, COUNT(p.id) as count FROM teams t JOIN participants p ON t.id = p.team_id GROUP BY t.track")
        tracks = {r["track"]: r["count"] for r in cursor.fetchall()}

        cursor.execute("SELECT college, COUNT(id) as count FROM participants GROUP BY college")
        colleges = {r["college"]: r["count"] for r in cursor.fetchall()}

        conn.close()
        self._send_json({
            "participantsByTrack": tracks,
            "participantsByCollege": colleges
        }, 200)

    def _handle_export_csv(self):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT p.*, t.team_name, t.track, t.project_title
            FROM participants p
            JOIN teams t ON p.team_id = t.id
            ORDER BY p.id DESC
        """)
        rows = cursor.fetchall()
        conn.close()

        headers = ["Participant ID", "Full Name", "Email", "Phone", "College", "Department", "Year of Study", "Team ID", "Team Name", "Role", "Track", "Project Title", "Registration Date", "Status", "Verified By", "Rejection Reason"]
        csv_lines = [",".join([f'"{h}"' for h in headers])]

        for r in rows:
            line = [
                f'"{r["id"]}"',
                f'"{r["name"]}"',
                f'"{r["email"]}"',
                f'"{r["phone"]}"',
                f'"{r["college"]}"',
                f'"{r["department"] or ""}"',
                f'"{r["year_of_study"]}"',
                f'"{r["team_id"]}"',
                f'"{r["team_name"]}"',
                f'"{r["role"]}"',
                f'"{r["track"]}"',
                f'"{r["project_title"] or ""}"',
                f'"{r["created_at"]}"',
                f'"{r["status"]}"',
                f'"{r["verified_by"] or ""}"',
                f'"{r["rejection_reason"] or ""}"'
            ]
            csv_lines.append(",".join(line))

        csv_data = "\n".join(csv_lines).encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "text/csv; charset=utf-8")
        self.send_header("Content-Disposition", f'attachment; filename="ZAYATHON_2026_Participants_{datetime.now().strftime("%Y%m%d")}.csv"')
        self.send_header("Content-Length", str(len(csv_data)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(csv_data)

def run_server():
    init_db()
    socketserver.TCPServer.allow_reuse_address = True
    print("==========================================================================")
    print("ZAYATHON 2026 - Master Backend REST API & Web Server")
    print("Organized by ZAYA CODE HUB")
    print("==========================================================================")
    print(f"Server running at: http://localhost:{PORT}/")
    print(f"Public Portal:     http://localhost:{PORT}/")
    print(f"Admin Suite:       http://localhost:{PORT}/admin/login.html")
    print(f"REST API Base:     http://localhost:{PORT}/api/admin/metrics")
    print("==========================================================================")
    
    with socketserver.TCPServer(("", PORT), ZayathonAPIHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == "__main__":
    run_server()
