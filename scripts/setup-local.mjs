import { randomBytes, scryptSync } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const envPath = resolve('.env.local');
let text = await readFile(envPath, 'utf8').catch(() => '');
const has = (key) => new RegExp(`^${key}=.+`, 'm').test(text);
function set(key, value) {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  text = regex.test(text) ? text.replace(regex, `${key}=${value}`) : text.trimEnd() + `\n${key}=${value}\n`;
}
const defaults = { MONGODB_URI: 'mongodb://127.0.0.1:27019', MONGODB_DB: 'tebunai_dev', APP_ORIGIN: 'http://127.0.0.1:3200', ADMIN_USERNAME: 'owner' };
for (const [key, value] of Object.entries(defaults)) if (!has(key)) set(key, value);
await mkdir('.local-data', { recursive: true });
if (!has('ADMIN_PASSWORD_HASH') || process.argv.includes('--reset-admin')) {
  const password = randomBytes(24).toString('base64url');
  const salt = randomBytes(16).toString('hex');
  set('ADMIN_PASSWORD_HASH', `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`);
  set('ADMIN_SESSION_SECRET', randomBytes(48).toString('base64url'));
  const username = text.match(/^ADMIN_USERNAME=(.+)$/m)?.[1];
  await writeFile('.local-data/admin-access.txt', `LOCAL DEVELOPMENT ONLY\nAdmin URL: http://127.0.0.1:3200/admin\nUsername: ${username}\nPassword: ${password}\n\nDo not commit or reuse these development credentials in production.\n`, { mode: 0o600 });
  console.log('Generated local admin access: .local-data/admin-access.txt (password not printed).');
} else if (!has('ADMIN_SESSION_SECRET')) set('ADMIN_SESSION_SECRET', randomBytes(48).toString('base64url'));
await writeFile(envPath, text.trimStart().trimEnd() + '\n', { mode: 0o600 });
console.log('Local settings saved in ignored .env.local. Run npm run db:local, then build/start the app.');
