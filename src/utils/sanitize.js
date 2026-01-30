// Simple sanitizers for client-side storage and PII redaction
export function redactPII(s) {
  if (typeof s !== 'string') return s;
  // redact emails
  let out = s.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
  // redact long digit sequences (possible credit cards)
  out = out.replace(/\b\d{13,19}\b/g, '[REDACTED_NUMBER]');
  return out;
}

export function containsPII(s) {
  if (typeof s !== 'string') return false;
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(s)) return true;
  if (/\b\d{13,19}\b/.test(s)) return true;
  return false;
}
