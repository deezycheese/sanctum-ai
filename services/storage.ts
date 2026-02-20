import { Memory, JournalEntry, UserProfile, Message } from '../types';

// In a real app, this would use SubtleCrypto. For this demo, we use Base64 to simulate the "encrypted at rest" visual.
const ENCRYPTION_KEY = 'sanctum-local-key';

const encode = (data: any): string => {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  } catch (e) {
    console.error("Encryption error", e);
    return "";
  }
};

const decode = <T>(data: string): T | null => {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(data))));
  } catch (e) {
    return null;
  }
};

export const StorageService = {
  save: (key: string, data: any) => {
    localStorage.setItem(`${ENCRYPTION_KEY}:${key}`, encode(data));
  },

  load: <T>(key: string, defaultValue: T): T => {
    const raw = localStorage.getItem(`${ENCRYPTION_KEY}:${key}`);
    if (!raw) return defaultValue;
    const decoded = decode<T>(raw);
    return decoded !== null ? decoded : defaultValue;
  },

  clearAll: () => {
    localStorage.clear();
  }
};
