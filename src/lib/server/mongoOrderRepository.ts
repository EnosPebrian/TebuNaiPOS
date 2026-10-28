import "server-only";
import type { Order } from "@/domain/order/Order";
import type { ManagedOrder, OrderEvent } from "@/domain/order/lifecycle";
import { kitchenStatuses } from "@/domain/order/lifecycle";
import type { OrderRepository } from "@/domain/order/order.repository";
import { database } from "./database";
import { HttpError } from "./http";

interface OrderDocument extends ManagedOrder { _id: string; requestKey: string; fingerprint: string }
const publicRecord = (doc: OrderDocument): ManagedOrder => ({ order: doc.order, version: doc.version, updatedAt: doc.updatedAt, history: doc.history });
async function collection() { return (await database()).collection<OrderDocument>("orders"); }

export const orderRepository: OrderRepository = {
  async create(order, requestKey, fingerprint, actor = "customer") {
    const records = await collection();
    const document: OrderDocument = { _id: order.id, requestKey, fingerprint, order, version: 0, updatedAt: order.createdAt, history: [{ at: order.createdAt, actor, status: order.status, paymentStatus: order.paymentStatus, deliveryFee: order.deliveryFee, total: order.total, note: order.source === "counter" ? `Counter order accepted by staff. Payment ${order.paymentStatus === "paid" ? "received and recorded" : "not received"}.` : "Order request saved at checkout." }] };
    try { await records.insertOne(document); return order; }
    catch (error) {
      if (!(error && typeof error === "object" && "code" in error && error.code === 11000)) throw error;
      const previous = await records.findOne({ requestKey });
      if (!previous || previous.fingerprint !== fingerprint) throw new HttpError(409, "This checkout request has changed. Prepare it again.");
      return previous.order;
    }
  },
  async get(id) { const doc = await (await collection()).findOne({ _id: id }); return doc ? publicRecord(doc) : null; },
  async list(page, status, view = "orders") {
    const query = status ? { "order.status": status } : view === "kitchen" ? { "order.status": { $in: [...kitchenStatuses] } } : {};
    const records = await collection();
    const direction = view === "kitchen" ? 1 : -1;
    const [docs, total] = await Promise.all([records.find(query).sort({ "order.createdAt": direction, _id: direction }).skip((page - 1) * 20).limit(20).toArray(), records.countDocuments(query)]);
    return { orders: docs.map(publicRecord), total };
  },
  async update(id, version, order: Order, event: OrderEvent) {
    const result = await (await collection()).findOneAndUpdate({ _id: id, version }, { $set: { order, updatedAt: event.at }, $inc: { version: 1 }, $push: { history: event } }, { returnDocument: "after" });
    return result ? publicRecord(result) : null;
  },
};
