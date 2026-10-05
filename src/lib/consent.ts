export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
}

export interface StoredConsent extends ConsentPreferences {
  timestamp: string;
}

const STORAGE_KEY = "yole_consent_v1";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.analytics !== "boolean" || typeof parsed?.marketing !== "boolean") {
      return null;
    }
    return parsed as StoredConsent;
  } catch {
    return null;
  }
}

export function applyConsent(prefs: ConsentPreferences) {
  if (typeof window === "undefined") return;

  const stored: StoredConsent = { ...prefs, timestamp: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // localStorage indisponível (modo privado, etc.) — segue apenas com o consent em memória
  }

  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag ?? ((...args: unknown[]) => window.dataLayer.push(args));
  gtag("consent", "update", {
    analytics_storage: prefs.analytics ? "granted" : "denied",
    ad_storage: prefs.marketing ? "granted" : "denied",
    ad_user_data: prefs.marketing ? "granted" : "denied",
    ad_personalization: prefs.marketing ? "granted" : "denied",
  });
}

export const OPEN_CONSENT_PREFERENCES_EVENT = "yole:open-consent-preferences";

export function openConsentPreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_CONSENT_PREFERENCES_EVENT));
}
