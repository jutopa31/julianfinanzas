import { create } from 'zustand';
import { Currency, UserProfile } from '../types/app.types';
import { currencyService } from '../services/currencies/currencyService';
import { profileService } from '../services/profile/profileService';

interface CurrencyState {
  currencies: Currency[];
  defaultCurrency: Currency | null;
  userProfile: UserProfile | null;
  loading: boolean;
  initialized: boolean;

  // Actions
  fetchCurrencies: () => Promise<{ error: string | null }>;
  loadUserProfile: (userId: string) => Promise<{ error: string | null }>;
  setDefaultCurrency: (userId: string, currencyId: string) => Promise<{ error: string | null }>;
  getCurrencyById: (currencyId: string) => Currency | null;
  convertAmount: (amount: number, fromCurrencyId: string, toCurrencyId: string) => number;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currencies: [],
  defaultCurrency: null,
  userProfile: null,
  loading: false,
  initialized: false,

  fetchCurrencies: async () => {
    set({ loading: true });
    try {
      const { data, error } = await currencyService.getAllCurrencies();

      if (error || !data) {
        set({ loading: false });
        return { error: error || 'Error al cargar monedas' };
      }

      set({ currencies: data, loading: false, initialized: true });
      return { error: null };
    } catch (error) {
      set({ loading: false });
      return { error: 'Error inesperado al cargar monedas' };
    }
  },

  loadUserProfile: async (userId: string) => {
    set({ loading: true });
    try {
      // Obtener o crear perfil
      const { data: profile, error: profileError } = await profileService.getOrCreateProfile(userId);

      if (profileError || !profile) {
        set({ loading: false });
        return { error: profileError || 'Error al cargar perfil' };
      }

      set({ userProfile: profile });

      // Si tiene moneda por defecto, cargarla
      if (profile.default_currency_id) {
        const { data: currency, error: currencyError } = await currencyService.getCurrencyById(
          profile.default_currency_id
        );

        if (!currencyError && currency) {
          set({ defaultCurrency: currency });
        }
      }

      set({ loading: false });
      return { error: null };
    } catch (error) {
      set({ loading: false });
      return { error: 'Error inesperado al cargar perfil' };
    }
  },

  setDefaultCurrency: async (userId: string, currencyId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await profileService.updateDefaultCurrency(userId, currencyId);

      if (error || !data) {
        set({ loading: false });
        return { error: error || 'Error al actualizar moneda' };
      }

      // Actualizar el estado local
      const currency = get().getCurrencyById(currencyId);
      set({ userProfile: data, defaultCurrency: currency, loading: false });

      return { error: null };
    } catch (error) {
      set({ loading: false });
      return { error: 'Error inesperado al actualizar moneda' };
    }
  },

  getCurrencyById: (currencyId: string) => {
    const { currencies } = get();
    return currencies.find((c) => c.id === currencyId) || null;
  },

  convertAmount: (amount: number, fromCurrencyId: string, toCurrencyId: string) => {
    const { currencies } = get();

    // Si son iguales, retornar el mismo monto
    if (fromCurrencyId === toCurrencyId) {
      return amount;
    }

    const fromCurrency = currencies.find((c) => c.id === fromCurrencyId);
    const toCurrency = currencies.find((c) => c.id === toCurrencyId);

    if (!fromCurrency || !toCurrency) {
      return amount;
    }

    // Convertir primero a USD, luego a la moneda destino
    const amountInUSD = amount / fromCurrency.rate_to_usd;
    const convertedAmount = amountInUSD * toCurrency.rate_to_usd;

    return convertedAmount;
  },
}));
