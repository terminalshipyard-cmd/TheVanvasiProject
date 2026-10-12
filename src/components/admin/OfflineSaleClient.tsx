"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface VariantOption {
  id: string;
  sku: string;
  size: string;
  price: number;
  productName: string;
}

interface BatchOption {
  id: string;
  batchCode: string;
  variantId: string;
  quantityRemaining: number;
}

export default function OfflineSaleClient({
  variants,
  batches,
}: {
  variants: VariantOption[];
  batches: BatchOption[];
}) {
  const router = useRouter();
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [batchId, setBatchId] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedVariant = variants.find((v) => v.id === variantId);
  const availableBatches = batches.filter((b) => b.variantId === variantId);
  const totalAmount = selectedVariant
    ? selectedVariant.price * (parseInt(quantity, 10) || 0)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!variantId || !quantity) {
      setError("Please select a variant and quantity.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/offline-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId,
          quantity,
          batchId: batchId || null,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to record sale.");
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        router.refresh();
        setTimeout(() => {
          router.push("/admin/orders");
        }, 1200);
      }
    } catch {
      setError("Network error occurred.");
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#FBF9F5] text-[#1C241E] p-6 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A2B]">Record Offline / Walk-in Sale</h1>
          <p className="text-xs text-gray-500 mt-1">
            Log direct counter purchases at Lazimpat with instant inventory batch deductions.
          </p>
        </div>
        <Link href="/admin/orders" className="text-xs text-[#1F3A2B] hover:underline">
          ← View Orders
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded-md">
          ✓ Walk-in purchase recorded successfully! Order saved to database.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-6 shadow-2xs space-y-5"
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Product Variant *
          </label>
          <select
            required
            value={variantId}
            onChange={(e) => {
              setVariantId(e.target.value);
              setBatchId("");
            }}
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
          >
            <option value="">Select flavour and size</option>
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.productName} — {v.size} (NPR {v.price})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Quantity Sold *
          </label>
          <input
            type="number"
            required
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Deduct from Specific Batch (Optional)
          </label>
          <select
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            disabled={!variantId}
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B] disabled:bg-gray-50"
          >
            <option value="">Auto-deduct using FIFO (oldest batches first)</option>
            {availableBatches.map((b) => (
              <option key={b.id} value={b.id}>
                Batch {b.batchCode} ({b.quantityRemaining} jars left in stock)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Notes / Reference
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Paid in cash at bakery counter"
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
          />
        </div>

        {selectedVariant && (
          <div className="p-4 bg-[#FBF9F5] border border-gray-200 rounded-md flex justify-between items-center text-sm font-medium">
            <span>Total Collected:</span>
            <span className="text-base font-bold text-[#1F3A2B]">NPR {totalAmount}</span>
          </div>
        )}

        <div className="pt-2 flex justify-end gap-3 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm bg-[#1F3A2B] hover:bg-[#162a1f] text-white rounded-md font-medium transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Recording Sale..." : "Record Sale & Deduct Stock"}
          </button>
        </div>
      </form>
    </section>
  );
}
