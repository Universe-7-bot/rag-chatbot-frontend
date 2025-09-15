import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'chatbot_session_id';

export const generateSessionId = (): string => {
  return uuidv4();
};

export const getStoredSessionId = (): string | null => {
  return localStorage.getItem(SESSION_KEY);
};

export const storeSessionId = (sessionId: string): void => {
  localStorage.setItem(SESSION_KEY, sessionId);
};

export const clearStoredSessionId = (): void => {
  localStorage.removeItem(SESSION_KEY);
};