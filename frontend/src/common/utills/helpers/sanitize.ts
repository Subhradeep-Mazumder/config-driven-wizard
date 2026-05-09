import DOMPurify from 'dompurify';

export function sanitizeText(input: unknown): string {
  if (input == null) return '';
  const str = String(input);
  return DOMPurify.sanitize(str, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

export default sanitizeText;
