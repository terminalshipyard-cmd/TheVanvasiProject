import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token, email } = await req.json();

    if (!token || !email) {
      return NextResponse.json(
        { error: "Token and email are required." },
        { status: 400 }
      );
    }

    const verificationRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: email.toLowerCase().trim(),
        token,
      },
    });

    if (!verificationRecord) {
      return NextResponse.json(
        { error: "Invalid or expired verification token." },
        { status: 400 }
      );
    }

    if (new Date() > verificationRecord.expires) {
      await prisma.verificationToken.delete({
        where: { token },
      });
      return NextResponse.json(
        { error: "Verification token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email: email.toLowerCase().trim() },
      data: { emailVerified: new Date() },
    });

    // Remove token after successful verification
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({
      message: "Email successfully verified! You may now sign in.",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email." },
      { status: 500 }
    );
  }
}
