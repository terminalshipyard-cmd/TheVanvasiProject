import React from "react";
import { getDashboardStockSummary } from "@/lib/data";
import Link from "next/link";

export default async function AdminDashboard() {
  const { expiringBatches, expiredWithStock, lowStockVariants } =
    await getDashboardStockSummary();

  return (
    <section className="min-h-screen bg-[#FBF9F5] text-[#1C241E] p-6 max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A2B]">Admin Inventory Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time shelf-life tracking, expiry alerts, and stock safety thresholds.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/receive-batch"
            className="text-xs bg-[#1F3A2B] text-white px-3.5 py-2 rounded-md font-medium hover:bg-[#162a1f]"
          >
            + Intake Batch
          </Link>
          <Link
            href="/admin/offline-sale"
            className="text-xs bg-[#E8B931] text-[#1C241E] px-3.5 py-2 rounded-md font-medium hover:bg-[#d4a82b]"
          >
            + Offline Sale
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Expiring Batches */}
        <div className="p-5 border border-amber-200 rounded-lg bg-amber-50/50 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm text-amber-900">Expiring Batches (≤14d)</h2>
            <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
              {expiringBatches.length}
            </span>
          </div>
          {expiringBatches.length === 0 ? (
            <p className="text-xs text-gray-500">No batches near expiry.</p>
          ) : (
            <ul className="space-y-2 text-xs">
              {expiringBatches.map((b) => (
                <li key={b.id} className="p-2 bg-white rounded border border-amber-200/60">
                  <div className="font-medium text-[#1F3A2B]">
                    {b.productName} ({b.variantSize})
                  </div>
                  <div className="text-gray-500 mt-0.5">
                    Batch: <span className="font-mono">{b.batchCode}</span> • {b.quantityRemaining} left
                  </div>
                  <div className="text-amber-700 font-semibold mt-0.5">
                    Expires in {b.daysRemaining} days ({b.bestBefore})
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Expired Stock */}
        <div className="p-5 border border-red-200 rounded-lg bg-red-50/50 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm text-red-900">Expired Stock (Write-off)</h2>
            <span className="text-xs bg-red-200 text-red-900 font-bold px-2 py-0.5 rounded-full">
              {expiredWithStock.length}
            </span>
          </div>
          {expiredWithStock.length === 0 ? (
            <p className="text-xs text-gray-500">No expired batches in inventory.</p>
          ) : (
            <ul className="space-y-2 text-xs">
              {expiredWithStock.map((b) => (
                <li key={b.id} className="p-2 bg-white rounded border border-red-200/60">
                  <div className="font-medium text-red-800">
                    {b.productName} ({b.variantSize})
                  </div>
                  <div className="text-gray-500 mt-0.5">
                    Batch: <span className="font-mono">{b.batchCode}</span> • {b.quantityRemaining} units
                  </div>
                  <div className="text-red-600 mt-1">
                    Expired on {b.bestBefore}
                  </div>
                  <Link
                    href="/admin/batches"
                    className="inline-block mt-2 text-[11px] bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  >
                    Go to Write-Off
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Low Stock Variants */}
        <div className="p-5 border border-blue-200 rounded-lg bg-blue-50/50 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm text-blue-900">Low Stock Variants (≤5)</h2>
            <span className="text-xs bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded-full">
              {lowStockVariants.length}
            </span>
          </div>
          {lowStockVariants.length === 0 ? (
            <p className="text-xs text-gray-500">All variant stocks are healthy.</p>
          ) : (
            <ul className="space-y-2 text-xs">
              {lowStockVariants.map((v) => (
                <li key={v.id} className="p-2 bg-white rounded border border-blue-200/60">
                  <div className="font-medium text-[#1F3A2B]">
                    {v.productName} ({v.size})
                  </div>
                  <div className="text-gray-500 mt-0.5">SKU: {v.sku}</div>
                  <div className="text-blue-700 font-bold mt-0.5">
                    {v.sellableStock} sellable {v.sellableStock === 1 ? "jar" : "jars"} remaining
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
