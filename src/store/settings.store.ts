import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '@/services/supabase/client';

export type Currency = {
  id: string;
  code: string;
  symbol: string;
  name: string;
  rate_to_usd: number;
  updated_at: string;
};

type SettingsState = {
  currencies: Currency[];
  selectedCurrencyCode: string; // ISO code, e.g., 'USD'
  loading: boolean;
  error?: string | null;
  fetchCurrencies: () => Promise<void>;
  setSelectedCurrencyCode: (code: string) => Promise<void>;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      currencies: [],
      selectedCurrencyCode: 'USD',
      loading: false,
      error: null,
      fetchCurrencies: async () => {
        set({ loading: true, error: null });
        const { data, error } = await supabase
          .from('currencies')
          .select('id, code, symbol, name, rate_to_usd, updated_at')
          .order('code', { ascending: true });
        if (error) return set({ loading: false, error: error.message });
        set({ currencies: (data as any) || [] });

        // Try to hydrate selected currency from profile
        const { data: session } = await supabase.auth.getSession();
        const userId = session.session?.user?.id;
        if (userId) {
          const { data: profile, error: pErr } = await supabase
            .from('users_profile')
            .select('default_currency_id')
            .eq('id', userId)
            .maybeSingle();
          if (!pErr && profile?.default_currency_id) {
            const match = (data as any)?.find((c: any) => c.id === profile.default_currency_id);
            if (match) set({ selectedCurrencyCode: match.code });
          }
        }
        set({ loading: false });
      },
      setSelectedCurrencyCode: async (code: string) => {
        set({ selectedCurrencyCode: code });
        // Optional: persist in user profile if available
        const { data: session } = await supabase.auth.getSession();
        const userId = session.session?.user?.id;
        if (!userId) return;
        // Find currency id by code
        const currency = get().currencies.find((c) => c.code === code);
        if (!currency) return;
        await supabase
          .from('users_profile')
          .upsert({ id: userId, default_currency_id: currency.id })
          .select('id');
      },
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedCurrencyCode: state.selectedCurrencyCode,
      }),
    }
  )
);

export default useSettingsStore;
