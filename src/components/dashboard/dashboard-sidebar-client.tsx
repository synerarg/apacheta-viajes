"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"
import {
  SquaresFour,
  Suitcase,
  Star,
  Van,
  Globe,
  SignOut,
  List,
  X,
  UsersFour,
  UserPlus,
  Calculator,
  Tag,
  Stack,
  CaretDown,
} from "@phosphor-icons/react"

import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

type IconComponent = React.ComponentType<{
  className?: string
  weight?: "regular" | "fill"
}>

type NavLink = {
  href: string
  label: string
  icon: IconComponent
  exact: boolean
}

type NavGroup = {
  label: string
  icon: IconComponent
  items: NavLink[]
}

type NavEntry = NavLink | NavGroup

function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry
}

function isActive(pathname: string, href: string, exact: boolean) {
  return exact ? pathname === href : pathname.startsWith(href)
}

const navItems: NavEntry[] = [
  { href: "/dashboard", label: "Dashboard", icon: SquaresFour, exact: true },
  {
    label: "Catálogo",
    icon: Stack,
    items: [
      { href: "/dashboard/paquetes", label: "Paquetes", icon: Suitcase, exact: false },
      {
        href: "/dashboard/experiencias",
        label: "Experiencias",
        icon: Star,
        exact: false,
      },
      { href: "/dashboard/traslados", label: "Traslados", icon: Van, exact: false },
    ],
  },
  {
    href: "/dashboard/cotizador",
    label: "Cotizador",
    icon: Calculator,
    exact: false,
  },
  {
    label: "Gestión de Operadores",
    icon: UsersFour,
    items: [
      {
        href: "/dashboard/operadores",
        label: "Operadores",
        icon: UsersFour,
        exact: true,
      },
      {
        href: "/dashboard/operadores/solicitudes",
        label: "Solicitudes",
        icon: UserPlus,
        exact: false,
      },
      {
        href: "/dashboard/operadores/tipos",
        label: "Tipos de operador",
        icon: Tag,
        exact: false,
      },
    ],
  },
]

function NavItemLink({
  item,
  active,
  nested,
  onNavigate,
}: {
  item: NavLink
  active: boolean
  nested?: boolean
  onNavigate?: () => void
}) {
  const Icon = item.icon
  const padding = nested
    ? active
      ? "border-l-2 border-primary pl-[34px] pr-3"
      : "pl-9 pr-3"
    : active
    ? "border-l-2 border-primary pl-[10px] pr-3"
    : "px-3"
  const colors = active
    ? "bg-white/5 text-white"
    : "text-white/60 hover:bg-white/5 hover:text-white/90"

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-sm py-2.5 text-sm transition-colors ${padding} ${colors}`}
    >
      <Icon className="h-4 w-4 shrink-0" weight={active ? "fill" : "regular"} />
      {item.label}
    </Link>
  )
}

function NavGroupItem({
  group,
  pathname,
  onNavigate,
}: {
  group: NavGroup
  pathname: string
  onNavigate?: () => void
}) {
  const Icon = group.icon
  const hasActiveChild = group.items.some((item) =>
    isActive(pathname, item.href, item.exact),
  )
  const [open, setOpen] = useState(hasActiveChild)
  const expanded = open || hasActiveChild

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={expanded}
        className={`flex w-full cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
          hasActiveChild
            ? "text-white"
            : "text-white/60 hover:bg-white/5 hover:text-white/90"
        }`}
      >
        <Icon
          className="h-4 w-4 shrink-0"
          weight={hasActiveChild ? "fill" : "regular"}
        />
        <span className="flex-1 text-left">{group.label}</span>
        <CaretDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {expanded ? (
        <div className="mt-1 flex flex-col gap-1">
          {group.items.map((item) => (
            <NavItemLink
              key={item.href}
              item={item}
              active={isActive(pathname, item.href, item.exact)}
              nested
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function SidebarContent({
  pathname,
  isSigningOut,
  handleSignOut,
  onClose,
}: {
  pathname: string
  isSigningOut: boolean
  handleSignOut: () => void
  onClose?: () => void
}) {
  return (
    <>
      {/* Logo + close button */}
      <div className="flex items-center justify-between px-6 py-6">
        <Link href="/dashboard" onClick={onClose}>
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

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
        {navItems.map((entry) =>
          isGroup(entry) ? (
            <NavGroupItem
              key={entry.label}
              group={entry}
              pathname={pathname}
              onNavigate={onClose}
            />
          ) : (
            <NavItemLink
              key={entry.href}
              item={entry}
              active={isActive(pathname, entry.href, entry.exact)}
              onNavigate={onClose}
            />
          ),
        )}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-white/10 px-3 py-4 flex flex-col gap-1">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white/90"
        >
          <Globe className="h-4 w-4 shrink-0" />
          Ir al sitio web
        </Link>
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

export function DashboardSidebarClient() {
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
      {/* ── Desktop sidebar — visible only on lg+ ── */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 h-screen w-[250px] flex-col bg-[#2E2726]">
        <SidebarContent
          pathname={pathname}
          isSigningOut={isSigningOut}
          handleSignOut={handleSignOut}
        />
      </aside>

      {/* ── Mobile topbar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between bg-[#2E2726] px-4 lg:hidden">
        <Link href="/dashboard">
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

      {/* ── Mobile drawer backdrop ── */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* ── Mobile drawer panel (slides from left) ── */}
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
        />
      </div>
    </>
  )
}
