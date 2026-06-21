"use client";

import Link from "next/link";
import { useState } from "react";

const TOOLS = [
  { href: "/", label: "PayPal", live: true },
  { href: "#", label: "Cripto", live: false },
  { href: "#", label: "Remesas", live: false },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy-deep text-white">
      <div className="max-w-[1000px] mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-7 h-7 rounded-lg bg-violet flex items-center justify-center font-display font-bold text-sm">
              $
            </span>
            <span className="font-display font-semibold text-[15px] tracking-tight">
              Latam Finanzas
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {TOOLS.map((tool) =>
              tool.live ? (
                <Link
                  key={tool.label}
                  href={tool.href}
                  className="px-3.5 py-2 rounded-full text-[13px] font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {tool.label}
                </Link>
              ) : (
                <span
                  key={tool.label}
                  className="px-3.5 py-2 rounded-full text-[13px] font-medium text-white/35 cursor-default flex items-center gap-1.5"
                >
                  {tool.label}
                  <span className="text-[9px] uppercase tracking-wide bg-white/10 px-1.5 py-0.5 rounded-full">
                    pronto
                  </span>
                </span>
              )
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {open ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="sm:hidden pb-4 flex flex-col gap-1">
            {TOOLS.map((tool) =>
              tool.live ? (
                <Link
                  key={tool.label}
                  href={tool.href}
                  onClick={() => setOpen(false)}
                  className="px-3.5 py-2.5 rounded-lg text-[14px] font-medium text-white/90 hover:bg-white/10 transition-colors"
                >
                  {tool.label}
                </Link>
              ) : (
                <span
                  key={tool.label}
                  className="px-3.5 py-2.5 rounded-lg text-[14px] font-medium text-white/35 flex items-center gap-2"
                >
                  {tool.label}
                  <span className="text-[9px] uppercase tracking-wide bg-white/10 px-1.5 py-0.5 rounded-full">
                    pronto
                  </span>
                </span>
              )
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
