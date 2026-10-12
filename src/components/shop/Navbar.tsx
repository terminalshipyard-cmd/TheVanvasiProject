"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
const { data: session } = useSession();
const isAdmin = session?.user?.role === "admin";

  const navLinks = [
    { label: "The Flavours", href: "/#flavours" },
    { label: "Our Story", href: "/#story" },
    { label: "Visit Lazimpat", href: "/#visit" },
    { label: "Account", href: "/auth/signin" },
    { label: "Admin", href: "/admin" },
  ];

  const visibleLinks = navLinks.filter((link) => link.label !== "Admin" || isAdmin);

  return (
    <>
      {/* End-to-end Seamless Translucent Squarish Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-40 w-full bg-white border-b border-[#E6DFD5]/70 transition-all">
        <nav className="max-w-7xl mx-auto px-6 md:px-10 py-3.5 flex items-center justify-between w-full">
          {/* Logo Left */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/images/6.png" alt="Vanvasi logo" className="h-6 w-6 object-contain rounded-md" />
            <span className="font-serif tracking-[0.25em] text-xs font-bold uppercase text-[#1F3A2B]">
              Vanvasi
            </span>
          </Link>

          {/* Links Center (Desktop) */}
          <div className="hidden md:flex items-center gap-10">
            {visibleLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative text-xs uppercase tracking-[0.2em] text-[#1F3A2B] font-medium py-1"
              >
                <span className="text-roll">
                  <span className="text-roll-inner">
                    <span>{link.label}</span>
                    <span className="font-semibold text-[#1F3A2B]">
                      {link.label}
                    </span>
                  </span>
                </span>
              </Link>
            ))}
          </div>

          {/* Right: Cart & Mobile Menu Toggle with Squarish Theme */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="group flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-white/60 hover:bg-white/90 border border-[#E6DFD5] text-[#1F3A2B] transition-colors shadow-2xs"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#1F3A2B]" />
              <span className="text-xs font-semibold text-[#1F3A2B] font-sans">
                {totalItems}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-none bg-white/50 text-[#1F3A2B] hover:bg-white/80 border border-[#E6DFD5] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-Screen Mobile Menu Overlay with Squarish Aesthetic */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#1F3A2B] text-[#FBF9F5] flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-300">
          {/* Top Bar inside Overlay */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5"
            >
              <Logo variant="mark" theme="light" className="h-7 w-7 text-[#FBF9F5]" />
              <span className="font-serif tracking-[0.25em] text-sm uppercase text-[#FBF9F5]">
                The Vanvasi Project
              </span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 border border-white/20 text-[#FBF9F5] hover:text-white rounded-none transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Staggered Navigation Links */}
          <div className="flex flex-col gap-6 my-auto py-12">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#E8B931] font-sans font-semibold">
              Navigation
            </p>
            {visibleLinks.map((link, idx) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-3xl sm:text-4xl tracking-widest uppercase hover:text-[#E8B931] transition-colors"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-widest text-[#FBF9F5]/60 hover:text-white pt-6 border-t border-white/10"
              >
                Admin Dashboard →
              </Link>
            )}
          </div>

          {/* Bottom Info inside Overlay */}
          <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row justify-between text-xs text-[#FBF9F5]/70 gap-3 font-sans">
            <div>
              <p className="font-medium text-[#FBF9F5]">Nursery Road, Lazimpat</p>
              <p>Kathmandu, Nepal • 10:00 AM – 6:00 PM</p>
            </div>
            <div className="text-right sm:text-right">
              <p>NPR Currency Only</p>
              <p className="text-[#E8B931]">Cash on Delivery &amp; Pickup</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
