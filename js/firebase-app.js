/**
 * ZAYATHON 2026 - Master Firebase Integration Client
 * Handles Firebase App, Auth, Firestore Collections, and Storage
 */

import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';

import { firebaseConfig, isFirebaseConfigured, getMissingConfigKeys } from './firebase-config.js';

// Global Instances
let app = null;
let auth = null;
let db = null;
let storage = null;
let initError = null;

// Initialize Firebase App & Services
try {
  if (isFirebaseConfigured()) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Set persistence to Local
    setPersistence(auth, browserLocalPersistence).catch(err => {
      console.warn('Firebase auth persistence warning:', err);
    });

    console.log('🔥 [Firebase] Successfully initialized Zayathon Firebase Services.');
  } else {
    console.warn(
      '⚠️ [Firebase] Configuration is incomplete. Missing keys:',
      getMissingConfigKeys()
    );
  }
} catch (err) {
  initError = err;
  console.error('❌ [Firebase] Initialization failed:', err);
}

export { app, auth, db, storage, initError };

// -----------------------------------------------------------------------------
// 1. Participant Registration (Cloud Firestore + Storage)
// -----------------------------------------------------------------------------
/**
 * Register a participant / team into Firestore
 * Creates document in 'participants', 'teams', and records in 'verification_history'
 */
export async function registerParticipant(formData) {
  const isLive = isFirebaseConfigured() && db;

  const nowIso = new Date().toISOString();
  const participantId = formData.participantId || ('ZP-2026-' + Math.floor(1000 + Math.random() * 9000));
  const teamId = formData.teamId || formData.ticketId || ('ZT-2026-' + Math.floor(100 + Math.random() * 900));

  // 1. Standard Participant Document Structure required
  const participantDocData = {
    participantId: participantId,
    fullName: formData.leaderName || formData.fullName || 'Participant',
    email: (formData.leaderEmail || formData.email || '').toLowerCase().trim(),
    phone: formData.leaderPhone || formData.phone || '',
    college: formData.college || 'Engineering College',
    course: formData.course || formData.degree || 'B.E. / B.Tech',
    department: formData.department || 'Engineering & Technology',
    year: formData.yearOfStudy || formData.year || '2nd Year',
    team: formData.teamName || 'Team',
    track: formData.track || 'Artificial Intelligence & Agentic AI',
    status: 'pending', // Default registration status: pending
    rejectionReason: '',
    verifiedBy: '',
    verifiedAt: '',
    projectTitle: formData.projectTitle || '',
    projectAbstract: formData.ideaSummary || formData.projectAbstract || '',
    teamSize: formData.teamSize || 4,
    role: formData.role || 'Team Leader',
    documents: formData.documents || [
      { name: 'Student_College_ID.pdf', type: 'College ID Card', size: '1.2 MB' }
    ],
    checklist: [true, true, true, false, false],
    createdAt: nowIso,
    updatedAt: nowIso
  };

  // 2. Team Document Structure
  const teamDocData = {
    teamId: teamId,
    teamName: formData.teamName || 'Team',
    leader: participantDocData.fullName,
    leaderEmail: participantDocData.email,
    leaderPhone: participantDocData.phone,
    college: participantDocData.college,
    track: participantDocData.track,
    teamSize: participantDocData.teamSize,
    projectTitle: participantDocData.projectTitle,
    projectAbstract: participantDocData.projectAbstract,
    members: formData.members || [
      { name: participantDocData.fullName, role: 'Team Leader', email: participantDocData.email }
    ],
    status: 'pending',
    createdAt: nowIso,
    updatedAt: nowIso
  };

  // 3. Verification History Entry
  const historyData = {
    participantId: participantId,
    teamId: teamId,
    action: 'Registration Submitted',
    adminId: 'SYSTEM',
    adminName: 'Registration Gateway',
    adminEmail: 'system@zayathon.in',
    time: new Date().toLocaleString(),
    timestamp: nowIso,
    meta: `Team "${formData.teamName}" registered for track: ${participantDocData.track}.`
  };

  if (isLive) {
    try {
      // Write participant doc (using participantId as document key)
      const participantRef = doc(db, 'participants', participantId);
      await setDoc(participantRef, {
        ...participantDocData,
        serverCreatedAt: serverTimestamp(),
        serverUpdatedAt: serverTimestamp()
      });

      // Write team doc
      const teamRef = doc(db, 'teams', teamId);
      await setDoc(teamRef, {
        ...teamDocData,
        serverCreatedAt: serverTimestamp(),
        serverUpdatedAt: serverTimestamp()
      });

      // Write verification_history record
      const historyCol = collection(db, 'verification_history');
      await addDoc(historyCol, {
        ...historyData,
        serverTimestamp: serverTimestamp()
      });

      console.log('✅ [Firestore] Registered participant and team successfully:', participantId, teamId);
    } catch (err) {
      console.error('❌ [Firestore] Error saving participant to Firestore:', err);
      throw err;
    }
  }

  // Also maintain localStorage cache for instant UI rendering and offline fallback
  try {
    const adminList = JSON.parse(localStorage.getItem('zayathon_admin_participants') || '[]');
    adminList.unshift({
      id: participantId,
      name: participantDocData.fullName,
      email: participantDocData.email,
      phone: participantDocData.phone,
      college: participantDocData.college,
      department: participantDocData.department,
      degree: participantDocData.course,
      year: participantDocData.year,
      teamId: teamId,
      teamName: participantDocData.team,
      role: participantDocData.role,
      track: participantDocData.track,
      projectTitle: participantDocData.projectTitle,
      projectAbstract: participantDocData.projectAbstract,
      regDate: new Date().toLocaleString(),
      status: 'Pending',
      verifiedBy: '',
      verifiedAt: '',
      rejectionReason: '',
      documents: participantDocData.documents,
      checklist: participantDocData.checklist,
      notes: [],
      history: [historyData]
    });
    localStorage.setItem('zayathon_admin_participants', JSON.stringify(adminList));

    const pubList = JSON.parse(localStorage.getItem('zayathon_registrations') || '[]');
    pubList.unshift({
      ticketId: teamId,
      teamName: formData.teamName,
      leaderName: participantDocData.fullName,
      leaderEmail: participantDocData.email,
      college: participantDocData.college,
      track: participantDocData.track,
      teamSize: participantDocData.teamSize,
      status: 'pending',
      registeredAt: nowIso
    });
    localStorage.setItem('zayathon_registrations', JSON.stringify(pubList));
  } catch (e) {}

  return {
    success: true,
    participantId,
    teamId,
    participant: participantDocData,
    team: teamDocData
  };
}

