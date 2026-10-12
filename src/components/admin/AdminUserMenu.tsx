"use client";

import React from "react";
import { signOut } from "next-auth/react";

export default function AdminUserMenu() {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs bg-[#1F3A2B]/10 text-[#1F3A2B] font-semibold px-2.5 py-1 rounded-full">
        Admin Mode
      </span>
      <button
        onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        className="text-xs text-red-700 hover:text-red-900 font-medium underline transition"
      >
        Sign Out
      </button>
    </div>
  );
}
