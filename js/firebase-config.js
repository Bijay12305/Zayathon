/**
 * ZAYATHON 2026 - Firebase Web Configuration
 * Project: Zayathon
 * 
 * You can set your Firebase Web credentials directly here, in window.__FIREBASE_CONFIG__,
 * or via localStorage key 'zayathon_firebase_config'.
 */

// Live Firebase configuration for Zayathon Web App
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyApRU5DIm3oQF95xxS1Ph_bnHTxo9VFwaA",
  authDomain: "zayathon-e2912.firebaseapp.com",
  projectId: "zayathon-e2912",
  storageBucket: "zayathon-e2912.firebasestorage.app",
  messagingSenderId: "564666028377",
  appId: "1:564666028377:web:b7136ea0b75f2ede137c48",
  measurementId: "G-KLVF6LNPRX"
};

// Check for runtime injected environment or stored configuration
function getResolvedFirebaseConfig() {
  if (typeof window !== 'undefined' && window.__FIREBASE_CONFIG__ && window.__FIREBASE_CONFIG__.apiKey) {
    return window.__FIREBASE_CONFIG__;
  }
  
  try {
    const saved = localStorage.getItem('zayathon_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && !parsed.apiKey.includes('YOUR_')) {
        return parsed;
      }
    }
  } catch (e) {}

  return DEFAULT_FIREBASE_CONFIG;
}

export const firebaseConfig = getResolvedFirebaseConfig();

export function isFirebaseConfigured() {
  const cfg = getResolvedFirebaseConfig();
  return (
    cfg.apiKey &&
    !cfg.apiKey.includes('YOUR_') &&
    cfg.projectId &&
    !cfg.projectId.includes('YOUR_') &&
    cfg.appId &&
    !cfg.appId.includes('YOUR_')
  );
}

export function getMissingConfigKeys() {
  const cfg = getResolvedFirebaseConfig();
  const missing = [];
  if (!cfg.apiKey || cfg.apiKey.includes('YOUR_')) missing.push('apiKey (FIREBASE_API_KEY)');
  if (!cfg.authDomain || cfg.authDomain.includes('YOUR_')) missing.push('authDomain (FIREBASE_AUTH_DOMAIN)');
  if (!cfg.projectId || cfg.projectId.includes('YOUR_')) missing.push('projectId (FIREBASE_PROJECT_ID)');
  if (!cfg.appId || cfg.appId.includes('YOUR_')) missing.push('appId (FIREBASE_APP_ID)');
  return missing;
}

export function saveFirebaseConfig(newConfig) {
  try {
    localStorage.setItem('zayathon_firebase_config', JSON.stringify(newConfig));
    return true;
  } catch (e) {
    console.error('Failed to persist Firebase config', e);
    return false;
  }
}
