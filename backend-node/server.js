/**
 * ZAYATHON 2026 - Node.js Express REST API Server
 * Organized by ZAYA CODE HUB
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'zayathon_super_secret_jwt_key_2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// SQLite Database Setup
const dbPath = path.join(__dirname, '..', 'zayathon.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite persistent database.');
  }
});

// Helper for Password Hash
function hashPassword(pass) {
  return crypto.createHash('sha256').update(pass).digest('hex');
}

// Auth Middleware
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

// --------------------------------------------------------------------------
// 1. Authentication Endpoints
// --------------------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const passHash = hashPassword(password);
  db.get('SELECT * FROM admins WHERE email = ?', [email], (err, admin) => {
    if (err || !admin || admin.password_hash !== passHash) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
    });
  });
});

// --------------------------------------------------------------------------
// 2. Public Registration & Lookup
// --------------------------------------------------------------------------
app.post('/api/register', (req, res) => {
  const { teamName, college, teamSize, leaderName, leaderEmail, leaderPhone, yearOfStudy, track, projectTitle, ideaSummary } = req.body;

  if (!teamName || !leaderName || !leaderEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const teamId = `ZT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const participantId = `ZP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  db.serialize(() => {
    db.run(
      'INSERT INTO teams (id, team_name, track, project_title, project_abstract, team_size) VALUES (?, ?, ?, ?, ?, ?)',
      [teamId, teamName, track, projectTitle || '', ideaSummary || '', parseInt(teamSize) || 3]
    );

    db.run(
      `INSERT INTO participants 
       (id, team_id, name, email, phone, college, department, year_of_study, role, status, checklist_state) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        participantId, teamId, leaderName, leaderEmail, leaderPhone,
        college, 'Engineering', yearOfStudy || '3rd Year', 'Team Leader', 'Pending',
        JSON.stringify([true, true, true, false, false])
      ]
    );

    db.run(
      'INSERT INTO activity_logs (participant_id, action, admin_name, details) VALUES (?, ?, ?, ?)',
      [participantId, 'Registration Submitted', 'Public Portal', `Team ${teamName} registered for ${track}.`]
    );

    res.status(201).json({
      success: true,
      ticketId: teamId,
      participantId,
      teamName,
      leaderName,
      college,
      track,
      status: 'Pending'
    });
  });
});

app.get('/api/participant/lookup', (req, res) => {
  const q = (req.query.query || '').trim().toLowerCase();
  if (!q) return res.status(400).json({ error: 'Query required' });

  db.get(
    `SELECT p.*, t.team_name, t.track as team_track, t.project_title, t.team_size
     FROM participants p
     JOIN teams t ON p.team_id = t.id
     WHERE LOWER(p.id) = ? OR LOWER(p.email) = ? OR LOWER(t.id) = ? OR LOWER(t.team_name) = ?
     LIMIT 1`,
    [q, q, q, q],
    (err, row) => {
      if (err || !row) {
        return res.status(404).json({ success: false, message: 'Participant or team not found' });
      }

      res.json({
        success: true,
        data: {
          ticketId: row.team_id,
          participantId: row.id,
          teamName: row.team_name,
          leaderName: row.name,
          college: row.college,
          track: row.team_track,
          teamSize: row.team_size,
          status: row.status
        }
      });
    }
  );
});

// --------------------------------------------------------------------------
// 3. Admin Metrics & Activity
// --------------------------------------------------------------------------
app.get('/api/admin/metrics', (req, res) => {
  db.all('SELECT status, COUNT(*) as count FROM participants GROUP BY status', (err, statusRows) => {
    let pending = 0, verified = 0, rejected = 0;
    statusRows.forEach(r => {
      if (r.status === 'Pending') pending = r.count;
      if (r.status === 'Verified') verified = r.count;
      if (r.status === 'Rejected') rejected = r.count;
    });

    db.get('SELECT COUNT(*) as teamsCount FROM teams', (err2, teamRow) => {
      db.get('SELECT COUNT(*) as loginsCount FROM student_logins', (err3, loginRow) => {
        res.json({
          totalParticipants: pending + verified + rejected,
          pendingVerification: pending,
          verifiedParticipants: verified,
          rejectedParticipants: rejected,
          totalTeams: teamRow ? teamRow.teamsCount : 0,
          totalStudentLogins: loginRow ? loginRow.loginsCount : 0
        });
      });
    });
  });
});

app.get('/api/admin/activity', (req, res) => {
  db.all(
    `SELECT l.*, p.name as participant_name, p.team_id, t.team_name
     FROM activity_logs l
     LEFT JOIN participants p ON l.participant_id = p.id
     LEFT JOIN teams t ON p.team_id = t.id
     ORDER BY l.id DESC
     LIMIT 15`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// --------------------------------------------------------------------------
// 4. Participants CRUD & Actions
// --------------------------------------------------------------------------
app.get('/api/admin/participants', (req, res) => {
  const { search, status, track, college } = req.query;

  let sql = `
    SELECT p.*, t.team_name, t.track, t.project_title
    FROM participants p
    JOIN teams t ON p.team_id = t.id
    WHERE 1=1
  `;
  const params = [];

  if (status && status !== 'all') {
    sql += ' AND LOWER(p.status) = LOWER(?)';
    params.push(status);
  }
  if (track && track !== 'all') {
    sql += ' AND t.track = ?';
    params.push(track);
  }
  if (college && college !== 'all') {
    sql += ' AND p.college = ?';
    params.push(college);
  }
  if (search) {
    sql += ' AND (LOWER(p.name) LIKE ? OR LOWER(p.email) LIKE ? OR LOWER(p.id) LIKE ? OR LOWER(t.team_name) LIKE ?)';
    const s = `%${search.toLowerCase()}%`;
    params.push(s, s, s, s);
  }

  sql += ' ORDER BY p.id DESC';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/admin/participants/:id/verify', (req, res) => {
  const pId = req.params.id;
  const adminName = req.body.adminName || 'Super Admin (ZAYA CODE HUB)';
  const timestamp = new Date().toLocaleString();

  db.serialize(() => {
    db.run(
      "UPDATE participants SET status = 'Verified', verified_by = ?, verified_at = ?, checklist_state = '[true,true,true,true,true]' WHERE id = ?",
      [adminName, timestamp, pId]
    );

    db.run(
      'INSERT INTO activity_logs (participant_id, action, admin_name, details) VALUES (?, ?, ?, ?)',
      [pId, 'Participant Verified', adminName, 'Verified applicant and issued official admit pass.']
    );

    res.json({ success: true, status: 'Verified', verifiedAt: timestamp });
  });
});

app.post('/api/admin/participants/:id/reject', (req, res) => {
  const pId = req.params.id;
  const { reason, note, adminName } = req.body;
  const timestamp = new Date().toLocaleString();
  const author = adminName || 'Super Admin';

  db.serialize(() => {
    db.run(
      "UPDATE participants SET status = 'Rejected', rejection_reason = ?, verified_by = ?, verified_at = ? WHERE id = ?",
      [reason || 'Ineligible Criteria', author, timestamp, pId]
    );

    db.run(
      'INSERT INTO activity_logs (participant_id, action, admin_name, details) VALUES (?, ?, ?, ?)',
      [pId, 'Participant Rejected', author, `Reason: ${reason}. Note: ${note}`]
    );

    if (note) {
      db.run(
        'INSERT INTO admin_notes (participant_id, author, note_text) VALUES (?, ?, ?)',
        [pId, author, `Rejection Note: ${note}`]
      );
    }

    res.json({ success: true, status: 'Rejected' });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 ZAYATHON Node.js Express API running on port ${PORT}`);
});
