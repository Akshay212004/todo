import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
} from 'react';
import { User } from '../types';
import { loginRequest, registerRequest } from '../services/authService';
import { setUnauthorizedHandler } from '../services/api';
import { clearSession, loadSession, saveSession } from '../utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  /** true until we have checked AsyncStorage for a saved session */
  isBootstrapping: boolean;
}

type AuthAction =
  | { type: 'RESTORE'; payload: { user: User; token: string } | null }
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' };

const initialState: AuthState = { user: null, token: null, isBootstrapping: true };

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'RESTORE':
      return {
        user: action.payload?.user ?? null,
        token: action.payload?.token ?? null,
        isBootstrapping: false,
      };
    case 'LOGIN':
      return { user: action.payload.user, token: action.payload.token, isBootstrapping: false };
    case 'LOGOUT':
      return { user: null, token: null, isBootstrapping: false };
    default:
      return state;
  }
};

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // On app start, restore the saved session (this is what keeps the user logged in).
  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: 'RESTORE', payload: await loadSession() });
      } catch {
        dispatch({ type: 'RESTORE', payload: null });
      }
    })();
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    dispatch({ type: 'LOGOUT' });
  }, []);

  // If the API ever answers 401 on a protected route, drop the session.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
    });
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  // login/register throw on failure so the calling screen can show the message.
  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await loginRequest(email, password);
    await saveSession(token, user);
    dispatch({ type: 'LOGIN', payload: { token, user } });
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const { token, user } = await registerRequest(email, password);
    await saveSession(token, user);
    dispatch({ type: 'LOGIN', payload: { token, user } });
  }, []);

  const value = useMemo(
    () => ({ ...state, login, register, logout }),
    [state, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
