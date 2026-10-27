// Local screen lock only: keeps children out of the parent area on a shared
// device. This is NOT account security; the hash never leaves this browser.
export function isValidPinFormat(pin: string): boolean {
  return /^\d{4,6}$/.test(pin ?? "");
}

export function hashPin(pin: string): string {
  let hash = 0x811c9dc5;
  const input = `kanti-parent:${pin}`;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a:${(hash >>> 0).toString(16)}`;
}

export function verifyPin(pin: string, storedHash: string | null | undefined): boolean {
  if (!storedHash || !isValidPinFormat(pin)) return false;
  return hashPin(pin) === storedHash;
}

export const PARENT_PIN_KEY = "kanti.parentPinHash";
export const PARENT_UNLOCK_KEY = "kanti.parentUnlocked";