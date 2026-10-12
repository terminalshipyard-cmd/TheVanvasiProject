import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { variantId, quantity, batchId, notes } = await req.json();

    if (!variantId || !quantity) {
      return NextResponse.json(
        { error: "Variant and quantity are required." },
        { status: 400 }
      );
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json(
        { error: "Quantity must be a positive integer." },
        { status: 400 }
      );
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      return NextResponse.json({ error: "Variant not found." }, { status: 404 });
    }

    const totalAmount = variant.price * qty;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TVP-WALK-${randomSuffix}`;

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: "Walk-in Counter Customer",
          customerPhone: "0000000000",
          fulfilmentType: "pickup",
          subtotal: totalAmount,
          deliveryFee: 0,
          totalAmount,
          orderStatus: "completed",
          paymentMethod: "cash",
          paymentStatus: "paid",
          customerNotes: notes || "Direct offline / in-person purchase",
          items: {
            create: [
              {
                productId: variant.productId,
                variantId: variant.id,
                productName: variant.product.name,
                variantSize: variant.size,
                unitPrice: variant.price,
                quantity: qty,
                totalPrice: totalAmount,
              },
            ],
          },
        },
        include: { items: true },
      });

      const orderItem = createdOrder.items[0];

      // If specific batch chosen, deduct from it; else FIFO from sellable batches
      let targetBatches = [];
      if (batchId) {
        const specificBatch = await tx.batch.findUnique({ where: { id: batchId } });
        if (specificBatch && specificBatch.quantityRemaining > 0) {
          targetBatches.push(specificBatch);
        }
      }

      if (targetBatches.length === 0) {
        targetBatches = await tx.batch.findMany({
          where: { variantId, quantityRemaining: { gt: 0 } },
          orderBy: { bestBefore: "asc" },
        });
      }

      let remainingToDeduct = qty;
      for (const batch of targetBatches) {
        if (remainingToDeduct <= 0) break;
        const deduct = Math.min(batch.quantityRemaining, remainingToDeduct);

        await tx.batch.update({
          where: { id: batch.id },
          data: { quantityRemaining: batch.quantityRemaining - deduct },
        });

        await tx.orderItemBatch.create({
          data: {
            orderItemId: orderItem.id,
            batchId: batch.id,
            batchCode: batch.batchCode,
            quantity: deduct,
          },
        });

        await tx.inventoryMovement.create({
          data: {
            variantId: variant.id,
            batchId: batch.id,
            changeAmount: -deduct,
            type: "offline_sale",
            reason: `Offline Walk-In Sale (${createdOrder.orderNumber})`,
            createdBy: "Admin (Counter)",
          },
        });

        remainingToDeduct -= deduct;
      }

      return createdOrder;
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Offline sale error:", error);
    return NextResponse.json(
      { error: "Failed to record offline sale." },
      { status: 500 }
    );
  }
}
