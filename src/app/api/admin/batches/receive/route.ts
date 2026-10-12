import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      variantId,
      batchCode,
      madeOn,
      bestBefore,
      quantityReceived,
    } = body;

    if (!variantId || !batchCode || !madeOn || !bestBefore || !quantityReceived) {
      return NextResponse.json(
        { error: "All batch intake fields are required." },
        { status: 400 }
      );
    }

    const qty = parseInt(quantityReceived, 10);
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json(
        { error: "Received quantity must be a positive number." },
        { status: 400 }
      );
    }

    const existing = await prisma.batch.findUnique({
      where: { batchCode: batchCode.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A batch with this batch code already exists." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const batch = await tx.batch.create({
        data: {
          variantId,
          batchCode: batchCode.trim(),
          madeOn,
          bestBefore,
          quantityReceived: qty,
          quantityRemaining: qty,
        },
      });

      await tx.inventoryMovement.create({
        data: {
          variantId,
          batchId: batch.id,
          changeAmount: qty,
          type: "batch_in",
          reason: `Stock Intake - Batch ${batch.batchCode}`,
          createdBy: "Admin",
        },
      });

      return batch;
    });

    return NextResponse.json({ success: true, batch: result }, { status: 201 });
  } catch (error) {
    console.error("Receive batch error:", error);
    return NextResponse.json(
      { error: "Failed to record received batch." },
      { status: 500 }
    );
  }
}
