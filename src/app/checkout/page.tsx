import React from "react";
import Link from "next/link";
import { getDeliveryAreas } from "@/lib/data";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | The Vanvasi Project",
  description: "Complete your butter order for Kathmandu delivery or Lazimpat pickup.",
};

export default async function CheckoutPage() {
  const deliveryAreas = await getDeliveryAreas();

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C241E] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 sm:px-10 pt-28 pb-20 w-full">
        <div className="mb-8">
          <Link
            href="/#flavours"
            className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#5E6961] hover:text-[#1F3A2B] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-[#1F3A2B]">
            Checkout &amp; Fulfilment
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6961] font-sans mt-1">
            Pick up fresh at Lazimpat or receive home delivery within Kathmandu.
          </p>
        </div>

        <CheckoutForm deliveryAreas={deliveryAreas} />
      </main>

      <Footer />
    </div>
  );
}
