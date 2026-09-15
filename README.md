# ZAYATHON 2026 - Master Backend & Full-Stack System
**Organized by ZAYA CODE HUB at Sona College of Technology, Salem**

---

## 🚀 Architecture Overview

This project includes a complete, production-ready backend system supporting:
1. **Public Hackathon Portal**: Team registration (2–4 members, 10 tracks), eligibility validation, digital admit pass generation, and participant lookup.
2. **Enterprise Admin Verification Suite**: Role-based authentication, 5-point verification checklist, approval/rejection workflows with audit logs, internal organizer notes, and Excel CSV export.
3. **Database Layer**: Persistent SQLite database (`zayathon.db`) with normalized schema for Admins, Teams, Participants, Notes, Logs, and Student Login sessions.

---

## 🛠️ How to Run the Backend

### Option 1: Python REST API Server (Zero External Dependencies)
Runs natively using Python 3 standard libraries and embedded SQLite.

```bash
python server.py
```
- **Public Portal**: [http://localhost:8080/](http://localhost:8080/)
- **Admin Login**: [http://localhost:8080/admin/login.html](http://localhost:8080/admin/login.html)
- **Admin Dashboard**: [http://localhost:8080/admin/dashboard.html](http://localhost:8080/admin/dashboard.html)
- **REST API Base**: [http://localhost:8080/api/admin/metrics](http://localhost:8080/api/admin/metrics)

---

### Option 2: Node.js + Express REST API Server
Located in `backend-node/`.

```bash
cd backend-node
npm install
npm start
```
- **API Server**: [http://localhost:5000/](http://localhost:5000/)

---

## 🔑 Default Administrator Credentials
- **Admin Email**: `admin@zayacodehub.com`
- **Password**: `admin2026`
- *(Auto-Fill button available on `/admin/login.html`)*

---

## 📡 Complete REST API Endpoints Specification

### 1. Authentication
- `POST /api/auth/login`
  - **Body**: `{"email": "admin@zayacodehub.com", "password": "admin2026"}`
  - **Response**: `{"success": true, "token": "...", "admin": {...}}`
- `POST /api/auth/logout`

### 2. Public Registration & Lookup
- `POST /api/register`
  - **Body**: `{"teamName": "...", "college": "...", "teamSize": 3, "leaderName": "...", "leaderEmail": "...", "leaderPhone": "...", "track": "...", "projectTitle": "...", "ideaSummary": "..."}`
  - **Response**: `{"success": true, "ticketId": "ZT-2026-XXXX", "participantId": "ZP-2026-XXXX", ...}`
- `GET /api/participant/lookup?query=ZP-2026-0101`
  - Retrieves participant admit pass and records student login session.

### 3. Admin Verification & Management (Protected)
- `GET /api/admin/metrics` — Aggregate participant, team, and verification status counts.
- `GET /api/admin/activity` — Chronological audit trail feed.
- `GET /api/admin/participants` — Filterable participant roster (`?search=&status=&track=&college=`).
- `GET /api/admin/participants/:id` — Full participant profile, documents, checklist, notes, and history.
- `POST /api/admin/participants/:id/verify` — Marks participant as `Verified` and completes checklist.
- `POST /api/admin/participants/:id/reject` — Rejects with formal reason and admin note.
- `POST /api/admin/participants/:id/checklist` — Updates 5-point verification checklist.
- `POST /api/admin/participants/:id/notes` — Appends internal organizer note.

### 4. Teams & Reports
- `GET /api/admin/teams` — All teams with member rosters.
- `GET /api/admin/reports/analytics` — Track and college demographic distributions.
- `GET /api/admin/export/csv` — Streams complete Excel CSV download.

---

## 🗄️ Database Schema (`zayathon.db`)
- `admins`: `id`, `name`, `email`, `password_hash`, `role`, `created_at`
- `teams`: `id`, `team_name`, `track`, `project_title`, `project_abstract`, `team_size`, `created_at`
- `participants`: `id`, `team_id`, `name`, `email`, `phone`, `college`, `department`, `degree`, `year_of_study`, `role`, `status`, `verified_by`, `verified_at`, `rejection_reason`, `checklist_state`, `created_at`
- `admin_notes`: `id`, `participant_id`, `author`, `note_text`, `created_at`
- `activity_logs`: `id`, `participant_id`, `action`, `admin_name`, `details`, `created_at`
- `student_logins`: `id`, `student_name`, `team_id`, `identifier`, `track`, `college`, `ip_address`, `user_agent`, `created_at`
