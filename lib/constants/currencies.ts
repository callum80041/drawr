export const CURRENCIES = {
  GBP: { symbol: '£', name: 'British Pounds', code: 'gbp' },
  USD: { symbol: '$', name: 'US Dollars', code: 'usd' },
  EUR: { symbol: '€', name: 'Euros', code: 'eur' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'jpy' },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export const CURRENCY_OPTIONS: Array<{ value: CurrencyCode; label: string }> = [
  { value: 'GBP', label: 'British Pounds (£)' },
  { value: 'USD', label: 'US Dollars ($)' },
  { value: 'EUR', label: 'Euros (€)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
];
