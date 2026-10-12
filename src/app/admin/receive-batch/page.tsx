import React from "react";
import { prisma } from "@/lib/prisma";
import ReceiveBatchClient from "@/components/admin/ReceiveBatchClient";

export default async function ReceiveBatchPage() {
  const variants = await prisma.productVariant.findMany({
    where: { isActive: true },
    include: { product: true },
    orderBy: { sku: "asc" },
  });

  const formattedVariants = variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    size: v.size,
    productName: v.product.name,
  }));

  return <ReceiveBatchClient variants={formattedVariants} />;
}
