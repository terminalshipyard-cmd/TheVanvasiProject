"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface VariantOption {
  id: string;
  sku: string;
  size: string;
  productName: string;
}

export default function ReceiveBatchClient({ variants }: { variants: VariantOption[] }) {
  const router = useRouter();
  const [batchCode, setBatchCode] = useState("");
  const [variantId, setVariantId] = useState("");
  const [quantityReceived, setQuantityReceived] = useState("");
  const [madeOn, setMadeOn] = useState(() => new Date().toISOString().split("T")[0]);
  const [bestBefore, setBestBefore] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return d.toISOString().split("T")[0];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!batchCode.trim() || !variantId || !quantityReceived || !madeOn || !bestBefore) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/batches/receive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchCode,
          variantId,
          quantityReceived,
          madeOn,
          bestBefore,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to intake batch.");
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        router.refresh();
        setTimeout(() => {
          router.push("/admin/batches");
        }, 1200);
      }
    } catch {
      setError("Network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#FBF9F5] text-[#1C241E] p-6 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A2B]">Intake Received Batch</h1>
          <p className="text-xs text-gray-500 mt-1">
            Record fresh butter kitchen batches into live inventory with automatic movement tracking.
          </p>
        </div>
        <Link href="/admin/batches" className="text-xs text-[#1F3A2B] hover:underline">
          ← Back to Batches
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded-md">
          ✓ Batch {batchCode} recorded into live inventory! Redirecting...
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-6 shadow-2xs space-y-5"
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Batch Code *
          </label>
          <input
            type="text"
            required
            value={batchCode}
            onChange={(e) => setBatchCode(e.target.value.toUpperCase())}
            placeholder="e.g. HHB-100-26B"
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Product Variant *
          </label>
          <select
            required
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
          >
            <option value="">Select product variant</option>
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.productName} — {v.size} ({v.sku})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Quantity Received (Jars) *
          </label>
          <input
            type="number"
            required
            min="1"
            value={quantityReceived}
            onChange={(e) => setQuantityReceived(e.target.value)}
            placeholder="e.g. 50"
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Churned / Made On *
            </label>
            <input
              type="date"
              required
              value={madeOn}
              onChange={(e) => setMadeOn(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Best Before Date *
            </label>
            <input
              type="date"
              required
              value={bestBefore}
              onChange={(e) => setBestBefore(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3 border-t">
          <Link
            href="/admin/batches"
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm bg-[#1F3A2B] hover:bg-[#162a1f] text-white rounded-md font-medium transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Recording Batch..." : "Receive Batch"}
          </button>
        </div>
      </form>
    </section>
  );
}
