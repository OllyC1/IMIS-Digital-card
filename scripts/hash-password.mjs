import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error("Pass a password of at least 12 characters.");
  process.exit(1);
}

const N = 16384;
const r = 8;
const p = 1;
const salt = randomBytes(24).toString("base64url");
const derived = await promisify(scrypt)(password, salt, 64, { N, r, p });
console.log(`scrypt$${N}$${r}$${p}$${salt}$${Buffer.from(derived).toString("base64url")}`);
