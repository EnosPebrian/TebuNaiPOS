import "server-only";
import type { Order } from "@/domain/order/Order";
import type { ManagedOrder, OrderEvent } from "@/domain/order/lifecycle";
import { kitchenStatuses } from "@/domain/order/lifecycle";
import type { OrderRepository } from "@/domain/order/order.repository";
import { database } from "./database";
import { HttpError } from "./http";
import { summarizeOrders, type ReportRecord } from "@/domain/order/report";
import { reportRange } from "@/domain/order/report";
import type { Filter } from "mongodb";

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
  async report(range) {
    const period = { $gte: range.start, $lt: range.end };
    const docs = await (await collection()).find({ $or: [{ "order.createdAt": period }, { history: { $elemMatch: { paymentStatus: "paid", at: period } } }] }, { projection: { _id: 0, "order.id": 1, "order.createdAt": 1, "order.source": 1, "order.status": 1, "order.paymentStatus": 1, "order.subtotal": 1, "order.deliveryFee": 1, "order.total": 1, "order.items.productId": 1, "order.items.productName": 1, "order.items.variantId": 1, "order.items.variantLabel": 1, "order.items.quantity": 1, "order.items.unitPrice": 1, "history.at": 1, "history.paymentStatus": 1, "history.total": 1 }, maxTimeMS: 10_000 }).limit(5001).toArray();
    if (docs.length > 5000) throw new HttpError(413, "This report exceeds 5,000 orders. Choose a shorter date range.");
    return summarizeOrders(docs.map((doc) => ({ ...doc.order, history: doc.history }) as ReportRecord), range);
  },
  async list(page, status, view = "orders", filters = {}) {
    const query: Filter<OrderDocument> = status ? { "order.status": status } : view === "kitchen" ? { "order.status": { $in: [...kitchenStatuses] } } : {};
    if (filters.reference) query._id = filters.reference.length === 36 ? filters.reference : { $regex: `^${filters.reference}` };
    if (filters.payment) query["order.paymentStatus"] = filters.payment;
    if (filters.source) query["order.source"] = filters.source === "counter" ? "counter" : { $ne: "counter" };
    if (filters.method) query["order.fulfillment.method"] = filters.method;
    if (filters.driver) { query["order.fulfillment.method"] = "delivery"; query["order.fulfillment.driver.name"] = filters.driver === "assigned" ? { $exists: true, $ne: "" } : { $exists: false }; }
    if (filters.from && filters.to) { const range = reportRange(filters.from, filters.to); query["order.createdAt"] = { $gte: range.start, $lt: range.end }; }
    const records = await collection();
    const direction = view === "kitchen" ? 1 : -1;
    const total = await records.countDocuments(query, { maxTimeMS: 5000 });
    const currentPage = Math.min(page, Math.max(1, Math.ceil(total / 20)));
    const docs = await records.find(query, { maxTimeMS: 5000 }).sort({ "order.createdAt": direction, _id: direction }).skip((currentPage - 1) * 20).limit(20).toArray();
    return { orders: docs.map(publicRecord), total, page: currentPage };
  },
  async update(id, version, order: Order, event: OrderEvent) {
    const result = await (await collection()).findOneAndUpdate({ _id: id, version }, { $set: { order, updatedAt: event.at }, $inc: { version: 1 }, $push: { history: event } }, { returnDocument: "after" });
    return result ? publicRecord(result) : null;
  },
};
