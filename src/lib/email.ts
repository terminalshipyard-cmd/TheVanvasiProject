/**
 * Transactional Email Handler (Verification & Password Reset)
 * Supports console logging in development and direct Resend API when RESEND_API_KEY is configured.
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "The Vanvasi Project <hello@thevanvasiproject.com.np>";

  if (!apiKey) {
    console.log("==================================================");
    console.log(`📨 [DEV EMAIL DISPATCHED] To: ${to}`);
    console.log(`📌 Subject: ${subject}`);
    console.log(`📄 Body: \n${html}`);
    console.log("==================================================");
    return { success: true, mode: "development_console" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Failed to dispatch email via Resend:", err);
      return { success: false, error: err };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error };
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  const html = `
    <div style="font-family: sans-serif; color: #1C241E; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #1F3A2B;">Verify your email for The Vanvasi Project</h2>
      <p>Thank you for joining us. Please verify your email address to activate your account and start ordering handcrafted highland butters.</p>
      <div style="margin: 28px 0;">
        <a href="${verifyUrl}" style="background-color: #1F3A2B; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="font-size: 13px; color: #6b7280;">If the button does not work, copy and paste this link into your browser:</p>
      <p style="font-size: 13px; color: #1F3A2B; word-break: break-all;">${verifyUrl}</p>
      <hr style="margin-top: 32px; border: 0; border-top: 1px solid #e5e7eb;" />
      <p style="font-size: 11px; color: #9ca3af;">If you did not request this, you can safely ignore this email.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Verify your email - The Vanvasi Project",
    html,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  const html = `
    <div style="font-family: sans-serif; color: #1C241E; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #1F3A2B;">Reset your password - The Vanvasi Project</h2>
      <p>We received a request to reset the password for your account. Click the button below to set a new password.</p>
      <div style="margin: 28px 0;">
        <a href="${resetUrl}" style="background-color: #E8B931; color: #1C241E; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 13px; color: #6b7280;">This link will expire in 1 hour. If the button does not work, copy and paste this link:</p>
      <p style="font-size: 13px; color: #1F3A2B; word-break: break-all;">${resetUrl}</p>
      <hr style="margin-top: 32px; border: 0; border-top: 1px solid #e5e7eb;" />
      <p style="font-size: 11px; color: #9ca3af;">If you did not request a password reset, you can safely ignore this message.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Reset your password - The Vanvasi Project",
    html,
  });
}
