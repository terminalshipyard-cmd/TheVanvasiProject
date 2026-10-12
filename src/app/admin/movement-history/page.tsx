import React from "react";
import { getInventoryMovements } from "@/lib/data";

export default async function MovementHistory() {
  const movements = await getInventoryMovements();

  return (
    <section className="min-h-screen bg-[#FBF9F5] text-[#1C241E] p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1F3A2B]">Inventory Movement Audit Log</h1>
        <p className="text-xs text-gray-500 mt-1">
          Complete, tamper-evident audit trail of batch intakes, orders, walk-in sales, write-offs, and adjustments.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-2xs">
        <table className="w-full table-auto border-collapse text-left text-sm">
          <thead className="bg-[#E8B931]/10 border-b border-gray-200">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Timestamp</th>
              <th className="p-3 font-semibold text-gray-700">Type</th>
              <th className="p-3 font-semibold text-gray-700">Flavour &amp; Size</th>
              <th className="p-3 font-semibold text-gray-700">Batch</th>
              <th className="p-3 font-semibold text-gray-700">Change</th>
              <th className="p-3 font-semibold text-gray-700">Reason / Reference</th>
              <th className="p-3 font-semibold text-gray-700">Logged By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {movements.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-xs text-gray-400">
                  No inventory movements recorded yet.
                </td>
              </tr>
            ) : (
              movements.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(m.timestamp).toLocaleString("en-GB", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        m.type === "batch_in"
                          ? "bg-green-100 text-green-800"
                          : m.type === "order" || m.type === "offline_sale"
                          ? "bg-blue-100 text-blue-800"
                          : m.type === "write_off"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {m.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3 text-xs">
                    <div className="font-medium text-[#1F3A2B]">{m.productName}</div>
                    <div className="text-gray-400">{m.variantSize}</div>
                  </td>
                  <td className="p-3 text-xs font-mono font-medium">{m.batchCode}</td>
                  <td className="p-3 text-xs font-bold">
                    <span
                      className={
                        m.changeAmount > 0
                          ? "text-green-700"
                          : m.changeAmount < 0
                          ? "text-red-700"
                          : "text-gray-700"
                      }
                    >
                      {m.changeAmount > 0 ? `+${m.changeAmount}` : m.changeAmount}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-gray-600 max-w-xs truncate">{m.reason}</td>
                  <td className="p-3 text-xs text-gray-500">{m.createdBy}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
