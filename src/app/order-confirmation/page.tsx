import React, { Suspense } from "react";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { OrderConfirmationView } from "@/components/shop/OrderConfirmationView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Received | The Vanvasi Project",
  description: "Your flavoured butter order details and fulfilment instructions.",
};

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C241E] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 sm:px-10 pt-28 pb-20 w-full">
        <Suspense
          fallback={
            <div className="p-12 text-center font-sans text-xs text-[#5E6961]">
              Loading order confirmation...
            </div>
          }
        >
          <OrderConfirmationView />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
