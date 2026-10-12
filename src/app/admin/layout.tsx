import React from "react";
import Link from "next/link";
import AdminUserMenu from "@/components/admin/AdminUserMenu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-[#FBF9F5] text-[#1C241E] p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-gray-500 hover:text-black transition">
            ← Storefront
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/admin/products" className="hover:underline">Products</Link>
          <Link href="/admin/receive-batch" className="hover:underline">Receive Batch</Link>
          <Link href="/admin/batches" className="hover:underline">Batches</Link>
          <Link href="/admin/offline-sale" className="hover:underline">Offline Sale</Link>
          <Link href="/admin/movement-history" className="hover:underline">Movements</Link>
          <Link href="/admin/orders" className="hover:underline">Orders</Link>
          <Link href="/admin/delivery-areas" className="hover:underline">Delivery Areas</Link>
        </nav>
        <AdminUserMenu />
      </header>
      {children}
    </section>
  );
}
