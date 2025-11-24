import { Currency } from '../../types/app.types';

/**
 * Convierte un monto de una moneda a otra usando USD como base
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  if (fromCurrency.id === toCurrency.id) {
    return amount;
  }

  // Convertir a USD primero
  const amountInUSD = amount / fromCurrency.rate_to_usd;

  // Convertir de USD a la moneda destino
  const convertedAmount = amountInUSD * toCurrency.rate_to_usd;

  return convertedAmount;
}

/**
 * Formatea un monto con símbolo de moneda
 */
export function formatCurrency(
  amount: number,
  currency: Currency,
  options?: {
    decimals?: number;
    showSymbol?: boolean;
    showCode?: boolean;
  }
): string {
  const { decimals = 2, showSymbol = true, showCode = false } = options || {};

  const formatted = amount.toLocaleString('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (!showSymbol && !showCode) {
    return formatted;
  }

  if (showCode) {
    return `${formatted} ${currency.code}`;
  }

  return `${currency.symbol} ${formatted}`;
}

/**
 * Convierte múltiples montos a una moneda común
 */
export function convertMultipleCurrencies(
  items: Array<{ amount: number; currency: Currency }>,
  targetCurrency: Currency
): number {
  return items.reduce((total, item) => {
    const converted = convertCurrency(item.amount, item.currency, targetCurrency);
    return total + converted;
  }, 0);
}

/**
 * Obtiene la moneda con mejor tasa (más valor por unidad USD)
 */
export function getBestRateCurrency(currencies: Currency[]): Currency | null {
  if (currencies.length === 0) return null;

  return currencies.reduce((best, current) => {
    return current.rate_to_usd > best.rate_to_usd ? current : best;
  });
}

/**
 * Obtiene la moneda con peor tasa (menos valor por unidad USD)
 */
export function getWorstRateCurrency(currencies: Currency[]): Currency | null {
  if (currencies.length === 0) return null;

  return currencies.reduce((worst, current) => {
    return current.rate_to_usd < worst.rate_to_usd ? current : worst;
  });
}
