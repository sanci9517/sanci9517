import { error, ok } from "../../core/response";
import {
  generateSessionToken,
  hashSessionToken,
  sessionCookie,
  SESSION_TTL_SECONDS
} from "../../core/auth/session";
import { verifyPassword } from "../../core/auth/password";
import type { Env } from "../../types/env";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

type UserCredentialRow = {
  id: string;
  email: string;
  displayName: string;
  role: "admin" | "editor" | "viewer";
  passwordHash: string | null;
  passwordSalt: string | null;
};

export async function authLoginRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return error("METHOD_NOT_ALLOWED", 405);
  }

  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return error("INVALID_JSON", 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password || email.length > 320 || password.length > 1024) {
    return error("INVALID_CREDENTIALS", 400);
  }

  try {
    const user = await env.DB.prepare(
      `SELECT
         id,
         email,
         display_name AS displayName,
         role,
         password_hash AS passwordHash,
         password_salt AS passwordSalt
       FROM users
       WHERE lower(email) = ?
         AND is_active = 1
       LIMIT 1`
    )
      .bind(email)
      .first<UserCredentialRow>();

    if (!user?.passwordHash || !user.passwordSalt) {
      return error("INVALID_CREDENTIALS", 401);
    }

    const salt = base64ToBytes(user.passwordSalt);
    const valid = await verifyPassword(password, salt, user.passwordHash);

    if (!valid) {
      return error("INVALID_CREDENTIALS", 401);
    }

    const token = generateSessionToken();
    const tokenHash = await hashSessionToken(token);
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();

    await env.DB.prepare(
      `INSERT INTO sessions (id, user_id, token_hash, expires_at)
       VALUES (?, ?, ?, ?)`
    )
      .bind(sessionId, user.id, tokenHash, expiresAt)
      .run();

    await env.DB.prepare(
      `INSERT INTO audit_log (id, user_id, action, entity_type, entity_id, metadata_json)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(
        crypto.randomUUID(),
        user.id,
        "auth.login",
        "session",
        sessionId,
        JSON.stringify({ method: "password" })
      )
      .run();

    const response = ok({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role
      }
    });

    response.headers.set("Set-Cookie", sessionCookie(token));
    return response;
  } catch {
    return error("LOGIN_FAILED", 500);
  }
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}
