import React from "react";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/data";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Character Not Found | The Vanvasi Project" };

  return {
    title: `${product.name} | The Vanvasi Project`,
    description: product.tagline,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C241E] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </div>
  );
}
