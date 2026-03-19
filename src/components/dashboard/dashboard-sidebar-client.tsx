"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"
import {
  SquaresFour,
  Suitcase,
  Star,
  Globe,
  SignOut,
} from "@phosphor-icons/react"

import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: SquaresFour, exact: true },
  {
    href: "/dashboard/paquetes",
    label: "Paquetes",
    icon: Suitcase,
    exact: false,
  },
  {
    href: "/dashboard/experiencias",
    label: "Experiencias",
    icon: Star,
    exact: false,
  },
]

export function DashboardSidebarClient() {
  const pathname = usePathname()
  const router = useRouter()
  const [isSigningOut, startSignOut] = useTransition()

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  function handleSignOut() {
    startSignOut(async () => {
      await supabase.auth.signOut()
      router.replace("/login")
    })
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-[250px] flex-col bg-[#2E2726]">
      {/* Logo */}
      <div className="px-6 py-6">
        <Link href="/dashboard">
          <Image
            src="/logo.png"
            alt="Apacheta Viajes"
            width={140}
            height={80}
            className="h-auto w-auto"
          />
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1 px-3 pt-4">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "border-l-2 border-primary bg-white/5 pl-[10px] text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white/90"
              }`}
            >
              <Icon
                className="h-4 w-4 shrink-0"
                weight={active ? "fill" : "regular"}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-white/10 px-3 py-4 flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white/90"
        >
          <Globe className="h-4 w-4 shrink-0" />
          Ir al sitio web
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white/90 disabled:opacity-50"
        >
          <SignOut className="h-4 w-4 shrink-0" />
          {isSigningOut ? "Saliendo..." : "Cerrar sesión"}
        </button>
      </div>
    </aside>
  )
}
