import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface VariantPayload {
  id?: string;
  sku: string;
  size: string;
  price: string | number;
  isActive?: boolean;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      slug,
      characterTitle,
      tagline,
      description,
      ingredients,
      isActive,
      imageUrl,
      altText,
      variants,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Product name and slug are required." },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
    const ingredientsString = Array.isArray(ingredients)
      ? JSON.stringify(ingredients)
      : typeof ingredients === "string"
      ? JSON.stringify(ingredients.split(",").map((s: string) => s.trim()))
      : JSON.stringify([]);

    if (id) {
      // Update existing product
      const updated = await prisma.$transaction(async (tx) => {
        const prod = await tx.product.update({
          where: { id },
          data: {
            name,
            slug: cleanSlug,
            characterTitle: characterTitle || null,
            tagline: tagline || "",
            description: description || "",
            ingredients: ingredientsString,
            isActive: isActive ?? true,
          },
        });

        // Update primary image if provided
        if (imageUrl) {
          await tx.productImage.deleteMany({ where: { productId: prod.id } });
          await tx.productImage.create({
            data: {
              productId: prod.id,
              url: imageUrl,
              altText: altText || prod.name,
              isPrimary: true,
              sortOrder: 1,
            },
          });
        }

        if (Array.isArray(variants)) {
          for (const v of variants as VariantPayload[]) {
            if (v.id && !v.id.startsWith("temp_")) {
              await tx.productVariant.upsert({
                where: { id: v.id },
                update: {
                  sku: v.sku,
                  size: v.size,
                  price: typeof v.price === "string" ? parseFloat(v.price) : v.price,
                  isActive: v.isActive ?? true,
                },
                create: {
                  productId: prod.id,
                  sku: v.sku,
                  size: v.size,
                  price: typeof v.price === "string" ? parseFloat(v.price) : v.price,
                  isActive: v.isActive ?? true,
                },
              });
            } else {
              await tx.productVariant.create({
                data: {
                  productId: prod.id,
                  sku: v.sku,
                  size: v.size,
                  price: typeof v.price === "string" ? parseFloat(v.price) : v.price,
                  isActive: v.isActive ?? true,
                },
              });
            }
          }
        }

        return prod;
      });

      return NextResponse.json({ success: true, product: updated });
    } else {
      // Create new product
      const existing = await prisma.product.findUnique({
        where: { slug: cleanSlug },
      });

      if (existing) {
        return NextResponse.json(
          { error: "A product with this slug already exists." },
          { status: 400 }
        );
      }

      const created = await prisma.product.create({
        data: {
          name,
          slug: cleanSlug,
          characterTitle: characterTitle || null,
          tagline: tagline || "",
          description: description || "",
          ingredients: ingredientsString,
          isActive: isActive ?? true,
          images: imageUrl
            ? {
                create: [
                  {
                    url: imageUrl,
                    altText: altText || name,
                    isPrimary: true,
                    sortOrder: 1,
                  },
                ],
              }
            : undefined,
          variants: {
            create: Array.isArray(variants)
              ? (variants as VariantPayload[]).map((v) => ({
                  sku: v.sku,
                  size: v.size,
                  price: typeof v.price === "string" ? parseFloat(v.price) : v.price,
                  isActive: v.isActive ?? true,
                }))
              : [],
          },
        },
      });

      return NextResponse.json({ success: true, product: created }, { status: 201 });
    }
  } catch (error) {
    console.error("Save product error:", error);
    return NextResponse.json(
      { error: "Failed to save product." },
      { status: 500 }
    );
  }
}
