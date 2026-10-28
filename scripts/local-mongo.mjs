import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());
process.env.MONGOMS_DOWNLOAD_DIR ??= resolve('.local-data/mongodb-binaries');
const dbPath = resolve('.local-data/mongodb');
await mkdir(dbPath, { recursive: true });
const server = await MongoMemoryServer.create({ instance: { ip: '127.0.0.1', port: 27019, dbPath, storageEngine: 'wiredTiger', dbName: 'tebunai_dev' } });
if (new URL(server.getUri()).port !== '27019') { await server.stop({ doCleanup: false }); throw new Error('Port 27019 is already in use. Stop the conflicting local process before starting this database.'); }
console.log('Local MongoDB ready on 127.0.0.1:27019. Data persists in .local-data/mongodb. Keep this process running.');
let stopping = false;
async function stop() { if (stopping) return; stopping = true; await server.stop({ doCleanup: false }); process.exit(0); }
process.on('SIGINT', stop); process.on('SIGTERM', stop);
setInterval(() => {}, 60_000);
