"use client";

import React from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    subtotalAmount,
    totalItems,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#14261C]/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBF9F5] border-l border-[#E6DFD5] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-[#E6DFD5] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1F3A2B]" />
              <h2 className="font-serif text-lg font-semibold tracking-widest uppercase text-[#1F3A2B]">
                Your Basket ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#5E6961] hover:text-[#1F3A2B] hover:bg-[#F4EFE6] rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#EBF0EC] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-[#1F3A2B]/60" />
                </div>
                <p className="font-serif text-xl text-[#1F3A2B] mb-2 font-medium">
                  Your basket is empty
                </p>
                <p className="text-sm text-[#5E6961] mb-6 max-w-xs font-sans">
                  Crafted in small batches at Lazimpat. Add a character to begin.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-[#1F3A2B] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#2A4E3B] transition-colors rounded-sm"
                >
                  Explore Flavours
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="p-4 bg-white border border-[#E6DFD5] rounded-sm flex gap-4"
                >
                  <div className="w-20 h-20 bg-[#FBF9F5] border border-[#E6DFD5] rounded-xs flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-16 h-16 object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#1F3A2B] truncate">
                          {item.productName}
                        </h3>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-[#5E6961] hover:text-red-700 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#5E6961] font-sans mt-0.5">
                        Jar size: <span className="font-medium text-[#1F3A2B]">{item.variantSize}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F4EFE6]">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-[#E6DFD5] rounded-xs bg-[#FBF9F5]">
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="p-1 hover:bg-[#E6DFD5] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5 text-[#1F3A2B]" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-[#1F3A2B]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="p-1 hover:bg-[#E6DFD5] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#1F3A2B]" />
                        </button>
                      </div>

                      <div className="font-serif font-bold text-sm text-[#1F3A2B]">
                        NPR {item.unitPrice * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E6DFD5] space-y-4">
              <div className="space-y-1.5 text-xs text-[#5E6961]">
                <div className="flex justify-between items-center text-sm font-serif font-semibold text-[#1F3A2B]">
                  <span>Subtotal</span>
                  <span>NPR {subtotalAmount}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#F4EFE6]">
                  <span>Fulfillment</span>
                  <span className="text-[#1F3A2B] font-medium">
                    Pickup (Free) or Delivery in KTM
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#1F3A2B] hover:bg-[#2A4E3B] text-white font-sans text-xs tracking-widest uppercase font-semibold transition-colors rounded-sm shadow-xs"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-center text-[10px] text-[#5E6961] tracking-wider uppercase font-sans">
                Cash on delivery or pickup • Fresh small batches
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
