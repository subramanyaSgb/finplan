import { describe, it, expect } from 'vitest';
import { CURRENCIES, convert, getCurrencySymbol } from '../currency';

describe('CURRENCIES', () => {
  it('includes INR, USD, EUR, GBP, AED, SGD', () => {
    const codes = CURRENCIES.map(c => c.code);
    expect(codes).toContain('INR');
    expect(codes).toContain('USD');
    expect(codes).toContain('EUR');
    expect(codes).toContain('GBP');
    expect(codes).toContain('AED');
    expect(codes).toContain('SGD');
  });
});

describe('convert', () => {
  it('returns same amount for same currency', () => {
    expect(convert(1000, 'INR', 'INR')).toBe(1000);
  });
  it('converts USD to INR using bundled rates', () => {
    const result = convert(100, 'USD', 'INR');
    expect(result).toBeGreaterThan(8000);
    expect(result).toBeLessThan(9000);
  });
});

describe('getCurrencySymbol', () => {
  it('returns ₹ for INR', () => expect(getCurrencySymbol('INR')).toBe('₹'));
  it('returns $ for USD', () => expect(getCurrencySymbol('USD')).toBe('$'));
  it('returns € for EUR', () => expect(getCurrencySymbol('EUR')).toBe('€'));
});
