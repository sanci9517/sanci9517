import { error, ok } from "../../core/response";
import { generateSalt, hashPassword } from "../../core/auth/password";
import type { Env } from "../../types/env";

export async function authBootstrapRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return error("METHOD_NOT_ALLOWED", 405);
  }

  const bootstrapToken = request.headers.get("X-Admin-Bootstrap-Token");
  if (!bootstrapToken || !env.ADMIN_BOOTSTRAP_TOKEN || bootstrapToken !== env.ADMIN_BOOTSTRAP_TOKEN) {
    return error("BOOTSTRAP_UNAUTHORIZED", 401);
  }

  const existing = await env.DB.prepare("SELECT id FROM users LIMIT 1").first<{ id: string }>();
  if (existing) {
    return error("BOOTSTRAP_ALREADY_COMPLETED", 409);
  }

  let body: { email?: string; displayName?: string; password?: string };
  try {
    body = await request.json<{ email?: string; displayName?: string; password?: string }>();
  } catch {
    return error("INVALID_JSON", 400);
  }

  const email = body.email?.trim().toLowerCase();
  const displayName = body.displayName?.trim();
  const password = body.password;

  if (!email || !displayName || !password) {
    return error("INVALID_INPUT", 400, "email, displayName and password are required");
  }

  if (email.length > 254 || displayName.length > 100 || password.length < 12 || password.length > 200) {
    return error("INVALID_INPUT", 400, "Invalid account data");
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO users (id, email, display_name, role, is_active, password_hash, password_salt, created_at, updated_at)
     VALUES (?, ?, ?, 'admin', 1, ?, ?, ?, ?)`
  )
    .bind(id, email, displayName, passwordHash, bytesToBase64(salt), now, now)
    .run();

  return ok({
    created: true,
    user: { id, email, displayName, role: "admin" }
  });
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