// -----------------------------------------------------------------------------
// 2. Admin Authentication & UID Verification in 'admins' Collection
// -----------------------------------------------------------------------------

/**
 * Sign in admin user using Firebase Authentication and verify UID in 'admins' collection
 * Flow:
 * Firebase Authentication -> Admin email/password -> Firebase UID -> admins/{UID} -> role: "super_admin" -> /admin/dashboard
 */
export async function loginAdminWithFirebase(email, password) {
  if (!isFirebaseConfigured() || !auth || !db) {
    console.warn('⚠️ [Firebase] Running in demo mode for admin auth.');
    if (
      (email === 'bijay08@gmail.com' || email === 'admin@zayacodehub.com' || email === 'admin' || email === 'organizer@zayathon.in') &&
      (password === 'Bijay@08' || password === 'admin2026' || password === 'zaya2026' || password === 'admin')
    ) {
      const demoUser = {
        uid: 'LhqQVJyCuog3jFbCjvdWYKKhttz1',
        email: email === 'admin' ? 'bijay08@gmail.com' : email,
        name: 'Bijay (Lead Organizer)',
        role: 'super_admin'
      };
      sessionStorage.setItem('zayathon_admin_session', 'active');
      sessionStorage.setItem('zayathon_admin_user', JSON.stringify(demoUser));
      return { success: true, user: demoUser, isDemo: true };
    }
    return { success: false, message: 'Invalid credentials. Please use your registered email and password.' };
  }

  try {
    // 1. Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Query admins/{UID} document
    const adminRef = doc(db, 'admins', user.uid);
    let adminDoc = null;
    try {
      adminDoc = await getDoc(adminRef);
    } catch (docErr) {
      console.warn('⚠️ [Firebase] Could not fetch admins doc:', docErr);
    }

    const isPrimaryAdmin = (
      user.uid === 'LhqQVJyCuog3jFbCjvdWYKKhttz1' ||
      user.email === 'bijay08@gmail.com' ||
      user.email === 'admin@zayacodehub.com' ||
      user.email === 'organizer@zayathon.in'
    );

    if (!adminDoc || !adminDoc.exists()) {
      if (isPrimaryAdmin) {
        // Auto-provision admin document in Firestore
        try {
          await setDoc(adminRef, {
            id: 'ADM-001',
            email: user.email,
            name: 'Bijay (Lead Organizer)',
            role: 'super_admin',
            status: 'active',
            createdAt: serverTimestamp()
          }, { merge: true });
        } catch (setErr) {
          console.warn('⚠️ [Firebase] Auto-provision warning:', setErr);
        }
      } else {
        // If document does not exist and not recognized primary admin, reject access
        await signOut(auth);
        return {
          success: false,
          message: `Access Denied: No administrator record found in 'admins/${user.uid}'.`
        };
      }
    }

    let adminData = (adminDoc && adminDoc.exists()) ? adminDoc.data() : { role: 'super_admin', name: 'Bijay (Lead Organizer)' };
    let role = (adminData.role || (isPrimaryAdmin ? 'super_admin' : '')).toLowerCase();

    // 3. Verify role (e.g., super_admin, admin)
    if (!isPrimaryAdmin && (!role || (!role.includes('super_admin') && !role.includes('admin') && !role.includes('organizer')))) {
      await signOut(auth);
      return {
        success: false,
        message: `Access Denied: Account role '${adminData.role}' is not authorized for administrator access.`
      };
    }

    const sessionData = {
      uid: user.uid,
      email: user.email,
      name: adminData.name || user.displayName || 'Bijay (Lead Organizer)',
      role: adminData.role || 'super_admin',
      ...adminData
    };

    sessionStorage.setItem('zayathon_admin_session', 'active');
    sessionStorage.setItem('zayathon_admin_user', JSON.stringify(sessionData));
    return { success: true, user: sessionData };
  } catch (err) {
    console.error('❌ [Firebase] Admin login error:', err);
    let msg = 'Authentication failed: ' + (err.message || 'Please check your credentials.');
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
      msg = 'Invalid organizer email or password. Please verify the credentials entered.';
    } else if (err.code === 'auth/too-many-requests') {
      msg = 'Too many failed login attempts. Please try again in a few moments.';
    }
    return { success: false, message: msg, error: err };
  }
}

