"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product, VariantAvailability } from "@/types";
import { useCart } from "@/context/CartContext";
import { getAvailability } from "@/lib/data";
import { Plus, Minus, Check, ShoppingBag, MapPin, Truck, ArrowLeft } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [availabilityMap, setAvailabilityMap] = useState<
    Record<string, VariantAvailability>
  >({});
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];

  // Fetch live uncached availability on mount as required by the hard constraints
  useEffect(() => {
    async function loadStock() {
      try {
        const variantIds = product.variants.map((v) => v.id);
        const avail = await getAvailability(variantIds);
        setAvailabilityMap(avail);
      } catch (err) {
        console.error("Failed to load availability", err);
      } finally {
        setLoadingAvailability(false);
      }
    }
    loadStock();
  }, [product]);

  const currentAvailability = selectedVariant
    ? availabilityMap[selectedVariant.id]
    : undefined;

  const sellableStock = currentAvailability
    ? currentAvailability.sellableStock
    : selectedVariant?.sellableStock ?? 0;

  const isSoldOut = !loadingAvailability && sellableStock <= 0;

  const handleAddToCart = () => {
    if (!selectedVariant || isSoldOut) return;

    addItem(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        characterTitle: product.characterTitle,
        variantSize: selectedVariant.size,
        unitPrice: selectedVariant.price,
        imageUrl: product.images[0]?.url || "/images/hot-honey-butter.svg",
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12 md:py-16">
      {/* Back button */}
      <Link
        href="/#flavours"
        className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#5E6961] hover:text-[#1F3A2B] transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Characters</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 bg-white border border-[#E6DFD5] rounded-xs p-8 sm:p-12 aspect-square flex items-center justify-center relative overflow-hidden">
          <img
            src={product.images[0]?.url}
            alt={product.images[0]?.altText || product.name}
            className="w-full h-full max-h-[460px] object-contain drop-shadow-sm"
          />
          <div className="absolute top-6 left-6">
            <span className="text-[10px] uppercase font-sans font-bold tracking-[0.25em] text-[#E8B931] bg-[#1F3A2B] px-3 py-1 rounded-full">
              {product.characterTitle?.split("—")[0]?.trim() || "Small Batch"}
            </span>
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#5E6961]">
              {product.characterTitle}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-[0.06em] text-[#1F3A2B] uppercase mt-2">
              {product.name}
            </h1>
            <p className="font-serif text-2xl font-bold text-[#1F3A2B] mt-4">
              NPR {selectedVariant?.price}
            </p>
            <p className="text-sm text-[#5E6961] font-sans mt-3 leading-relaxed">
              {product.tagline}
            </p>
          </div>

          {/* Size Picker */}
          <div className="space-y-3 pt-6 border-t border-[#E6DFD5]">
            <div className="flex justify-between items-center text-xs font-sans">
              <span className="font-semibold uppercase tracking-wider text-[#1F3A2B]">
                Choose Jar Size
              </span>
              <span className="text-[#5E6961]">
                {loadingAvailability ? (
                  "Checking Lazimpat stock..."
                ) : isSoldOut ? (
                  <span className="text-red-700 font-medium">Sold Out</span>
                ) : (
                  <span className="text-[#1F3A2B] font-medium">
                    {sellableStock} units available
                  </span>
                )}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {product.variants.map((v) => {
                const selected = v.id === selectedVariant?.id;
                const vStock = availabilityMap[v.id]?.sellableStock ?? v.sellableStock ?? 0;
                const vSoldOut = !loadingAvailability && vStock <= 0;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariantId(v.id);
                      setQuantity(1);
                    }}
                    className={`p-3.5 rounded-xs border text-left transition-all ${
                      selected
                        ? "border-[#1F3A2B] bg-[#1F3A2B] text-white shadow-xs"
                        : "border-[#E6DFD5] bg-white text-[#1C241E] hover:border-[#1F3A2B]/40"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-serif font-bold text-base">
                        {v.size}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          selected ? "text-[#E8B931]" : "text-[#1F3A2B]"
                        }`}
                      >
                        NPR {v.price}
                      </span>
                    </div>
                    <div className="text-[11px] mt-1 opacity-80">
                      {vSoldOut ? "Out of stock" : "In stock • Batch dated"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector & Add Button */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#E6DFD5] rounded-xs bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-[#1F3A2B] hover:bg-[#F4EFE6] transition-colors"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1 || isSoldOut}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 font-semibold text-sm text-[#1F3A2B] font-sans">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(sellableStock, quantity + 1))}
                  className="p-3 text-[#1F3A2B] hover:bg-[#F4EFE6] transition-colors"
                  aria-label="Increase quantity"
                  disabled={quantity >= sellableStock || isSoldOut}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className={`flex-1 py-3.5 px-6 rounded-xs text-xs font-semibold uppercase tracking-widest font-sans flex items-center justify-center gap-2 transition-all shadow-xs ${
                  added
                    ? "bg-[#2A4E3B] text-white"
                    : isSoldOut
                    ? "bg-[#E6DFD5] text-[#5E6961] cursor-not-allowed"
                    : "bg-[#1F3A2B] hover:bg-[#2A4E3B] text-white"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-[#E8B931]" />
                    <span>Added to Basket</span>
                  </>
                ) : isSoldOut ? (
                  <span>Sold Out</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#E8B931]" />
                    <span>
                      Add {quantity} × {selectedVariant?.size} (NPR{" "}
                      {(selectedVariant?.price || 0) * quantity})
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Detailed Story & Ingredients */}
          <div className="pt-8 border-t border-[#E6DFD5] space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#1F3A2B] mb-2">
                About this Character
              </h3>
              <p className="text-xs sm:text-sm text-[#5E6961] font-sans leading-relaxed">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#1F3A2B] mb-2">
                Kitchen Ingredients
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5E6961] font-sans">
                {product.ingredients.map((ing) => (
                  <li key={ing} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8B931]" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fulfilment badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#F4EFE6] text-xs font-sans text-[#5E6961]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1F3A2B]" />
                <span>Free Lazimpat Pickup</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#1F3A2B]" />
                <span>Kathmandu Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
