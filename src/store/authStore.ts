import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '../services/auth/authService';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),

  setSession: (session) => set({ session }),

  setLoading: (loading) => set({ loading }),

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { user, session, error } = await authService.signIn(email, password);

      if (error) {
        set({ loading: false });
        return { error: error.message };
      }

      set({ user, session, loading: false });
      return { error: null };
    } catch (error) {
      set({ loading: false });
      return { error: 'Error inesperado al iniciar sesión' };
    }
  },

  signUp: async (email, password) => {
    set({ loading: true });
    try {
      const { user, session, error } = await authService.signUp(email, password);

      if (error) {
        set({ loading: false });
        return { error: error.message };
      }

      set({ user, session, loading: false });
      return { error: null };
    } catch (error) {
      set({ loading: false });
      return { error: 'Error inesperado al registrarse' };
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      const { error } = await authService.signOut();

      if (error) {
        set({ loading: false });
        return { error: error.message };
      }

      set({ user: null, session: null, loading: false });
      return { error: null };
    } catch (error) {
      set({ loading: false });
      return { error: 'Error inesperado al cerrar sesión' };
    }
  },

  initialize: async () => {
    set({ loading: true });
    try {
      // Obtener sesión actual
      const { session } = await authService.getSession();
      const user = session?.user ?? null;

      set({ user, session, loading: false, initialized: true });

      // Suscribirse a cambios de autenticación
      authService.onAuthStateChange((event, session) => {
        set({ user: session?.user ?? null, session });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false, initialized: true });
    }
  },
}));
