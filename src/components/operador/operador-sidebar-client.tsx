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
            className="text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="px-6 pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          Panel de operador
        </p>
      </div>

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
                  ? "border-l-2 border-primary bg-neutral-100 pl-[10px] text-neutral-900 font-medium"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
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

      <div className="border-t border-neutral-200 px-3 py-4 flex flex-col gap-1">
        {bottomItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50 cursor-pointer"
        >
          <SignOut className="h-4 w-4 shrink-0" />
          {isSigningOut ? "Saliendo..." : "Cerrar sesión"}
        </button>
      </div>
    </>
  )
}

export function OperadorSidebarClient() {
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
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 h-screen w-[250px] flex-col bg-white border-r border-neutral-200">
        <SidebarContent
          pathname={pathname}
          isSigningOut={isSigningOut}
          handleSignOut={handleSignOut}
        />
      </aside>

      <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between bg-white border-b border-neutral-200 px-4 lg:hidden">
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
          className="flex items-center justify-center p-1.5 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
          aria-label="Abrir menú"
        >
          <List className="h-6 w-6" />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 z-[70] flex h-full w-[min(280px,85vw)] flex-col bg-white transition-transform duration-300 ease-in-out lg:hidden ${
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
