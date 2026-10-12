import React from "react";
import { getDeliveryAreas } from "@/lib/data";

export default async function DeliveryAreas() {
  const deliveryAreas = await getDeliveryAreas();

  return (
    <section className="min-h-screen bg-[#FBF9F5] text-[#1C241E] p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1F3A2B]">Delivery Areas &amp; Shipping Fees</h1>
        <p className="text-xs text-gray-500 mt-1">
          Active delivery zones and tariffs across Kathmandu Valley.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-2xs">
        <table className="w-full table-auto border-collapse text-left text-sm">
          <thead className="bg-[#E8B931]/10 border-b border-gray-200">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Area Zone</th>
              <th className="p-3 font-semibold text-gray-700">Delivery Fee (NPR)</th>
              <th className="p-3 font-semibold text-gray-700">Service Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {deliveryAreas.map((area) => (
              <tr key={area.id} className="hover:bg-gray-50/50 transition">
                <td className="p-3 font-medium text-[#1F3A2B]">{area.name}</td>
                <td className="p-3 font-semibold text-[#1C241E]">
                  {area.deliveryFee === 0 ? "FREE" : `NPR ${area.deliveryFee}`}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      area.isActive
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {area.isActive ? "Active Service" : "Disabled"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
