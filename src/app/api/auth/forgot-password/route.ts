import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // To prevent email enumeration attacks, always respond with success
    if (!user) {
      return NextResponse.json({
        message: "If that email exists in our system, a password reset link has been sent.",
      });
    }

    // Clean up any old tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: cleanEmail },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email: cleanEmail,
        token,
        expires,
      },
    });

    await sendPasswordResetEmail(cleanEmail, token);

    return NextResponse.json({
      message: "If that email exists in our system, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Unable to process request at this time." },
      { status: 500 }
    );
  }
}
