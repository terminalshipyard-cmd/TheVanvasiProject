"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Plus, Check, ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id ?? ""
  );
  const [isSizePickerOpen, setIsSizePickerOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedVariant) return;

    if (!isSizePickerOpen && product.variants.length > 1) {
      setIsSizePickerOpen(true);
      return;
    }

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      characterTitle: product.characterTitle,
      variantSize: selectedVariant.size,
      unitPrice: selectedVariant.price,
      imageUrl: product.images[0]?.url || "/images/hot-honey-butter.svg",
    });

    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      setIsSizePickerOpen(false);
    }, 1200);
  };

  const isSoldOut = (selectedVariant?.sellableStock ?? 0) <= 0;

  return (
    <div className="product-card-stagger group relative bg-white border border-[#E6DFD5] rounded-none p-6 md:p-8 flex flex-col justify-between hover:border-[#1F3A2B]/40 transition-all duration-300">
      {/* Top Meta */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.25em] text-[#E8B931] bg-[#1F3A2B] px-2.5 py-1 rounded-none">
          {product.characterTitle?.split("—")[0]?.trim() || "Character"}
        </span>
        <span className="text-xs font-serif text-[#5E6961] tracking-widest uppercase">
          From NPR {product.minPrice}
        </span>
      </div>

      {/* Product Image Cutout */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-square my-4 bg-[#FBF9F5] border border-[#F4EFE6] rounded-none overflow-hidden p-6 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500"
      >
        <img
          src={product.images[0]?.url}
          alt={product.images[0]?.altText || product.name}
          className="w-full h-full object-contain filter drop-shadow-xs"
          loading="lazy"
        />
      </Link>

      {/* Title & Description */}
      <div className="mt-2 mb-6">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-[0.08em] text-[#1F3A2B] uppercase hover:text-[#2D523E] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs sm:text-sm text-[#5E6961] font-sans mt-2 line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>
      </div>

      {/* Size Picker & Actions */}
      <div className="pt-4 border-t border-[#F4EFE6] space-y-4">
        {/* Variant Size Selector Buttons */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px] text-[#5E6961] font-sans">
            <span>Select Size</span>
            <span className="text-[#1F3A2B] font-medium">
              NPR {selectedVariant?.price}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {product.variants.map((v) => {
              const selected = v.id === selectedVariant?.id;
              const hasStock = (v.sellableStock ?? 0) > 0;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedVariantId(v.id);
                    setIsSizePickerOpen(true);
                  }}
                  className={`py-2 px-3 text-xs font-sans rounded-none border transition-all text-center flex flex-col items-center justify-center ${
                    selected
                      ? "border-[#1F3A2B] bg-[#1F3A2B] text-white font-semibold shadow-xs"
                      : "border-[#E6DFD5] bg-[#FBF9F5] text-[#1C241E] hover:border-[#1F3A2B]/40"
                  }`}
                >
                  <span className="font-medium tracking-wide">{v.size}</span>
                  <span
                    className={`text-[10px] mt-0.5 ${
                      selected ? "text-[#E8B931]" : "text-[#5E6961]"
                    }`}
                  >
                    {!hasStock ? "Sold out" : `NPR ${v.price}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isSoldOut}
          className={`w-full py-3 px-4 rounded-none text-xs font-semibold uppercase tracking-widest font-sans flex items-center justify-center gap-2 transition-all duration-200 ${
            addedNotice
              ? "bg-[#2A4E3B] text-white"
              : isSoldOut
              ? "bg-[#E6DFD5] text-[#5E6961] cursor-not-allowed"
              : "bg-[#1F3A2B] hover:bg-[#2A4E3B] text-white shadow-xs"
          }`}
        >
          {addedNotice ? (
            <>
              <Check className="w-4 h-4 text-[#E8B931]" />
              <span>Added to Basket</span>
            </>
          ) : isSoldOut ? (
            <span>Sold Out in Kathmandu</span>
          ) : (
            <>
              <Plus className="w-4 h-4 text-[#E8B931]" />
              <span>Add {selectedVariant?.size} to Basket</span>
            </>
          )}
        </button>

        {/* Quick link to detailed page */}
        <div className="text-center">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 text-[11px] font-sans font-medium uppercase tracking-wider text-[#5E6961] hover:text-[#1F3A2B] transition-colors"
          >
            <span>Read culinary pairings</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
