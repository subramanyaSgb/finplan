export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
];

const DEFAULT_RATES = {
  INR: 1,
  USD: 0.01193,
  EUR: 0.01098,
  GBP: 0.00943,
  AED: 0.04381,
  SGD: 0.01604,
};

export const convert = (amount, from, to, customRates = null) => {
  if (from === to) return amount;
  const rates = customRates || DEFAULT_RATES;
  const inINR = amount / rates[from];
  return inINR * rates[to];
};

export const getCurrencySymbol = (code) => {
  const currency = CURRENCIES.find(c => c.code === code);
  return currency ? currency.symbol : code;
};

export const getCurrencyLocale = (code) => {
  const currency = CURRENCIES.find(c => c.code === code);
  return currency ? currency.locale : 'en-IN';
};
