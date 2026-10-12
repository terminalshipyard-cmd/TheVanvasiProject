import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      fulfilmentType,
      deliveryAddress,
      deliveryAreaId,
      customerNotes,
      items,
    } = body;

    if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required order information or items." },
        { status: 400 }
      );
    }

    // Calculate delivery fee
    let deliveryFee = 0;
    if (fulfilmentType === "delivery" && deliveryAreaId) {
      const area = await prisma.deliveryArea.findUnique({
        where: { id: deliveryAreaId },
      });
      if (area) {
        deliveryFee = area.deliveryFee;
      }
    }

    interface OrderItemCreateInput {
      productId: string;
      variantId: string;
      productName: string;
      variantSize: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItemsData: OrderItemCreateInput[] = [];

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        return NextResponse.json(
          { error: `Variant not found: ${item.variantId}` },
          { status: 400 }
        );
      }

      const itemTotal = variant.price * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: variant.productId,
        variantId: variant.id,
        productName: variant.product.name,
        variantSize: variant.size,
        unitPrice: variant.price,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    const totalAmount = subtotal + deliveryFee;

    // Generate random order number e.g. TVP-1042
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TVP-${randomSuffix}`;

    // Create Order with Items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          fulfilmentType: fulfilmentType || "pickup",
          deliveryAddress: deliveryAddress || null,
          deliveryAreaId: deliveryAreaId || null,
          subtotal,
          deliveryFee,
          totalAmount,
          orderStatus: "pending",
          paymentMethod: "cash",
          paymentStatus: "unpaid",
          customerNotes: customerNotes || null,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // Allocate stock from oldest sellable batches and record inventory movements
      for (const orderItem of createdOrder.items) {
        let remainingToDeduct = orderItem.quantity;

        // Fetch batches for this variant with remaining stock, sorted by bestBefore (FIFO)
        const batches = await tx.batch.findMany({
          where: {
            variantId: orderItem.variantId,
            quantityRemaining: { gt: 0 },
          },
          orderBy: { bestBefore: "asc" },
        });

        for (const batch of batches) {
          if (remainingToDeduct <= 0) break;

          const deductAmount = Math.min(batch.quantityRemaining, remainingToDeduct);

          // Update batch quantity
          await tx.batch.update({
            where: { id: batch.id },
            data: {
              quantityRemaining: batch.quantityRemaining - deductAmount,
            },
          });

          // Link batch to order item
          await tx.orderItemBatch.create({
            data: {
              orderItemId: orderItem.id,
              batchId: batch.id,
              batchCode: batch.batchCode,
              quantity: deductAmount,
            },
          });

          // Record inventory movement
          await tx.inventoryMovement.create({
            data: {
              variantId: orderItem.variantId,
              batchId: batch.id,
              changeAmount: -deductAmount,
              type: "order",
              reason: `Order ${createdOrder.orderNumber}`,
              createdBy: "System (Checkout)",
            },
          });

          remainingToDeduct -= deductAmount;
        }
      }

      return createdOrder;
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      { status: 500 }
    );
  }
}
