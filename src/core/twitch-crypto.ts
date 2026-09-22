const encoder = new TextEncoder();

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function keyFromSecret(secret: string): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode("sanci9517:twitch-token:v1:" + secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function encryptTwitchToken(secret: string, value: string): Promise<{ ciphertext: string; iv: string }> {
  if (!secret) throw new Error("TWITCH_TOKEN_ENCRYPTION_KEY is required");
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await keyFromSecret(secret);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(value));
  return { ciphertext: base64Url(new Uint8Array(ciphertext)), iv: base64Url(iv) };
}

export async function decryptTwitchToken(secret: string, ciphertext: string, iv: string): Promise<string> {
  if (!secret) throw new Error("TWITCH_TOKEN_ENCRYPTION_KEY is required");
  const key = await keyFromSecret(secret);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromBase64Url(iv) }, key, fromBase64Url(ciphertext));
  return new TextDecoder().decode(plaintext);
}

export async function hashTwitchOAuthState(state: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(state));
  return base64Url(new Uint8Array(digest));
}
