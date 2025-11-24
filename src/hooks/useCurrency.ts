import { useEffect } from 'react';
import { useCurrencyStore } from '../store/currencyStore';
import { useAuthStore } from '../store/authStore';

/**
 * Hook personalizado para gestionar monedas
 * Inicializa automáticamente las monedas y el perfil del usuario
 */
export const useCurrency = () => {
  const user = useAuthStore((state) => state.user);
  const {
    currencies,
    defaultCurrency,
    loading,
    initialized,
    fetchCurrencies,
    loadUserProfile,
    setDefaultCurrency,
    getCurrencyById,
    convertAmount,
  } = useCurrencyStore();

  useEffect(() => {
    // Cargar monedas si no están inicializadas
    if (!initialized && !loading) {
      fetchCurrencies();
    }
  }, [initialized, loading, fetchCurrencies]);

  useEffect(() => {
    // Cargar perfil de usuario cuando esté autenticado
    if (user && initialized && !loading) {
      loadUserProfile(user.id);
    }
  }, [user, initialized, loading, loadUserProfile]);

  const handleSetDefaultCurrency = async (currencyId: string) => {
    if (!user) {
      return { error: 'Usuario no autenticado' };
    }
    return await setDefaultCurrency(user.id, currencyId);
  };

  const formatAmount = (
    amount: number,
    currencyId?: string,
    options?: { decimals?: number; showSymbol?: boolean }
  ) => {
    const { decimals = 2, showSymbol = true } = options || {};
    const currency = currencyId ? getCurrencyById(currencyId) : defaultCurrency;

    const formatted = amount.toFixed(decimals);

    if (!showSymbol || !currency) {
      return formatted;
    }

    return `${currency.symbol} ${formatted}`;
  };

  return {
    currencies,
    defaultCurrency,
    loading,
    initialized,
    setDefaultCurrency: handleSetDefaultCurrency,
    getCurrencyById,
    convertAmount,
    formatAmount,
  };
};
