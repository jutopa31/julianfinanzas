import type { Currency } from '@/store/settings.store';

export function convertAmount(amount: number, from: Currency, to: Currency): number {
  if (from.code === to.code) return amount;
  // Normalize to USD, then to target using rate_to_usd
  const usd = amount * Number(from.rate_to_usd);
  const result = usd / Number(to.rate_to_usd || 1);
  return Number.isFinite(result) ? result : 0;
}

export function formatCurrency(amount: number, currencyCode: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

export function findCurrency(currencies: Currency[], code: string): Currency | undefined {
  return currencies.find((c) => c.code === code);
}

