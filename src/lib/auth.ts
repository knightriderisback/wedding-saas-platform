'use client';

// Default Hardcoded Credentials (Not exposed in the UI)
export const DEFAULT_ADMIN_EMAIL = 'admin@royalvivah.com';
export const DEFAULT_ADMIN_PASSWORD = 'RoyalAdmin@2027#';

export const DEFAULT_CLIENT_ID = 'client-gourav-priya';
export const DEFAULT_CLIENT_TOKEN = 'CLT-GOURAV';
export const DEFAULT_CLIENT_PASSCODE = 'GouravPriya@2027';

const ADMIN_CREDS_KEY = 'royal_admin_creds';
const CLIENT_CREDS_KEY = 'royal_client_creds';
const ADMIN_SESSION_KEY = 'royal_admin_session_auth';
const CLIENT_SESSION_KEY = 'royal_client_session_auth';

export interface AdminCredentials {
  email: string;
  password: string;
  updatedAt: string;
}

export interface ClientCredentials {
  clientId: string;
  token: string;
  passcode: string;
  updatedAt: string;
}

// ---------------- Admin Authentication ----------------

export function getAdminCredentials(): AdminCredentials {
  if (typeof window === 'undefined') {
    return {
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    const raw = localStorage.getItem(ADMIN_CREDS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse admin creds:', err);
  }

  return {
    email: DEFAULT_ADMIN_EMAIL,
    password: DEFAULT_ADMIN_PASSWORD,
    updatedAt: new Date().toISOString(),
  };
}

export function updateAdminCredentials(newEmail: string, newPassword: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const creds: AdminCredentials = {
      email: newEmail.trim(),
      password: newPassword.trim(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(creds));
    return true;
  } catch (err) {
    console.error('Failed to update admin creds:', err);
    return false;
  }
}

export function validateAdminLogin(emailOrUser: string, pass: string): boolean {
  const current = getAdminCredentials();
  const cleanInput = emailOrUser.trim().toLowerCase();
  const cleanEmail = current.email.trim().toLowerCase();
  
  // Allow login with either full email or "admin" prefix
  const isMatch = (cleanInput === cleanEmail || cleanInput === 'admin') && pass.trim() === current.password.trim();
  if (isMatch && typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
  }
  return isMatch;
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

// ---------------- Client Authentication ----------------

export function getClientCredentials(targetClientId = DEFAULT_CLIENT_ID): ClientCredentials {
  if (typeof window === 'undefined') {
    return {
      clientId: targetClientId,
      token: DEFAULT_CLIENT_TOKEN,
      passcode: DEFAULT_CLIENT_PASSCODE,
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    const raw = localStorage.getItem(`${CLIENT_CREDS_KEY}_${targetClientId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse client creds:', err);
  }

  return {
    clientId: targetClientId,
    token: DEFAULT_CLIENT_TOKEN,
    passcode: DEFAULT_CLIENT_PASSCODE,
    updatedAt: new Date().toISOString(),
  };
}

export function updateClientCredentials(
  clientId: string,
  newPasscode: string,
  newToken?: string
): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const existing = getClientCredentials(clientId);
    const updated: ClientCredentials = {
      clientId,
      token: newToken?.trim() || existing.token,
      passcode: newPasscode.trim(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`${CLIENT_CREDS_KEY}_${clientId}`, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to update client creds:', err);
    return false;
  }
}

export function validateClientLogin(
  identifier: string,
  passcode: string
): { success: boolean; clientId?: string } {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = passcode.trim();

  // 1. Check primary client (Gourav & Priya)
  const primary = getClientCredentials(DEFAULT_CLIENT_ID);
  if (
    (cleanId === primary.clientId.toLowerCase() ||
      cleanId === primary.token.toLowerCase() ||
      cleanId === 'gourav-weds-priya' ||
      cleanId === 'gourav' ||
      cleanId === 'clt-gourav') &&
    cleanPass === primary.passcode
  ) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CLIENT_SESSION_KEY, primary.clientId);
    }
    return { success: true, clientId: primary.clientId };
  }

  // 2. Allow login for any custom slug / clientId matching the pattern
  if (cleanId.startsWith('client-') || cleanId.includes('-weds-')) {
    const targetSlug = cleanId.startsWith('client-') ? cleanId : `client-${cleanId}`;
    const custom = getClientCredentials(targetSlug);
    if (cleanPass === custom.passcode || cleanPass === DEFAULT_CLIENT_PASSCODE) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CLIENT_SESSION_KEY, targetSlug);
      }
      return { success: true, clientId: targetSlug };
    }
  }

  return { success: false };
}

export function getLoggedInClient(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CLIENT_SESSION_KEY);
}

export function logoutClient(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CLIENT_SESSION_KEY);
}
