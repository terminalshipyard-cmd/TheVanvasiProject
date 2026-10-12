import React from "react";
import AdminProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        orderBy: { price: "asc" },
      },
    },
  });

  if (!product) {
    return (
      <section className="min-h-screen bg-[#FBF9F5] text-[#1C241E] p-6">
        <div className="max-w-xl bg-white p-6 rounded-lg border border-gray-200">
          <h1 className="text-xl font-bold text-red-600 mb-2">Product Not Found</h1>
          <p className="text-sm text-gray-600 mb-4">
            Could not find any product matching ID &quot;{productId}&quot; in the database.
          </p>
          <Link
            href="/admin/products"
            className="text-sm text-[#1F3A2B] underline font-medium"
          >
            ← Return to Products
          </Link>
        </div>
      </section>
    );
  }

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

  const initialProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    characterTitle: product.characterTitle,
    tagline: product.tagline,
    description: product.description,
    ingredients: product.ingredients,
    isActive: product.isActive,
    imageUrl: primaryImage?.url || "",
    altText: primaryImage?.altText || "",
    variants: product.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      size: v.size,
      price: v.price,
      isActive: v.isActive,
    })),
  };

  return (
    <section className="min-h-screen bg-[#FBF9F5] text-[#1C241E] p-6">
      <AdminProductForm initialProduct={initialProduct} />
    </section>
  );
}
