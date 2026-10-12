"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BatchRow {
  id: string;
  batchCode: string;
  variantId: string;
  madeOn: string;
  bestBefore: string;
  quantityReceived: number;
  quantityRemaining: number;
  productName: string;
  variantSize: string;
  price: number;
}

export default function AdminBatchesClient({ initialBatches }: { initialBatches: BatchRow[] }) {
  const router = useRouter();
  const [batches, setBatches] = useState(initialBatches);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleWriteOff = async (batchId: string, batchCode: string) => {
    if (!confirm(`Are you sure you want to write off all remaining units of batch ${batchCode}?`)) {
      return;
    }

    setLoadingId(batchId);
    setMessage("");

    try {
      const res = await fetch("/api/admin/batches/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId, action: "write_off" }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to write off batch.");
      } else {
        setMessage(`✓ Batch ${batchCode} written off successfully.`);
        setBatches((prev) =>
          prev.map((b) => (b.id === batchId ? { ...b, quantityRemaining: 0 } : b))
        );
        router.refresh();
      }
    } catch {
      alert("Network error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleAdjust = async (batchId: string, batchCode: string, currentQty: number) => {
    const input = prompt(
      `Adjust stock for ${batchCode} (Current: ${currentQty}).\nEnter amount to add (+) or subtract (-):`,
      "0"
    );
    if (!input) return;

    const amount = parseInt(input, 10);
    if (isNaN(amount) || amount === 0) {
      alert("Please enter a valid non-zero adjustment amount.");
      return;
    }

    setLoadingId(batchId);
    setMessage("");

    try {
      const res = await fetch("/api/admin/batches/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId,
          action: "adjust",
          amount,
          reason: "Manual admin stock count adjustment",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to adjust batch.");
      } else {
        setMessage(`✓ Batch ${batchCode} stock updated to ${data.newRemaining}.`);
        setBatches((prev) =>
          prev.map((b) =>
            b.id === batchId ? { ...b, quantityRemaining: data.newRemaining } : b
          )
        );
        router.refresh();
      }
    } catch {
      alert("Network error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="min-h-screen bg-[#FBF9F5] text-[#1C241E] p-6 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A2B]">Batch Inventory</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time batch stock tracking with live manual adjustment and write-off logging.
          </p>
        </div>
        <Link
          href="/admin/receive-batch"
          className="bg-[#1F3A2B] hover:bg-[#162a1f] text-white text-xs font-semibold px-4 py-2.5 rounded-md transition shadow-sm"
        >
          + Receive New Batch
        </Link>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-xs text-green-800 rounded-md">
          {message}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-2xs">
        <table className="w-full table-auto border-collapse text-left text-sm">
          <thead className="bg-[#E8B931]/10 border-b border-gray-200">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Batch Code</th>
              <th className="p-3 font-semibold text-gray-700">Product &amp; Variant</th>
              <th className="p-3 font-semibold text-gray-700">Best Before</th>
              <th className="p-3 font-semibold text-gray-700">Received</th>
              <th className="p-3 font-semibold text-gray-700">Remaining</th>
              <th className="p-3 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {batches.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition">
                <td className="p-3 font-mono text-xs font-semibold text-[#1F3A2B]">
                  {b.batchCode}
                </td>
                <td className="p-3 text-xs">
                  <div className="font-medium text-[#1F3A2B]">{b.productName}</div>
                  <div className="text-gray-400">{b.variantSize}</div>
                </td>
                <td className="p-3 text-xs text-gray-600">{b.bestBefore}</td>
                <td className="p-3 text-xs text-gray-600">{b.quantityReceived}</td>
                <td className="p-3 text-xs font-bold">
                  <span
                    className={
                      b.quantityRemaining <= 3
                        ? "text-red-600"
                        : b.quantityRemaining <= 8
                        ? "text-amber-600"
                        : "text-[#1F3A2B]"
                    }
                  >
                    {b.quantityRemaining}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => handleAdjust(b.id, b.batchCode, b.quantityRemaining)}
                    disabled={loadingId === b.id}
                    className="px-2.5 py-1 text-xs bg-[#1F3A2B] hover:bg-[#162a1f] text-white rounded-md transition disabled:opacity-50"
                  >
                    Adjust
                  </button>
                  <button
                    onClick={() => handleWriteOff(b.id, b.batchCode)}
                    disabled={loadingId === b.id || b.quantityRemaining <= 0}
                    className="px-2.5 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md transition disabled:opacity-50"
                  >
                    Write-Off
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