/**
 * Check if the currently authenticated user is an authorized admin in Firestore
 */
export async function checkAdminAuthorization(user) {
  if (!user || !user.uid) return false;
  if (
    user.uid === 'LhqQVJyCuog3jFbCjvdWYKKhttz1' ||
    user.email === 'bijay08@gmail.com' ||
    user.email === 'admin@zayacodehub.com'
  ) {
    return true;
  }
  if (!isFirebaseConfigured() || !db) {
    return sessionStorage.getItem('zayathon_admin_session') === 'active';
  }

  try {
    const adminRef = doc(db, 'admins', user.uid);
    const adminDoc = await getDoc(adminRef);
    if (!adminDoc.exists()) return false;
    const role = (adminDoc.data()?.role || '').toLowerCase();
    return role.includes('super_admin') || role.includes('admin') || role.includes('organizer');
  } catch (e) {
    console.warn('Error checking admin authorization document:', e);
    return false;
  }
}

/**
 * Sign out current administrator
 */
export async function logoutAdminFromFirebase() {
  sessionStorage.removeItem('zayathon_admin_session');
  sessionStorage.removeItem('zayathon_admin_user');
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {}
  }
  window.location.href = 'login.html';
}

// -----------------------------------------------------------------------------
// 3. Admin Participant Management & Firestore Actions
// -----------------------------------------------------------------------------

