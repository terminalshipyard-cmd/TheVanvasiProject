"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface VariantInput {
  id?: string;
  sku: string;
  size: string;
  price: number;
  isActive: boolean;
}

interface ProductFormProps {
  initialProduct?: {
    id: string;
    name: string;
    slug: string;
    characterTitle?: string | null;
    tagline: string;
    description: string;
    ingredients: string;
    isActive: boolean;
    imageUrl?: string;
    altText?: string;
    variants: VariantInput[];
  };
}

export default function AdminProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialProduct?.id);

  const [name, setName] = useState(initialProduct?.name ?? "");
  const [slug, setSlug] = useState(initialProduct?.slug ?? "");
  const [characterTitle, setCharacterTitle] = useState(initialProduct?.characterTitle ?? "");
  const [tagline, setTagline] = useState(initialProduct?.tagline ?? "");
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  const [ingredients, setIngredients] = useState(() => {
    if (!initialProduct?.ingredients) return "";
    try {
      const parsed = JSON.parse(initialProduct.ingredients);
      return Array.isArray(parsed) ? parsed.join(", ") : initialProduct.ingredients;
    } catch {
      return initialProduct.ingredients;
    }
  });
  const [isActive, setIsActive] = useState(initialProduct?.isActive ?? true);

  // Image Management
  const [imageUrl, setImageUrl] = useState(initialProduct?.imageUrl ?? "");
  const [altText, setAltText] = useState(initialProduct?.altText ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [variants, setVariants] = useState<VariantInput[]>(
    initialProduct?.variants && initialProduct.variants.length > 0
      ? initialProduct.variants
      : [
          {
            id: `temp_${Date.now()}`,
            sku: "TVP-NEW-100",
            size: "100 g",
            price: 450,
            isActive: true,
          },
        ]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Failed to upload file.");
      } else {
        setImageUrl(data.url);
        if (!altText) {
          setAltText(name ? `${name} jar` : file.name);
        }
      }
    } catch {
      setUploadError("Network error occurred during file upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: `temp_${Date.now()}`,
        sku: `TVP-NEW-${prev.length * 100 + 100}`,
        size: "250 g",
        price: 900,
        isActive: true,
      },
    ]);
  };

  const handleRemoveVariant = (id?: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim() || !slug.trim()) {
      setError("Please fill in Product Name and Slug.");
      return;
    }

    if (variants.length === 0) {
      setError("At least one packaging variant is required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initialProduct?.id,
          name,
          slug,
          characterTitle,
          tagline,
          description,
          ingredients,
          isActive,
          imageUrl: imageUrl || null,
          altText: altText || name,
          variants,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save product.");
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        router.refresh();
        setTimeout(() => {
          router.push("/admin/products");
        }, 1200);
      }
    } catch {
      setError("Network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? `Edit Product: ${initialProduct?.name}` : "Create New Product"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage product details, jar imagery, and packaging variants in the live database.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="text-sm text-[#1F3A2B] hover:underline flex items-center gap-1"
        >
          ← Back to Products
        </Link>
      </div>

      {error && (
        <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded-md">
          ✓ Product successfully saved to database! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Product Basic Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-lg font-semibold text-[#1F3A2B] border-b pb-2">
            General Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Product Name *</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!isEdit && !slug) {
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }
                }}
                placeholder="e.g. Hot Honey Butter"
                className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Slug *</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. hot-honey-butter"
                className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Character Title</span>
              <input
                type="text"
                value={characterTitle}
                onChange={(e) => setCharacterTitle(e.target.value)}
                placeholder="e.g. The Fiery Artisan"
                className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Tagline</span>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Whipped highland butter infused with..."
                className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Full product story and flavor profile..."
              className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Ingredients (comma-separated)
            </span>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. Cultured highland butter, Raw wild honey, Smoked chili"
              className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
            />
          </label>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-[#1F3A2B] focus:ring-[#1F3A2B]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Product is active and visible in store catalog
            </label>
          </div>
        </div>

        {/* Product Image Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-lg font-semibold text-[#1F3A2B] border-b pb-2">
            Product Photography &amp; Jar Cutout
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Image Preview Box */}
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg bg-[#FBF9F5] min-h-[180px]">
              {imageUrl ? (
                <div className="relative group text-center space-y-2">
                  <img
                    src={imageUrl}
                    alt={altText || name}
                    className="max-h-36 max-w-full object-contain mx-auto rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="text-xs text-red-600 hover:text-red-800 underline block mx-auto"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="text-center text-xs text-gray-400">
                  <div className="text-2xl mb-1">🖼️</div>
                  <div>No image selected</div>
                  <div className="text-[10px] mt-1 text-gray-400">PNG, SVG, or WebP cutout recommended</div>
                </div>
              )}
            </div>

            {/* Upload Controls & URL input */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Upload New File from Device
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#1F3A2B] file:text-white hover:file:bg-[#162a1f] file:cursor-pointer disabled:opacity-50"
                />
                {isUploading && (
                  <p className="text-xs text-blue-600 mt-1">Uploading image...</p>
                )}
                {uploadError && (
                  <p className="text-xs text-red-600 mt-1">{uploadError}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Or Direct Image Path / URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="e.g. /images/hot-honey-butter.svg or https://..."
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Image Alt Text (for SEO &amp; accessibility)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="e.g. The Vanvasi Project - Hot Honey Butter Jar Cutout"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Variants Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="text-lg font-semibold text-[#1F3A2B]">Packaging Variants</h2>
              <p className="text-xs text-gray-500">
                Define sizes, SKUs, and retail pricing in Nepalese Rupees.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddVariant}
              className="text-xs bg-[#E8B931] hover:bg-[#d6a928] text-[#1C241E] font-medium px-3 py-1.5 rounded-md transition"
            >
              + Add Variant
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b bg-[#FBF9F5]">
                  <th className="p-2.5 font-semibold text-gray-700">SKU</th>
                  <th className="p-2.5 font-semibold text-gray-700">Size / Unit</th>
                  <th className="p-2.5 font-semibold text-gray-700">Price (NPR)</th>
                  <th className="p-2.5 font-semibold text-gray-700">Active</th>
                  <th className="p-2.5 font-semibold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {variants.map((v, idx) => (
                  <tr key={v.id || idx}>
                    <td className="p-2">
                      <input
                        type="text"
                        required
                        value={v.sku}
                        onChange={(e) => {
                          const val = e.target.value;
                          setVariants((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, sku: val } : item))
                          );
                        }}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        required
                        value={v.size}
                        onChange={(e) => {
                          const val = e.target.value;
                          setVariants((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, size: val } : item))
                          );
                        }}
                        placeholder="e.g. 100 g"
                        className="w-28 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        required
                        value={v.price}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setVariants((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, price: val } : item))
                          );
                        }}
                        className="w-28 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={v.isActive}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setVariants((prev) =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, isActive: val } : item
                            )
                          );
                        }}
                        className="rounded text-[#1F3A2B]"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(v.id)}
                        disabled={variants.length <= 1}
                        className="text-xs text-red-600 hover:text-red-800 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 border-t border-gray-200">
          <Link
            href="/admin/products"
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm bg-[#1F3A2B] hover:bg-[#162a1f] text-white rounded-md font-medium shadow-sm transition disabled:opacity-50"
          >
            {loading ? "Saving to Database..." : isEdit ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
