import React from "react";
import { prisma } from "@/lib/prisma";
import OfflineSaleClient from "@/components/admin/OfflineSaleClient";

export default async function OfflineSalePage() {
  const [variants, batches] = await Promise.all([
    prisma.productVariant.findMany({
      where: { isActive: true },
      include: { product: true },
      orderBy: { sku: "asc" },
    }),
    prisma.batch.findMany({
      where: { quantityRemaining: { gt: 0 } },
      orderBy: { bestBefore: "asc" },
    }),
  ]);

  const formattedVariants = variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    size: v.size,
    price: v.price,
    productName: v.product.name,
  }));

  const formattedBatches = batches.map((b) => ({
    id: b.id,
    batchCode: b.batchCode,
    variantId: b.variantId,
    quantityRemaining: b.quantityRemaining,
  }));

  return (
    <OfflineSaleClient
      variants={formattedVariants}
      batches={formattedBatches}
    />
  );
}
