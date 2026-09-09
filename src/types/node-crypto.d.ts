declare module "node:crypto" {
  export interface ScryptOptions {
    N?: number;
    r?: number;
    p?: number;
    maxmem?: number;
  }

  export function scrypt(
    password: string | Uint8Array,
    salt: string | Uint8Array,
    keylen: number,
    options: ScryptOptions,
    callback: (err: Error | null, derivedKey: Uint8Array) => void
  ): void;
}
