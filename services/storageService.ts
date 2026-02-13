import { SavedInvoice, UserProfile, Issuer } from "../types";
import { supabase } from "./supabase";

const STORAGE_KEY_PREFIX = 'seikyu_ai_';
const USERS_DB_KEY = 'seikyu_ai_users_db'; // Legacy local auth (deprecating, but kept for fallback)
const DRAFT_KEY = 'seikyu_ai_guest_draft';
const PREF_KEY_SUFFIX = '_preferences';

// --- Auth Functions (Legacy / Local) ---
// Kept for backward compatibility or if we want to support "offline local users" effectively.
// But for now, App.tsx primarily uses Supabase Auth.
export const logoutUser = () => {
  localStorage.removeItem('seikyu_current_user_profile');
};

export const getCurrentUser = (): UserProfile | null => {
  const json = localStorage.getItem('seikyu_current_user_profile');
  return json ? JSON.parse(json) : null;
};

// --- User Preferences (Issuer Info Persistence) ---
// Todo: Sync this with a 'profiles' table in Supabase
export const saveUserPreferences = (userEmail: string, issuer: Issuer) => {
  const key = `${STORAGE_KEY_PREFIX}${userEmail}${PREF_KEY_SUFFIX}`;
  localStorage.setItem(key, JSON.stringify(issuer));
};

export const getUserPreferences = (userEmail: string): Issuer | null => {
  const key = `${STORAGE_KEY_PREFIX}${userEmail}${PREF_KEY_SUFFIX}`;
  const json = localStorage.getItem(key);
  return json ? JSON.parse(json) : null;
};

// --- History Management (Hybrid: Supabase + Local) ---

export const saveInvoiceToHistory = async (userEmail: string, invoice: SavedInvoice, userId?: string) => {
  // If we have a userId, try to save to Supabase
  if (userId) {
    try {
      const { error } = await supabase
        .from('invoices')
        .upsert({
          id: invoice.id,
          user_id: userId,
          template_id: invoice.templateId,
          invoice_number: invoice.invoiceNumber,
          client_name: invoice.client.name,
          data: invoice,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Supabase save error:', error);
        // Fallback to local storage or just log error?
        // For now, let's behave as if we also save locally for redundancy/cache
      }
    } catch (e) {
      console.error('Supabase save exception:', e);
    }
  }

  // Always save to local storage as cache/offline backup (for now)
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

export const getInvoiceHistory = async (userEmail: string, userId?: string): Promise<SavedInvoice[]> => {
  // Try to fetch from Supabase if online and authorized
  if (userId) {
    const { data, error } = await supabase
      .from('invoices')
      .select('data')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Map back to SavedInvoice[]
      const remoteHistory = data.map((row: any) => row.data as SavedInvoice);

      // Update local cache
      const key = `${STORAGE_KEY_PREFIX}${userEmail}_history`;
      localStorage.setItem(key, JSON.stringify(remoteHistory));

      return remoteHistory;
    } else if (error) {
      console.error("Supabase fetch error:", error);
    }
  }

  // Fallback to local storage
  const key = `${STORAGE_KEY_PREFIX}${userEmail}_history`;
  const historyJSON = localStorage.getItem(key);
  return historyJSON ? JSON.parse(historyJSON) : [];
};

export const deleteInvoiceFromHistory = async (userEmail: string, invoiceId: string, userId?: string) => {
  if (userId) {
    await supabase.from('invoices').delete().eq('id', invoiceId);
  }

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