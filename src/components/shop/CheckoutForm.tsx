"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DeliveryArea, FulfilmentType } from "@/types";
import { useCart } from "@/context/CartContext";
import {
  MapPin,
  Truck,
  Store,
  Clock,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface CheckoutFormProps {
  deliveryAreas: DeliveryArea[];
}

export function CheckoutForm({ deliveryAreas }: CheckoutFormProps) {
  const router = useRouter();
  const { items, subtotalAmount, totalItems, clearCart } = useCart();

  const [fulfilmentType, setFulfilmentType] =
    useState<FulfilmentType>("delivery");
  const [selectedAreaId, setSelectedAreaId] = useState<string>(
    deliveryAreas[0]?.id || ""
  );
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedArea = deliveryAreas.find((a) => a.id === selectedAreaId);
  const deliveryFee = fulfilmentType === "pickup" ? 0 : selectedArea?.deliveryFee ?? 0;
  const totalAmount = subtotalAmount + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (items.length === 0) {
      setErrorMsg("Your basket is empty. Please add butter to continue.");
      return;
    }

    if (!customerName.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    if (!customerPhone.trim() || customerPhone.length < 9) {
      setErrorMsg("Please enter a valid phone number (e.g. 98XXXXXXXX).");
      return;
    }

    if (fulfilmentType === "delivery" && !deliveryAddress.trim()) {
      setErrorMsg("Please enter your street address or landmark in Kathmandu.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          fulfilmentType,
          deliveryAddress,
          deliveryAreaId: fulfilmentType === "delivery" ? selectedAreaId : null,
          customerNotes: orderNotes,
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Unable to place order. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const queryParams = new URLSearchParams({
        orderNumber: data.order.orderNumber,
        name: customerName,
        phone: customerPhone,
        fulfilment: fulfilmentType,
        area: selectedArea?.name || "",
        address: deliveryAddress,
        subtotal: subtotalAmount.toString(),
        fee: deliveryFee.toString(),
        total: totalAmount.toString(),
        itemsCount: totalItems.toString(),
      });

      clearCart();
      router.push(`/order-confirmation?${queryParams.toString()}`);
    } catch {
      setErrorMsg("A network error occurred while submitting your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white border border-[#E6DFD5] p-12 rounded-xs text-center max-w-lg mx-auto">
        <ShoppingBag className="w-12 h-12 text-[#1F3A2B]/50 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold uppercase text-[#1F3A2B] mb-2">
          Your Basket is Empty
        </h2>
        <p className="text-xs text-[#5E6961] font-sans mb-6">
          Add jars from our flavour collection before proceeding to checkout.
        </p>
        <button
          onClick={() => router.push("/#flavours")}
          className="px-6 py-3 bg-[#1F3A2B] text-white text-xs font-semibold uppercase tracking-widest font-sans rounded-xs hover:bg-[#2A4E3B] transition-colors"
        >
          Browse Flavours
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Left Column: Fulfillment & Details */}
      <div className="lg:col-span-7 space-y-8">
        {/* Prototype notice banner */}
        <div className="p-3.5 bg-[#FFF8E6] border border-[#E8B931]/40 rounded-xs flex items-center gap-2.5 text-xs text-[#7A5B0B] font-sans">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Phase A Prototype:</strong> Checkout demonstrates order placement &amp; stock allocation preview.
          </span>
        </div>

        {/* 1. Fulfillment Mode Toggle */}
        <div className="bg-white border border-[#E6DFD5] p-6 rounded-xs space-y-4">
          <h2 className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#1F3A2B]">
            1. Select Fulfilment Method
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFulfilmentType("delivery")}
              className={`p-4 rounded-xs border text-left flex items-start gap-3 transition-all ${
                fulfilmentType === "delivery"
                  ? "border-[#1F3A2B] bg-[#EBF0EC]/50 shadow-xs"
                  : "border-[#E6DFD5] bg-white hover:border-[#1F3A2B]/40"
              }`}
            >
              <Truck className="w-5 h-5 text-[#1F3A2B] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-serif font-bold text-sm text-[#1F3A2B]">
                  Kathmandu Delivery
                </p>
                <p className="text-[11px] text-[#5E6961] font-sans mt-0.5">
                  Direct to your door across Kathmandu Valley
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFulfilmentType("pickup")}
              className={`p-4 rounded-xs border text-left flex items-start gap-3 transition-all ${
                fulfilmentType === "pickup"
                  ? "border-[#1F3A2B] bg-[#EBF0EC]/50 shadow-xs"
                  : "border-[#E6DFD5] bg-white hover:border-[#1F3A2B]/40"
              }`}
            >
              <Store className="w-5 h-5 text-[#1F3A2B] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-serif font-bold text-sm text-[#1F3A2B]">
                  Lazimpat Pickup (Free)
                </p>
                <p className="text-[11px] text-[#5E6961] font-sans mt-0.5">
                  Collect from our kitchen workshop
                </p>
              </div>
            </button>
          </div>

          {/* Pickup details preview */}
          {fulfilmentType === "pickup" && (
            <div className="p-4 bg-[#FBF9F5] border border-[#E6DFD5] rounded-xs space-y-2 text-xs font-sans text-[#1C241E]">
              <div className="flex items-center gap-2 font-medium text-[#1F3A2B]">
                <MapPin className="w-4 h-4 text-[#1F3A2B]" />
                <span>Nursery Road, Lazimpat, Kathmandu</span>
              </div>
              <div className="flex items-center gap-2 text-[#5E6961]">
                <Clock className="w-4 h-4" />
                <span>Pickup Hours: 10:00 AM – 6:00 PM, Sunday to Friday</span>
              </div>
              <p className="text-[11px] text-[#5E6961] pt-1">
                We will prepare your butter jars and hold them chilled until you arrive.
              </p>
            </div>
          )}

          {/* Delivery Area Selection */}
          {fulfilmentType === "delivery" && (
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-sans font-medium text-[#1F3A2B]">
                Delivery Area (Kathmandu Valley Only)
              </label>
              <select
                value={selectedAreaId}
                onChange={(e) => setSelectedAreaId(e.target.value)}
                className="w-full p-3 bg-white border border-[#E6DFD5] rounded-xs text-xs font-sans text-[#1C241E] focus:outline-none focus:border-[#1F3A2B]"
              >
                {deliveryAreas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name} — NPR {area.deliveryFee}
                  </option>
                ))}
              </select>

              <div>
                <label className="block text-xs font-sans font-medium text-[#1F3A2B] mt-3 mb-1">
                  Street Address / Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. House No. 24, Near Shankar Hotel, Lazimpat"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-3 bg-white border border-[#E6DFD5] rounded-xs text-xs font-sans text-[#1C241E] focus:outline-none focus:border-[#1F3A2B]"
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Customer Details */}
        <div className="bg-white border border-[#E6DFD5] p-6 rounded-xs space-y-4">
          <h2 className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#1F3A2B]">
            2. Customer Details (Guest Checkout)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-medium text-[#1F3A2B] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Shrestha"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-3 bg-white border border-[#E6DFD5] rounded-xs text-xs font-sans text-[#1C241E] focus:outline-none focus:border-[#1F3A2B]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-[#1F3A2B] mb-1">
                Phone Number (for delivery call) *
              </label>
              <input
                type="tel"
                required
                placeholder="98XXXXXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-3 bg-white border border-[#E6DFD5] rounded-xs text-xs font-sans text-[#1C241E] focus:outline-none focus:border-[#1F3A2B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-[#1F3A2B] mb-1">
              Email Address (Optional, for confirmation receipt)
            </label>
            <input
              type="email"
              placeholder="maya@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full p-3 bg-white border border-[#E6DFD5] rounded-xs text-xs font-sans text-[#1C241E] focus:outline-none focus:border-[#1F3A2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-[#1F3A2B] mb-1">
              Order Notes / Delivery Instructions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Please leave at security gate or call upon arrival."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full p-3 bg-white border border-[#E6DFD5] rounded-xs text-xs font-sans text-[#1C241E] focus:outline-none focus:border-[#1F3A2B]"
            />
          </div>
        </div>

        {/* 3. Payment Mode */}
        <div className="bg-white border border-[#E6DFD5] p-6 rounded-xs space-y-4">
          <h2 className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#1F3A2B]">
            3. Payment Method
          </h2>

          <div className="p-4 border border-[#1F3A2B] bg-[#EBF0EC]/40 rounded-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#1F3A2B]" />
              <div>
                <p className="font-serif font-bold text-sm text-[#1F3A2B]">
                  {fulfilmentType === "pickup"
                    ? "Cash at Pickup (Lazimpat Counter)"
                    : "Cash on Delivery (COD)"}
                </p>
                <p className="text-[11px] text-[#5E6961] font-sans">
                  Pay in NPR when receiving your fresh butter jars.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#E8B931] bg-[#1F3A2B] px-2.5 py-1 rounded-full">
              Standard
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-[#E6DFD5] p-6 rounded-xs space-y-6 sticky top-24">
          <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-[#1F3A2B] pb-3 border-b border-[#F4EFE6]">
            Order Summary ({totalItems} {totalItems === 1 ? "jar" : "jars"})
          </h2>

          {/* Items */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex items-center justify-between gap-3 text-xs font-sans pb-3 border-b border-[#F4EFE6]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FBF9F5] border border-[#E6DFD5] rounded-xs flex items-center justify-center flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-serif font-semibold text-[#1F3A2B]">
                      {item.productName}
                    </p>
                    <p className="text-[#5E6961] text-[11px]">
                      {item.quantity} × {item.variantSize}
                    </p>
                  </div>
                </div>
                <div className="font-serif font-bold text-[#1F3A2B]">
                  NPR {item.unitPrice * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Price Calculation */}
          <div className="space-y-2 text-xs font-sans text-[#5E6961] pt-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-[#1C241E]">
                NPR {subtotalAmount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>
                {fulfilmentType === "pickup"
                  ? "Pickup Fee (Lazimpat)"
                  : `Delivery (${selectedArea?.name || "Kathmandu"})`}
              </span>
              <span className="font-medium text-[#1C241E]">
                {deliveryFee === 0 ? "FREE" : `NPR ${deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-serif font-bold text-[#1F3A2B] pt-3 border-t border-[#F4EFE6]">
              <span>Total Due (NPR)</span>
              <span>NPR {totalAmount}</span>
            </div>
          </div>

          {/* Validation error */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans rounded-xs">
              {errorMsg}
            </div>
          )}

          {/* Submit Place Order Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-[#1F3A2B] hover:bg-[#2A4E3B] text-white text-xs font-semibold uppercase tracking-[0.2em] font-sans rounded-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Confirming Order...</span>
            ) : (
              <>
                <span>Place Order (NPR {totalAmount})</span>
                <ArrowRight className="w-4 h-4 text-[#E8B931]" />
              </>
            )}
          </button>

          <p className="text-center text-[10px] uppercase tracking-wider text-[#5E6961] font-sans">
            By ordering, you reserve units from current sellable batches.
          </p>
        </div>
      </div>
    </form>
  );
}
