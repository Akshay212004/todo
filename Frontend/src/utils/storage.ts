import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

/**
 * Persists the login session.
 *
 * Only getItem / setItem / removeItem are used because they exist in every
 * AsyncStorage version (v2 and v3), so upgrades do not break this file.
 *
 * AsyncStorage is unencrypted. For a higher-security app, replace the bodies of
 * these four functions with react-native-keychain; nothing else needs to change.
 */
const TOKEN_KEY = '@todo/token';
const USER_KEY = '@todo/user';

export const saveSession = async (token: string, user: User): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const loadSession = async (): Promise<{ token: string; user: User } | null> => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  const userJson = await AsyncStorage.getItem(USER_KEY);
  if (!token || !userJson) return null;
  try {
    return { token, user: JSON.parse(userJson) as User };
  } catch {
    return null; // corrupted value -> treat as logged out
  }
};

export const getToken = (): Promise<string | null> => AsyncStorage.getItem(TOKEN_KEY);

export const clearSession = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
};
