import React from "react";
import { getOrder } from "@/lib/data";
import Link from "next/link";

export default async function OrderDetail({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    return (
      <section className="min-h-screen bg-[#FBF9F5] text-[#1C241E] p-6 max-w-4xl">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h1 className="text-xl font-bold text-red-600 mb-2">Order Not Found</h1>
          <p className="text-sm text-gray-600 mb-4">
            Could not find order with ID &quot;{orderId}&quot;.
          </p>
          <Link href="/admin/orders" className="text-sm text-[#1F3A2B] underline">
            ← Back to orders
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#FBF9F5] text-[#1C241E] p-6 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A2B]">Order {order.orderNumber}</h1>
          <p className="text-xs text-gray-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString("en-GB")}
          </p>
        </div>
        <Link href="/admin/orders" className="text-xs text-[#1F3A2B] hover:underline">
          ← Back to orders
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs space-y-2 text-xs">
          <h2 className="font-bold text-sm text-[#1F3A2B] border-b pb-2 mb-3">
            Customer Information
          </h2>
          <div>
            <span className="text-gray-500">Name:</span>{" "}
            <span className="font-medium text-[#1C241E]">{order.customerName}</span>
          </div>
          <div>
            <span className="text-gray-500">Phone:</span>{" "}
            <span className="font-medium text-[#1C241E]">{order.customerPhone}</span>
          </div>
          <div>
            <span className="text-gray-500">Email:</span>{" "}
            <span className="font-medium text-[#1C241E]">{order.customerEmail || "N/A"}</span>
          </div>
          {order.customerNotes && (
            <div className="pt-2 border-t mt-2">
              <span className="text-gray-500 block">Customer Notes:</span>
              <span className="text-gray-700 italic">{order.customerNotes}</span>
            </div>
          )}
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs space-y-2 text-xs">
          <h2 className="font-bold text-sm text-[#1F3A2B] border-b pb-2 mb-3">
            Fulfilment &amp; Payment
          </h2>
          <div>
            <span className="text-gray-500">Mode:</span>{" "}
            <span className="font-bold uppercase tracking-wider text-[#1F3A2B]">
              {order.fulfilmentType}
            </span>
          </div>
          {order.deliveryAddress && (
            <div>
              <span className="text-gray-500">Address:</span>{" "}
              <span className="font-medium">{order.deliveryAddress}</span>
            </div>
          )}
          <div>
            <span className="text-gray-500">Order Status:</span>{" "}
            <span className="font-semibold text-green-700 uppercase">
              {order.orderStatus.replace("_", " ")}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Payment:</span>{" "}
            <span className="font-medium">
              {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
            </span>
          </div>
          <div className="pt-2 border-t mt-2 flex justify-between font-bold text-sm text-[#1F3A2B]">
            <span>Total:</span>
            <span>NPR {order.totalAmount}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs mb-6">
        <h2 className="font-bold text-sm text-[#1F3A2B] p-4 border-b bg-[#FBF9F5]">
          Order Items &amp; Assigned Batches
        </h2>
        <table className="w-full table-auto border-collapse text-left text-xs">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Product</th>
              <th className="p-3 font-semibold text-gray-700">Variant</th>
              <th className="p-3 font-semibold text-gray-700">Qty</th>
              <th className="p-3 font-semibold text-gray-700">Unit Price</th>
              <th className="p-3 font-semibold text-gray-700">Total</th>
              <th className="p-3 font-semibold text-gray-700">Allocated Batches</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="p-3 font-medium text-[#1F3A2B]">{item.productName}</td>
                <td className="p-3 text-gray-600">{item.variantSize}</td>
                <td className="p-3 font-semibold">{item.quantity}</td>
                <td className="p-3 text-gray-600">NPR {item.unitPrice}</td>
                <td className="p-3 font-bold text-[#1F3A2B]">NPR {item.totalPrice}</td>
                <td className="p-3">
                  {item.batches && item.batches.length > 0 ? (
                    <ul className="space-y-1">
                      {item.batches.map((b) => (
                        <li key={b.id} className="font-mono text-gray-700">
                          {b.batchCode} ({b.quantity} {b.quantity === 1 ? "jar" : "jars"})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">Auto-allocated</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
