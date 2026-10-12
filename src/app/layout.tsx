import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { AuthProvider } from "@/components/providers/AuthProvider";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Vanvasi Project | Small-Batch Cultured Flavoured Butters",
  description: "Artisanal small-batch flavoured butter, handcrafted in Lazimpat, Kathmandu. Sweet heat honey butter and slow-roasted garlic butter.",
  icons: {
    icon: "/images/4.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-[#FBF9F5] text-[#1C241E] font-sans antialiased selection:bg-[#E8B931]/30 selection:text-[#1F3A2B]">
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
