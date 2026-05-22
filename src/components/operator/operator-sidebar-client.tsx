"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  FileText,
  Plus,
  UserCircle,
  SignOut,
  List,
  X,
  Globe,
} from "@phosphor-icons/react"

import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

const navItems = [
  {
    href: "/operador",
    label: "Mis cotizaciones",
    icon: FileText,
    exact: true,
  },
  {
    href: "/operador/cotizaciones/nueva",
    label: "Nueva cotización",
    icon: Plus,
    exact: false,
  },
]

const bottomItems = [
  { href: "/account", label: "Mi perfil", icon: UserCircle },
  { href: "/", label: "Ir al sitio web", icon: Globe },
]

type OperatorTier = { nombre: string; comisionPct: number } | null

function formatCommission(value: number) {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

function TierBadge({ tier }: { tier: OperatorTier }) {
  if (!tier) return null
  return (
    <div className="mx-3 mb-4 rounded-md bg-white/5 px-3 py-2.5 ring-1 ring-white/10">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
        Tu categoría
      </p>
      <p className="mt-1 text-sm font-semibold text-white">{tier.nombre}</p>
      <p className="mt-0.5 text-xs text-emerald-300">
        Comisión base {formatCommission(tier.comisionPct)}%
      </p>
    </div>
  )
}

function SidebarContent({
  pathname,
  isSigningOut,
  handleSignOut,
  onClose,
  tier,
}: {
  pathname: string
  isSigningOut: boolean
  handleSignOut: () => void
  onClose?: () => void
  tier: OperatorTier
}) {
  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 py-6">
        <Link href="/operador" onClick={onClose}>
          <Image
            src="/logo.png"
            alt="Apacheta Viajes"
            width={140}
            height={80}
            className="h-auto w-auto"
          />
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="px-6 pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Panel de operador
        </p>
      </div>

      <TierBadge tier={tier} />

      <nav className="flex flex-1 flex-col gap-1 px-3 pt-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
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

      <div className="border-t border-white/10 px-3 py-4 flex flex-col gap-1">
        {bottomItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white/90"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white/90 disabled:opacity-50 cursor-pointer"
        >
          <SignOut className="h-4 w-4 shrink-0" />
          {isSigningOut ? "Saliendo..." : "Cerrar sesión"}
        </button>
      </div>
    </>
  )
}

export function OperatorSidebarClient({
  tier = null,
}: {
  tier?: OperatorTier
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSigningOut, startSignOut] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  function handleSignOut() {
    startSignOut(async () => {
      await supabase.auth.signOut()
      router.replace("/login")
    })
  }

  return (
    <>
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 h-screen w-[250px] flex-col bg-[#2E2726]">
        <SidebarContent
          pathname={pathname}
          isSigningOut={isSigningOut}
          handleSignOut={handleSignOut}
          tier={tier}
        />
      </aside>

      <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between bg-[#2E2726] px-4 lg:hidden">
        <Link href="/operador">
          <Image
            src="/logo.png"
            alt="Apacheta Viajes"
            width={110}
            height={48}
            className="h-8 w-auto"
          />
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center p-1.5 text-white/70 hover:text-white transition-colors cursor-pointer"
          aria-label="Abrir menú"
        >
          <List className="h-6 w-6" />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 z-[70] flex h-full w-[min(280px,85vw)] flex-col bg-[#2E2726] transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          pathname={pathname}
          isSigningOut={isSigningOut}
          handleSignOut={handleSignOut}
          onClose={() => setIsOpen(false)}
          tier={tier}
        />
      </div>
    </>
  )
}
