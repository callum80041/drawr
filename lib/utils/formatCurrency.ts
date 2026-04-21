import { CURRENCIES, type CurrencyCode } from '@/lib/constants/currencies';

export function formatCurrency(amount: number, currency: CurrencyCode = 'GBP'): string {
  const curr = CURRENCIES[currency];
  if (!curr) return amount.toFixed(2);

  // Format based on currency (most currencies use 2 decimals, JPY uses 0)
  const decimals = currency === 'JPY' ? 0 : 2;
  const formatted = amount.toFixed(decimals);

  // Symbol placement varies by currency
  if (currency === 'GBP' || currency === 'USD' || currency === 'EUR') {
    return `${curr.symbol}${formatted}`;
  }

  // JPY symbol usually goes after
  return `${formatted}${curr.symbol}`;
}
