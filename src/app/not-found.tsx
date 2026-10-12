import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C241E] flex flex-col justify-center items-center px-4 text-center">
      <Link href="/" className="mb-4">
        <img src="/images/6.png" alt="Vanvasi logo" className="h-10 mx-auto rounded-md" />
      </Link>
      <h1 className="text-3xl font-bold font-serif text-[#1F3A2B] mb-2">404 - Page Not Found</h1>
      <p className="text-sm text-[#5E6961] mb-6 max-w-sm">
        The artisanal butter page or resource you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-[#1F3A2B] text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-[#162a1f] transition"
      >
        Return to Shop
      </Link>
    </div>
  );
}