/**
 * Fetch all participants from Firestore (or fallback to local cache)
 */
export async function getParticipantsFromFirestore() {
  if (!isFirebaseConfigured() || !db) {
    const local = localStorage.getItem('zayathon_admin_participants');
    return local ? JSON.parse(local) : [];
  }

  try {
    const colRef = collection(db, 'participants');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const list = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      list.push({
        id: data.participantId || docSnap.id,
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        college: data.college,
        department: data.department || 'Engineering & Technology',
        degree: data.course || 'B.E. / B.Tech',
        year: data.year,
        teamId: data.teamId || data.team || `ZT-${docSnap.id}`,
        teamName: data.team || data.teamName || 'Team',
        role: data.role || 'Team Leader',
        track: data.track,
        projectTitle: data.projectTitle || '',
        projectAbstract: data.projectAbstract || '',
        regDate: data.createdAt ? new Date(data.createdAt).toLocaleString() : new Date().toLocaleString(),
        status: (data.status || 'pending').charAt(0).toUpperCase() + (data.status || 'pending').slice(1),
        verifiedBy: data.verifiedBy || '',
        verifiedAt: data.verifiedAt || '',
        rejectionReason: data.rejectionReason || '',
        documents: data.documents || [],
        checklist: data.checklist || [true, true, true, false, false],
        notes: data.notes || [],
        history: data.history || []
      });
    });

    if (list.length > 0) {
      localStorage.setItem('zayathon_admin_participants', JSON.stringify(list));
    }
    return list;
  } catch (err) {
    console.error('❌ [Firestore] Failed to get participants:', err);
    const local = localStorage.getItem('zayathon_admin_participants');
    return local ? JSON.parse(local) : [];
  }
}

/**
 * Real-time subscription to participants collection
 */
export function subscribeToParticipants(callback) {
  if (!isFirebaseConfigured() || !db) {
    const list = JSON.parse(localStorage.getItem('zayathon_admin_participants') || '[]');
    callback(list);
    return () => {};
  }

  const colRef = collection(db, 'participants');
  return onSnapshot(
    colRef,
    snapshot => {
      const list = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        list.push({
          id: data.participantId || docSnap.id,
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          college: data.college,
          department: data.department || 'Engineering & Technology',
          degree: data.course || 'B.E. / B.Tech',
          year: data.year,
          teamId: data.teamId || data.team || `ZT-${docSnap.id}`,
          teamName: data.team || data.teamName || 'Team',
          role: data.role || 'Team Leader',
          track: data.track,
          projectTitle: data.projectTitle || '',
          projectAbstract: data.projectAbstract || '',
          regDate: data.createdAt ? new Date(data.createdAt).toLocaleString() : new Date().toLocaleString(),
          status: (data.status || 'pending').charAt(0).toUpperCase() + (data.status || 'pending').slice(1),
          verifiedBy: data.verifiedBy || '',
          verifiedAt: data.verifiedAt || '',
          rejectionReason: data.rejectionReason || '',
          documents: data.documents || [],
          checklist: data.checklist || [true, true, true, true, true],
          notes: data.notes || [],
          history: data.history || []
        });
      });
      callback(list);
    },
    error => {
      console.error('Participants subscription error:', error);
    }
  );
}

/**
 * Verify Participant (status = 'verified')
 * Updates Firestore 'participants' doc and logs to 'verification_history'
 */
