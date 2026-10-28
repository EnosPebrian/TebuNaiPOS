import { spawn } from 'node:child_process';
import { randomBytes, scryptSync } from 'node:crypto';
import { resolve } from 'node:path';
import nextEnv from '@next/env';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

nextEnv.loadEnvConfig(process.cwd());
process.env.MONGOMS_DOWNLOAD_DIR ??= resolve('.local-data/mongodb-binaries');
const server = await MongoMemoryServer.create({ instance: { ip: '127.0.0.1', dbName: 'tebunai_e2e' } });
const password = randomBytes(24).toString('base64url');
const salt = randomBytes(16).toString('hex');
const child = spawn(process.execPath, [resolve('node_modules/@playwright/test/cli.js'), 'test', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, MONGODB_URI: server.getUri(), MONGODB_DB: 'tebunai_e2e', APP_ORIGIN: 'http://127.0.0.1:3100', ADMIN_USERNAME: 'e2e-owner', ADMIN_PASSWORD_HASH: `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`, ADMIN_SESSION_SECRET: randomBytes(48).toString('base64url'), E2E_ADMIN_PASSWORD: password },
});
let stopping = false;
async function cleanup() { if (stopping) return; stopping = true; await server.stop(); }
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { child.kill(signal); void cleanup(); });
child.on('error', async () => { await cleanup(); process.exit(1); });
child.on('exit', async (code) => { await cleanup(); process.exit(code ?? 1); });
