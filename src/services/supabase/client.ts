import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Expo requires EXPO_PUBLIC_ prefix for env exposure
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

function createMockSupabaseClient() {
  // Very small mock that emulates the subset of Supabase used by the app.
  const response = (data: any = null) => ({ data, error: null });

  const thenable = (data: any = null) => ({
    _data: data,
    select() {
      return this;
    },
    order() {
      return this;
    },
    eq() {
      return this;
    },
    maybeSingle() {
      return Promise.resolve(response(null));
    },
    single() {
      return Promise.resolve(response(null));
    },
    insert() {
      return this;
    },
    update() {
      return this;
    },
    delete() {
      return this;
    },
    then(onFulfilled: any, onRejected: any) {
      return Promise.resolve(response(this._data)).then(onFulfilled, onRejected);
    },
  });

  const auth = {
    async getSession() {
      return response({ session: { user: { id: 'demo-user' } } });
    },
    onAuthStateChange(callback: any) {
      try {
        callback('SIGNED_IN', { user: { id: 'demo-user' } });
      } catch {}
      return { data: { subscription: { unsubscribe() {} } }, error: null };
    },
    async signInWithPassword() {
      return response({ session: { user: { id: 'demo-user' } } });
    },
    async signUp() {
      return response({ user: { id: 'demo-user' } });
    },
    async signOut() {
      return { error: null } as any;
    },
  };

  return {
    auth,
    from() {
      // Return a thenable builder that can be awaited or chained.
      return thenable([]);
    },
  } as any;
}

let supabaseClient: any;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Using mock client with demo data.'
  );
  supabaseClient = createMockSupabaseClient();
} else {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const supabase = supabaseClient;
export default supabaseClient;
