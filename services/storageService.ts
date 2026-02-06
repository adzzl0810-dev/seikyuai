import { SavedInvoice, UserProfile, Issuer } from "../types";

const STORAGE_KEY_PREFIX = 'seikyu_ai_';
const USERS_DB_KEY = 'seikyu_ai_users_db';
const DRAFT_KEY = 'seikyu_ai_guest_draft';
const PREF_KEY_SUFFIX = '_preferences';

// --- Auth Types ---
interface UserRecord {
  username: string;
  pinHash: string; // Simple hash
  profile: UserProfile;
}

interface UsersDB {
  [username: string]: UserRecord;
}

// --- Helper: Simple Hash (For frontend separation only) ---
const hashPin = (pin: string): string => {
  // Simple Base64 + reverse to obscure the PIN in localStorage
  return btoa(pin).split('').reverse().join('');
};

// --- Auth Functions ---

export const registerUser = (username: string, displayName: string, pin: string): { success: boolean; user?: UserProfile; error?: string } => {
  const dbJSON = localStorage.getItem(USERS_DB_KEY);
  const db: UsersDB = dbJSON ? JSON.parse(dbJSON) : {};

  if (db[username]) {
    return { success: false, error: "このユーザーIDは既に使用されています" };
  }

  const profile: UserProfile = {
    name: displayName,
    email: `${username}@local`, // Use username as ID for storage keys
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=128`
  };

  db[username] = {
    username,
    pinHash: hashPin(pin),
    profile
  };

  localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
  localStorage.setItem('seikyu_current_user_profile', JSON.stringify(profile));
  
  return { success: true, user: profile };
};

export const loginUser = (username: string, pin: string): { success: boolean; user?: UserProfile; error?: string } => {
  const dbJSON = localStorage.getItem(USERS_DB_KEY);
  if (!dbJSON) return { success: false, error: "ユーザーが見つかりません" };
  
  const db: UsersDB = JSON.parse(dbJSON);
  const record = db[username];

  if (!record) {
    return { success: false, error: "ユーザーが見つかりません" };
  }

  if (record.pinHash !== hashPin(pin)) {
    return { success: false, error: "PINコードが間違っています" };
  }

  // Login Success
  localStorage.setItem('seikyu_current_user_profile', JSON.stringify(record.profile));
  return { success: true, user: record.profile };
};

export const logoutUser = () => {
  localStorage.removeItem('seikyu_current_user_profile');
};

export const getCurrentUser = (): UserProfile | null => {
  const json = localStorage.getItem('seikyu_current_user_profile');
  return json ? JSON.parse(json) : null;
};

// --- User Preferences (Issuer Info Persistence) ---
export const saveUserPreferences = (userEmail: string, issuer: Issuer) => {
  const key = `${STORAGE_KEY_PREFIX}${userEmail}${PREF_KEY_SUFFIX}`;
  localStorage.setItem(key, JSON.stringify(issuer));
};

export const getUserPreferences = (userEmail: string): Issuer | null => {
  const key = `${STORAGE_KEY_PREFIX}${userEmail}${PREF_KEY_SUFFIX}`;
  const json = localStorage.getItem(key);
  return json ? JSON.parse(json) : null;
};

// --- History Management ---
export const saveInvoiceToHistory = (userEmail: string, invoice: SavedInvoice) => {
  const key = `${STORAGE_KEY_PREFIX}${userEmail}_history`;
  const historyJSON = localStorage.getItem(key);
  let history: SavedInvoice[] = historyJSON ? JSON.parse(historyJSON) : [];
  
  const index = history.findIndex(h => h.id === invoice.id);
  if (index >= 0) {
    history[index] = invoice;
  } else {
    history.push(invoice);
  }
  
  localStorage.setItem(key, JSON.stringify(history));
};

export const getInvoiceHistory = (userEmail: string): SavedInvoice[] => {
  const key = `${STORAGE_KEY_PREFIX}${userEmail}_history`;
  const historyJSON = localStorage.getItem(key);
  return historyJSON ? JSON.parse(historyJSON) : [];
};

export const deleteInvoiceFromHistory = (userEmail: string, invoiceId: string) => {
  const key = `${STORAGE_KEY_PREFIX}${userEmail}_history`;
  const historyJSON = localStorage.getItem(key);
  if (!historyJSON) return;
  
  let history: SavedInvoice[] = JSON.parse(historyJSON);
  history = history.filter(h => h.id !== invoiceId);
  localStorage.setItem(key, JSON.stringify(history));
};

// --- Guest Draft ---
export const saveDraft = (data: any) => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
};

export const loadDraft = (): any | null => {
  const json = localStorage.getItem(DRAFT_KEY);
  return json ? JSON.parse(json) : null;
};