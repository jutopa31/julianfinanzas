import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not found in environment variables');
  console.error('Please configure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper para manejar errores de Supabase
export function handleSupabaseError(error: any): string {
  if (error?.message) {
    // Traducir mensajes comunes de error
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Credenciales inválidas',
      'User already registered': 'El usuario ya está registrado',
      'Email not confirmed': 'Email no confirmado',
      'Network request failed': 'Error de conexión. Verifica tu internet.',
    };

    return errorMessages[error.message] || error.message;
  }

  return 'Ha ocurrido un error inesperado';
}

// Helper para verificar si hay conexión a Supabase
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('currencies').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
}

export default supabase;
