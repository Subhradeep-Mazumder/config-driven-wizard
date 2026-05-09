import { sanitizeText } from './sanitize';

describe('sanitizeText', () => {
  it('returns empty string for null', () => {
    expect(sanitizeText(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(sanitizeText(undefined)).toBe('');
  });

  it('passes plain text through unchanged', () => {
    expect(sanitizeText('Ada Lovelace')).toBe('Ada Lovelace');
  });

  it('strips HTML tags', () => {
    expect(sanitizeText('<script>alert(1)</script>hello')).toBe('hello');
  });

  it('stringifies non-string inputs', () => {
    expect(sanitizeText(42)).toBe('42');
    expect(sanitizeText(true)).toBe('true');
  });
});
