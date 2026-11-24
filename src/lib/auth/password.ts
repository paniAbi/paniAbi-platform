// Protects Abril's password with scrypt (built into Node, no extra
// dependency). Only "scrypt$N$r$p$salt$hash" is stored; the password itself
// cannot be read back from it.
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const COST = 16384; // N
const BLOCK_SIZE = 8; // r
const PARALLELISM = 1; // p
const KEY_LENGTH = 64;

function derive(
  password: string,
  salt: Buffer,
  cost: number,
  blockSize: number,
  parallelism: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize("NFC"),
      salt,
      KEY_LENGTH,
      { N: cost, r: blockSize, p: parallelism },
      (error, key) => (error ? reject(error) : resolve(key)),
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, COST, BLOCK_SIZE, PARALLELISM);
  return [
    "scrypt",
    COST,
    BLOCK_SIZE,
    PARALLELISM,
    salt.toString("base64"),
    key.toString("base64"),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, cost, blockSize, parallelism, salt, expected] =
    stored.split("$");
  if (scheme !== "scrypt" || !salt || !expected) return false;

  const expectedKey = Buffer.from(expected, "base64");
  const key = await derive(
    password,
    Buffer.from(salt, "base64"),
    Number(cost),
    Number(blockSize),
    Number(parallelism),
  );
  // Constant-time comparison, so the time taken reveals nothing.
  return key.length === expectedKey.length && timingSafeEqual(key, expectedKey);
}
