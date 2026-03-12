"use client"

import { useMemo, useSyncExternalStore } from "react"

import {
  addCartItem,
  clearCart,
  getCartSnapshot,
  removeCartItem,
  subscribeToCart,
  updateCartItemQuantity,
} from "@/lib/cart/cart-storage"

const EMPTY_CART_SNAPSHOT = { items: [] }

export function useCart() {
  const snapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    () => EMPTY_CART_SNAPSHOT,
  )

  const subtotal = useMemo(
    () =>
      snapshot.items.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0,
      ),
    [snapshot.items],
  )

  const totalItems = useMemo(
    () =>
      snapshot.items.reduce((total, item) => total + item.quantity, 0),
    [snapshot.items],
  )

  return {
    items: snapshot.items,
    subtotal,
    totalItems,
    isEmpty: snapshot.items.length === 0,
    addItem: addCartItem,
    updateItemQuantity: updateCartItemQuantity,
    removeItem: removeCartItem,
    clearCart,
  }
}