export async function verifyParticipantInFirestore(participantId, adminInfo) {
  const nowIso = new Date().toISOString();
  const nowDisplay = new Date().toLocaleString();
  const adminName = adminInfo?.name || 'Authorized Admin';
  const adminEmail = adminInfo?.email || 'admin@zayacodehub.com';
  const adminId = adminInfo?.uid || 'ADM-ZAYA';

  if (isFirebaseConfigured() && db) {
    try {
      const pRef = doc(db, 'participants', participantId);
      await updateDoc(pRef, {
        status: 'verified',
        verifiedBy: adminName,
        verifiedAt: nowDisplay,
        updatedAt: nowIso,
        checklist: [true, true, true, true, true],
        serverUpdatedAt: serverTimestamp()
      });

      // Add to verification_history collection
      const histCol = collection(db, 'verification_history');
      await addDoc(histCol, {
        participantId: participantId,
        action: 'Participant Verified',
        adminId: adminId,
        adminName: adminName,
        adminEmail: adminEmail,
        time: nowDisplay,
        timestamp: nowIso,
        meta: `Participant ${participantId} application verified by ${adminName}.`,
        serverTimestamp: serverTimestamp()
      });

      console.log('✅ [Firestore] Verified participant:', participantId);
    } catch (err) {
      console.error('❌ [Firestore] Verification update error:', err);
    }
  }

  // Update local store as well
  try {
    const list = JSON.parse(localStorage.getItem('zayathon_admin_participants') || '[]');
    const target = list.find(p => p.id === participantId);
    if (target) {
      target.status = 'Verified';
      target.verifiedBy = adminName;
      target.verifiedAt = nowDisplay;
      target.checklist = [true, true, true, true, true];
      target.history = target.history || [];
      target.history.unshift({
        action: 'Participant Verified',
        admin: adminName,
        time: nowDisplay,
        meta: 'Application verified and official admit pass cleared.'
      });
      localStorage.setItem('zayathon_admin_participants', JSON.stringify(list));
    }
  } catch (e) {}

  return { success: true };
}

/**
 * Reject Participant (status = 'rejected') with Rejection Reason
 * Updates Firestore 'participants' doc and logs to 'verification_history'
 */
export async function rejectParticipantInFirestore(participantId, reason, adminInfo, adminNote = '') {
  const nowIso = new Date().toISOString();
  const nowDisplay = new Date().toLocaleString();
  const adminName = adminInfo?.name || 'Authorized Admin';
  const adminEmail = adminInfo?.email || 'admin@zayacodehub.com';
  const adminId = adminInfo?.uid || 'ADM-ZAYA';

  if (isFirebaseConfigured() && db) {
    try {
      const pRef = doc(db, 'participants', participantId);
      await updateDoc(pRef, {
        status: 'rejected',
        rejectionReason: reason,
        rejectedBy: adminName,
        rejectedAt: nowDisplay,
        updatedAt: nowIso,
        serverUpdatedAt: serverTimestamp()
      });

      // Add to verification_history collection
      const histCol = collection(db, 'verification_history');
      await addDoc(histCol, {
        participantId: participantId,
        action: 'Participant Rejected',
        reason: reason,
        note: adminNote,
        adminId: adminId,
        adminName: adminName,
        adminEmail: adminEmail,
        time: nowDisplay,
        timestamp: nowIso,
        meta: `Reason: ${reason}. ${adminNote ? `Note: "${adminNote}"` : ''}`,
        serverTimestamp: serverTimestamp()
      });

      // If there's an accompanying admin note, save to admin_notes collection
      if (adminNote) {
        const notesCol = collection(db, 'admin_notes');
        await addDoc(notesCol, {
          participantId: participantId,
          authorId: adminId,
          authorName: adminName,
          authorEmail: adminEmail,
          text: `[Rejection Reason: ${reason}] ${adminNote}`,
          createdAt: nowIso,
          serverTimestamp: serverTimestamp()
        });
      }

      console.log('✅ [Firestore] Rejected participant:', participantId, reason);
    } catch (err) {
      console.error('❌ [Firestore] Rejection update error:', err);
    }
  }

  // Update local store as well
  try {
    const list = JSON.parse(localStorage.getItem('zayathon_admin_participants') || '[]');
    const target = list.find(p => p.id === participantId);
    if (target) {
      target.status = 'Rejected';
      target.rejectionReason = reason;
      target.verifiedBy = adminName;
      target.verifiedAt = nowDisplay;
      target.history = target.history || [];
      target.history.unshift({
        action: 'Participant Rejected',
        admin: adminName,
        time: nowDisplay,
        meta: `Reason: ${reason}`
      });
      if (adminNote) {
        target.notes = target.notes || [];
        target.notes.unshift({
          author: adminName,
          time: nowDisplay,
          text: `[Rejection Reason: ${reason}] ${adminNote}`
        });
      }
      localStorage.setItem('zayathon_admin_participants', JSON.stringify(list));
    }
  } catch (e) {}

  return { success: true };
}

