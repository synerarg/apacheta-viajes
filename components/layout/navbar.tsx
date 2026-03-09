"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Paquetes NOA", href: "/paquetes" },
  { label: "Experiencias", href: "/experiencias" },
  { label: "Hotelería", href: "/hoteleria" },
  { label: "Para Agencias", href: "/para-agencias" },
  { label: "Emisivo", href: "/emisivo" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-primary sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-8 h-20 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 font-playfair text-off-white leading-tight"
        >
          <span className="text-xl font-normal tracking-widest">
            APACHETA
          </span>
          <span className="text-xl font-bold tracking-widest">
            VIAJES
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-lato text-[13px] text-off-white uppercase tracking-[1.6px] transition-opacity hover:opacity-75 whitespace-nowrap ${
                pathname === link.href ? "font-bold" : "font-light"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link
          href="/contacto"
          className="hidden md:inline-flex items-center border border-off-white text-off-white font-lato text-[13px] font-light uppercase tracking-[1.6px] px-5 py-2.5 shrink-0 hover:bg-off-white hover:text-primary transition-colors"
        >
          Contacto
        </Link>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-off-white ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary border-t border-off-white/20">
          <div className="flex flex-col px-8 py-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-lato text-[14px] text-off-white uppercase tracking-[1.6px] font-light py-3 border-b border-off-white/10 last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center border border-off-white text-off-white font-lato text-[14px] font-light uppercase tracking-[1.6px] px-6 py-3"
            >
              Contacto
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
