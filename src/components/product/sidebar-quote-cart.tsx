"use client"

import { toast } from "sonner"

import { SidebarQuote } from "@/components/product/sidebar-quote"
import { useCart } from "@/hooks/use-cart"
import type { CartItem } from "@/types/cart/cart.types"

interface SidebarQuoteCartProps {
  precio: number
  moneda: string
  fecha?: string
  duracion: string
  longitud?: string
  tipo: "paquete" | "experiencia"
  cartItem: CartItem | null
}

export function SidebarQuoteCart({
  cartItem,
  ...sidebarProps
}: SidebarQuoteCartProps) {
  const { addItem } = useCart()

  function handleAgregarAlCarro() {
    if (!cartItem) {
      toast.error("No hay disponibilidad para agregar esta opción al carrito.")
      return
    }

    addItem(cartItem)
    toast.success("Se agregó al carrito.")
  }

  return (
    <SidebarQuote
      {...sidebarProps}
      onAgregarAlCarro={handleAgregarAlCarro}
    />
  )
}
