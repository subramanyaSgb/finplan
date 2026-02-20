import { describe, it, expect } from 'vitest';
import { fmt, fmtFull, pct, uid, fmtDate } from '../format';

describe('fmt', () => {
  it('returns ₹0 for null/undefined', () => {
    expect(fmt(null)).toBe('₹0');
    expect(fmt(undefined)).toBe('₹0');
  });
  it('formats lakhs', () => expect(fmt(120000)).toBe('₹1.2L'));
  it('formats thousands', () => expect(fmt(45300)).toBe('₹45.3K'));
  it('formats small numbers', () => expect(fmt(500)).toBe('₹500'));
  it('supports custom currency symbol', () => expect(fmt(1200, '$')).toBe('$1.2K'));
});

describe('fmtFull', () => {
  it('formats with Indian comma separators', () => expect(fmtFull(120000)).toBe('₹1,20,000'));
  it('handles zero', () => expect(fmtFull(0)).toBe('₹0'));
  it('supports custom symbol', () => expect(fmtFull(1200, '$')).toBe('$1,200'));
});

describe('pct', () => {
  it('calculates percentage', () => expect(pct(50, 200)).toBe(25));
  it('returns 0 for zero divisor', () => expect(pct(50, 0)).toBe(0));
});

describe('uid', () => {
  it('generates unique IDs', () => {
    const a = uid();
    const b = uid();
    expect(a).not.toBe(b);
    expect(typeof a).toBe('string');
  });
});

describe('fmtDate', () => {
  it('formats ISO date string', () => {
    const result = fmtDate('2026-02-21');
    expect(result).toMatch(/Sat, 21 Feb/);
  });
});
