"use client"

import { toast } from "sonner"

import { SidebarCotizacion } from "@/components/product/sidebar-cotizacion"
import { useCart } from "@/hooks/use-cart"
import type { CartItem } from "@/types/cart/cart.types"

interface SidebarCotizacionCartProps {
  precio: number
  moneda: string
  fecha?: string
  duracion: string
  longitud?: string
  tipo: "paquete" | "experiencia"
  cartItem: CartItem | null
}

export function SidebarCotizacionCart({
  cartItem,
  ...sidebarProps
}: SidebarCotizacionCartProps) {
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
    <SidebarCotizacion
      {...sidebarProps}
      onAgregarAlCarro={handleAgregarAlCarro}
    />
  )
}
