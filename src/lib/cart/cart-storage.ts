import type { CartItem, CartSnapshot, LastCheckoutSnapshot } from "@/types/cart/cart.types"

const CART_STORAGE_KEY = "apacheta:cart"
const LAST_CHECKOUT_STORAGE_KEY = "apacheta:last-checkout"
const EMPTY_CART_SNAPSHOT: CartSnapshot = { items: [] }

type CartListener = () => void

const listeners = new Set<CartListener>()

let currentSnapshot = EMPTY_CART_SNAPSHOT
let initialized = false

function isBrowser() {
  return typeof window !== "undefined"
}

function cloneSnapshot(snapshot: CartSnapshot): CartSnapshot {
  return {
    items: snapshot.items.map((item) => ({ ...item })),
  }
}

function readCartSnapshotFromStorage(): CartSnapshot {
  if (!isBrowser()) {
    return EMPTY_CART_SNAPSHOT
  }

  const rawValue = window.localStorage.getItem(CART_STORAGE_KEY)

  if (!rawValue) {
    return EMPTY_CART_SNAPSHOT
  }

  try {
    const parsed = JSON.parse(rawValue) as CartSnapshot

    if (!Array.isArray(parsed.items)) {
      return EMPTY_CART_SNAPSHOT
    }

    return cloneSnapshot(parsed)
  } catch {
    return EMPTY_CART_SNAPSHOT
  }
}

function writeCartSnapshotToStorage(snapshot: CartSnapshot) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(snapshot))
}

function emitCartChange() {
  listeners.forEach((listener) => listener())
}

function ensureInitialized() {
  if (initialized) {
    return
  }

  currentSnapshot = readCartSnapshotFromStorage()
  initialized = true
}

function setSnapshot(snapshot: CartSnapshot) {
  currentSnapshot = cloneSnapshot(snapshot)
  writeCartSnapshotToStorage(currentSnapshot)
  emitCartChange()
}

export function subscribeToCart(listener: CartListener) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function getCartSnapshot() {
  ensureInitialized()

  return currentSnapshot
}

export function addCartItem(item: CartItem) {
  ensureInitialized()

  const existingItem = currentSnapshot.items.find(
    (currentItem) => currentItem.id === item.id,
  )

  if (!existingItem) {
    setSnapshot({
      items: [...currentSnapshot.items, item],
    })

    return
  }

  setSnapshot({
    items: currentSnapshot.items.map((currentItem) =>
      currentItem.id === item.id
        ? {
            ...currentItem,
            quantity: currentItem.quantity + item.quantity,
          }
        : currentItem,
    ),
  })
}

export function updateCartItemQuantity(id: string, quantity: number) {
  ensureInitialized()

  setSnapshot({
    items: currentSnapshot.items.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.max(1, quantity),
          }
        : item,
    ),
  })
}

export function removeCartItem(id: string) {
  ensureInitialized()

  setSnapshot({
    items: currentSnapshot.items.filter((item) => item.id !== id),
  })
}

export function clearCart() {
  ensureInitialized()
  setSnapshot(EMPTY_CART_SNAPSHOT)
}

export function saveLastCheckoutSnapshot(snapshot: LastCheckoutSnapshot) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(
    LAST_CHECKOUT_STORAGE_KEY,
    JSON.stringify(snapshot),
  )
}

export function loadLastCheckoutSnapshot(): LastCheckoutSnapshot | null {
  if (!isBrowser()) {
    return null
  }

  const rawValue = window.localStorage.getItem(LAST_CHECKOUT_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as LastCheckoutSnapshot
  } catch {
    return null
  }
}
