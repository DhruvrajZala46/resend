import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const APP_ENCRYPTION_KEY = "APP_ENCRYPTION_KEY";

function getKey() {
  const keyBase64 = process.env[APP_ENCRYPTION_KEY];
  if (!keyBase64) throw new Error(`${APP_ENCRYPTION_KEY} is not set`);
  const key = Buffer.from(keyBase64, "base64");
  if (key.length !== 32)
    throw new Error(`${APP_ENCRYPTION_KEY} must be 32 bytes (base64-encoded)`);
  return key;
}

export function encrypt(plainText) {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: 16,
  });

  const encrypted = Buffer.concat([
    cipher.update(String(plainText), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    encrypted.toString("base64"),
    authTag.toString("base64"),
  ].join(":");
}

export function decrypt(encryptedPayload) {
  const key = getKey();
  const parts = encryptedPayload.split(":");
  if (parts.length !== 3) throw new Error("Invalid encrypted payload format");

  const iv = Buffer.from(parts[0], "base64");
  const ciphertext = Buffer.from(parts[1], "base64");
  const authTag = Buffer.from(parts[2], "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: 16,
  });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
