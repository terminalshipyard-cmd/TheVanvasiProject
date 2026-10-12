import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      variants: true,
      images: true,
    },
  });

  return (
    <section className="min-h-screen bg-[#FBF9F5] text-[#1C241E] p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A2B]">Product Catalog</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your butter varieties, packaging variants, and catalog visibility.
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="bg-[#1F3A2B] hover:bg-[#162a1f] text-white text-xs font-semibold px-4 py-2.5 rounded-md transition shadow-sm"
        >
          + Add New Product
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-2xs">
        <table className="w-full table-auto border-collapse text-left text-sm">
          <thead className="bg-[#E8B931]/10 border-b border-gray-200">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Product</th>
              <th className="p-3 font-semibold text-gray-700">Slug</th>
              <th className="p-3 font-semibold text-gray-700">Variants</th>
              <th className="p-3 font-semibold text-gray-700">Status</th>
              <th className="p-3 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition">
                <td className="p-3 font-medium text-[#1F3A2B]">
                  <div>{p.name}</div>
                  {p.characterTitle && (
                    <div className="text-xs text-gray-400 font-normal">{p.characterTitle}</div>
                  )}
                </td>
                <td className="p-3 text-xs text-gray-500 font-mono">/{p.slug}</td>
                <td className="p-3 text-xs text-gray-600">
                  {p.variants.map((v) => `${v.size} (NPR ${v.price})`).join(", ") || "None"}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      p.isActive
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {p.isActive ? "Active" : "Draft"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-xs font-medium text-[#1F3A2B] hover:underline bg-[#FBF9F5] border border-gray-300 px-3 py-1.5 rounded-md"
                  >
                    Edit Product
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
