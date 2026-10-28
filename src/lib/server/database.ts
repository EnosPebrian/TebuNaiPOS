import "server-only";
import { MongoClient } from "mongodb";
import { HttpError, appOrigin } from "./http";

let connection: Promise<MongoClient> | undefined;
let indexes: Promise<void> | undefined;
export function ordersConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI && /^[a-zA-Z0-9_-]{1,64}$/.test(process.env.MONGODB_DB ?? "") && appOrigin());
}
export async function database() {
  if (!ordersConfigured()) throw new HttpError(503, "Online saving is unavailable until the store configures its database.");
  connection ??= new MongoClient(process.env.MONGODB_URI!, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000, maxPoolSize: 10 }).connect().catch((error: unknown) => { connection = undefined; throw error; });
  const db = (await connection).db(process.env.MONGODB_DB!);
  indexes ??= Promise.all([
    db.collection("orders").createIndex({ requestKey: 1 }, { unique: true }),
    db.collection("orders").createIndex({ "order.createdAt": -1 }),
    db.collection("orders").createIndex({ "history.paymentStatus": 1, "history.at": 1 }),
    db.collection("orders").createIndex({ "order.status": 1, "order.createdAt": -1 }),
    db.collection("rate_limits").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]).then(() => undefined).catch((error: unknown) => { indexes = undefined; throw error; });
  await indexes;
  return db;
}
export async function enforceLimit(bucket: string, max: number, windowMs: number) {
  const now = Date.now();
  const collection = (await database()).collection<{ _id: string; count: number; expiresAt: Date }>("rate_limits");
  const id = `${bucket}:${Math.floor(now / windowMs)}`;
  const update = { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(now + windowMs * 2) } };
  let result;
  try { result = await collection.findOneAndUpdate({ _id: id }, update, { upsert: true, returnDocument: "after" }); }
  catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === 11000)) throw error;
    result = await collection.findOneAndUpdate({ _id: id }, update, { returnDocument: "after" });
  }
  if (!result || result.count > max) throw new HttpError(429, "Too many requests. Please wait before trying again.");
}
