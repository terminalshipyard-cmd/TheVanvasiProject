import React from "react";
import Link from "next/link";
import { getOrders } from "@/lib/data";

export default async function AdminOrders() {
  const orders = await getOrders();

  return (
    <section className="min-h-screen bg-[#FBF9F5] text-[#1C241E] p-6 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A2B]">Customer &amp; Counter Orders</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time orders placed via online storefront checkout and Lazimpat walk-ins.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-2xs">
        <table className="w-full table-auto border-collapse text-left text-sm">
          <thead className="bg-[#E8B931]/10 border-b border-gray-200">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Order #</th>
              <th className="p-3 font-semibold text-gray-700">Date</th>
              <th className="p-3 font-semibold text-gray-700">Customer</th>
              <th className="p-3 font-semibold text-gray-700">Fulfilment</th>
              <th className="p-3 font-semibold text-gray-700">Status</th>
              <th className="p-3 font-semibold text-gray-700">Total</th>
              <th className="p-3 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-xs text-gray-400">
                  No orders recorded yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-3 font-mono text-xs font-bold text-[#1F3A2B]">
                    {o.orderNumber}
                  </td>
                  <td className="p-3 text-xs text-gray-500">
                    {new Date(o.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3 text-xs">
                    <div className="font-medium text-[#1F3A2B]">{o.customerName}</div>
                    <div className="text-gray-400">{o.customerPhone}</div>
                  </td>
                  <td className="p-3 text-xs capitalize text-gray-600">
                    <span
                      className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        o.fulfilmentType === "pickup"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {o.fulfilmentType}
                    </span>
                  </td>
                  <td className="p-3 text-xs">
                    <span
                      className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        o.orderStatus === "completed"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : o.orderStatus === "cancelled"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {o.orderStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3 text-xs font-bold text-[#1F3A2B]">
                    NPR {o.totalAmount}
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-xs font-medium text-[#1F3A2B] hover:underline bg-[#FBF9F5] border border-gray-300 px-3 py-1.5 rounded-md"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
