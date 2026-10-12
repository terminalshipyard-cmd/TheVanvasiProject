import React from "react";

export const metadata = {
  title: "Admin Dashboard | Vanvasi",
  description: "Manage inventory, orders, and settings for Vanvasi project.",
};

export default function AdminPage() {
  return (
    <section className="min-h-screen bg-[#FBF9F5] text-[#1C241E] p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-6">
        This is a placeholder admin area. Here you can add inventory management, order
        tracking, and other administrative tools.
      </p>
      {/* Example placeholder cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 border rounded-md bg-white/80 shadow-sm">
          <h2 className="font-semibold mb-2">Inventory</h2>
          <p className="text-sm text-gray-600">Manage product stock and variants.</p>
        </div>
        <div className="p-4 border rounded-md bg-white/80 shadow-sm">
          <h2 className="font-semibold mb-2">Orders</h2>
          <p className="text-sm text-gray-600">View and process customer orders.</p>
        </div>
        <div className="p-4 border rounded-md bg-white/80 shadow-sm">
          <h2 className="font-semibold mb-2">Settings</h2>
          <p className="text-sm text-gray-600">Configure site settings and branding.</p>
        </div>
      </div>
    </section>
  );
}