/**
 * Add Admin Note to 'admin_notes' collection in Firestore
 */
export async function addAdminNoteToFirestore(participantId, noteText, adminInfo) {
  const nowIso = new Date().toISOString();
  const nowDisplay = new Date().toLocaleString();
  const adminName = adminInfo?.name || 'Authorized Admin';
  const adminEmail = adminInfo?.email || 'admin@zayacodehub.com';
  const adminId = adminInfo?.uid || 'ADM-ZAYA';

  if (isFirebaseConfigured() && db) {
    try {
      const notesCol = collection(db, 'admin_notes');
      await addDoc(notesCol, {
        participantId: participantId,
        authorId: adminId,
        authorName: adminName,
        authorEmail: adminEmail,
        text: noteText,
        createdAt: nowIso,
        serverTimestamp: serverTimestamp()
      });

      // Also log action in verification_history
      const histCol = collection(db, 'verification_history');
      await addDoc(histCol, {
        participantId: participantId,
        action: 'Admin Note Added',
        adminId: adminId,
        adminName: adminName,
        adminEmail: adminEmail,
        time: nowDisplay,
        timestamp: nowIso,
        meta: `Note added by ${adminName}`,
        serverTimestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('❌ [Firestore] Error writing admin note:', err);
    }
  }

  // Update local store
  try {
    const list = JSON.parse(localStorage.getItem('zayathon_admin_participants') || '[]');
    const target = list.find(p => p.id === participantId);
    if (target) {
      target.notes = target.notes || [];
      target.notes.unshift({
        author: adminName,
        time: nowDisplay,
        text: noteText
      });
      target.history = target.history || [];
      target.history.unshift({
        action: 'Admin Note Added',
        admin: adminName,
        time: nowDisplay,
        meta: `Note: "${noteText.length > 40 ? noteText.substring(0, 40) + '...' : noteText}"`
      });
      localStorage.setItem('zayathon_admin_participants', JSON.stringify(list));
    }
  } catch (e) {}

  return { success: true };
}

/**
 * Fetch Verification History for a participant or all activities
 */
export async function fetchVerificationHistoryFromFirestore(participantId = null) {
  if (!isFirebaseConfigured() || !db) return [];

  try {
    const colRef = collection(db, 'verification_history');
    let q;
    if (participantId) {
      q = query(colRef, where('participantId', '==', participantId), orderBy('serverTimestamp', 'desc'));
    } else {
      q = query(colRef, orderBy('serverTimestamp', 'desc'), limit(50));
    }
    const snapshot = await getDocs(q);
    const history = [];
    snapshot.forEach(docSnap => {
      history.push({ id: docSnap.id, ...docSnap.data() });
    });
    return history;
  } catch (err) {
    console.error('❌ [Firestore] Error fetching history:', err);
    return [];
  }
}

/**
 * Upload Participant verification document (PDF/Image) to Firebase Storage
 */
export async function uploadParticipantDoc(participantId, file, docType = 'College ID') {
  if (!isFirebaseConfigured() || !storage) {
    console.warn('Firebase storage offline. Simulating upload.');
    return {
      name: file.name,
      type: docType,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      url: '#'
    };
  }

  try {
    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const storageRef = ref(storage, `participants/${participantId}/${safeName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return {
      name: file.name,
      type: docType,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      url: downloadUrl
    };
  } catch (err) {
    console.error('❌ [Firebase Storage] Upload error:', err);
    throw err;
  }
}
