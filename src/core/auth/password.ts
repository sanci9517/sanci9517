const encoder = new TextEncoder();

export async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
  const material = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new Uint8Array(salt),
      iterations: 210_000,
      hash: "SHA-256"
    },
    material,
    256
  );

  return bytesToBase64(new Uint8Array(bits));
}

export async function verifyPassword(
  password: string,
  salt: Uint8Array,
  expectedHash: string
): Promise<boolean> {
  const actualHash = await hashPassword(password, salt);
  return timingSafeEqual(actualHash, expectedHash);
}

export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
