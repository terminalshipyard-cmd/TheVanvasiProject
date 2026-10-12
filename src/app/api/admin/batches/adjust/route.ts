import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { batchId, action, amount, reason } = await req.json();

    if (!batchId || !action) {
      return NextResponse.json(
        { error: "Batch ID and action are required." },
        { status: 400 }
      );
    }

    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
    });

    if (!batch) {
      return NextResponse.json({ error: "Batch not found." }, { status: 404 });
    }

    if (action === "write_off") {
      const writeOffQty = batch.quantityRemaining;
      if (writeOffQty <= 0) {
        return NextResponse.json(
          { error: "This batch has 0 units remaining to write off." },
          { status: 400 }
        );
      }

      await prisma.$transaction(async (tx) => {
        await tx.batch.update({
          where: { id: batchId },
          data: { quantityRemaining: 0 },
        });

        await tx.inventoryMovement.create({
          data: {
            variantId: batch.variantId,
            batchId: batch.id,
            changeAmount: -writeOffQty,
            type: "write_off",
            reason: reason || `Admin write-off of expired/damaged stock (${batch.batchCode})`,
            createdBy: "Admin",
          },
        });
      });

      return NextResponse.json({ success: true, message: "Batch written off." });
    }

    if (action === "adjust") {
      const adjustment = parseInt(amount, 10);
      if (isNaN(adjustment) || adjustment === 0) {
        return NextResponse.json(
          { error: "Adjustment amount must be a non-zero number." },
          { status: 400 }
        );
      }

      const newRemaining = batch.quantityRemaining + adjustment;
      if (newRemaining < 0) {
        return NextResponse.json(
          { error: "Remaining stock cannot become negative." },
          { status: 400 }
        );
      }

      await prisma.$transaction(async (tx) => {
        await tx.batch.update({
          where: { id: batchId },
          data: { quantityRemaining: newRemaining },
        });

        await tx.inventoryMovement.create({
          data: {
            variantId: batch.variantId,
            batchId: batch.id,
            changeAmount: adjustment,
            type: "manual",
            reason: reason || `Manual audit adjustment (${batch.batchCode})`,
            createdBy: "Admin",
          },
        });
      });

      return NextResponse.json({ success: true, newRemaining });
    }

    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  } catch (error) {
    console.error("Batch adjust error:", error);
    return NextResponse.json(
      { error: "Failed to adjust batch stock." },
      { status: 500 }
    );
  }
}
