"use client"

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from "react"
import { Book } from "@/types/book"
import { useAuth } from "@/context/AuthContext"

function debounce<T extends (updatedCart: CartItem[]) => Promise<void>>(
    func: T,
    wait: number
): (updatedCart: CartItem[]) => void {
    let timeout: NodeJS.Timeout
    return (updatedCart: CartItem[]) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(updatedCart), wait)
    }
}

interface CartItem extends Book {
    quantity: number
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (book: Book) => void
    updateQuantity: (bookSlug: string, quantity: number) => void // Changed from bookId
    removeFromCart: (bookSlug: string) => void // Changed from bookId
    clearCart: () => void
}

interface CartApiPayloadItem {
    slug: string // Changed from _id
    quantity: number
}

interface CartApiResponse {
    items: CartItem[]
    message?: string
}

interface CartApiError {
    message: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/cart" // Adjusted to /cart
const CART_STORAGE_KEY = "cart"
const DEBOUNCE_DELAY = 500

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([])
    const { token } = useAuth()

    const syncCartWithBackend = useCallback(
        async (updatedCart: CartItem[]) => {
            if (!token) return

            try {
                const payload: CartApiPayloadItem[] = updatedCart.map(
                    (item) => ({
                        slug: item.slug, // Changed from _id
                        quantity: item.quantity,
                    })
                )

                const response = await fetch(API_URL, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ items: payload }),
                })

                if (!response.ok) {
                    const responseText = await response.text()
                    let errorData: CartApiError

                    try {
                        errorData = JSON.parse(responseText) as CartApiError
                    } catch {
                        errorData = { message: "Invalid JSON response" }
                    }

                    throw new Error(errorData.message || "Failed to sync cart")
                }

                const data = (await response.json()) as CartApiResponse
                setCart(data.items)
                localStorage.setItem(
                    CART_STORAGE_KEY,
                    JSON.stringify(data.items)
                )
            } catch (error) {
                console.error(
                    "Error syncing cart with backend:",
                    error instanceof Error ? error.message : String(error)
                )
            }
        },
        [token]
    )

    const debouncedSyncCart = debounce(syncCartWithBackend, DEBOUNCE_DELAY)

    useEffect(() => {
        if (typeof window === "undefined") return

        const savedCart = localStorage.getItem(CART_STORAGE_KEY)
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }

        const loadCartFromBackend = async () => {
            if (!token) {
                const emptyCart: CartItem[] = []
                setCart(emptyCart)
                localStorage.setItem(
                    CART_STORAGE_KEY,
                    JSON.stringify(emptyCart)
                )
                syncCartWithBackend(emptyCart)
                return
            }

            try {
                const response = await fetch(API_URL, {
                    headers: { Authorization: `Bearer ${token}` },
                })

                if (!response.ok) {
                    const errorData = (await response.json()) as CartApiError
                    throw new Error(errorData.message || "Failed to load cart")
                }

                const data = (await response.json()) as CartApiResponse
                const backendCart = data.items || []
                setCart(backendCart)
                localStorage.setItem(
                    CART_STORAGE_KEY,
                    JSON.stringify(backendCart)
                )
            } catch (error) {
                console.error(
                    "Error loading cart from backend:",
                    error instanceof Error ? error.message : String(error)
                )
            }
        }

        loadCartFromBackend()
    }, [token, syncCartWithBackend])

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
        }
    }, [cart])

    const addToCart = useCallback(
        (book: Book) => {
            setCart((prevCart) => {
                const existingItem = prevCart.find(
                    (item) => item.slug === book.slug
                ) // Changed from _id
                const safeBook = { ...book, price: book.price ?? 0 }

                const newCart = existingItem
                    ? prevCart.map((item) =>
                          item.slug === book.slug
                              ? { ...item, quantity: item.quantity + 1 }
                              : item
                      )
                    : [...prevCart, { ...safeBook, quantity: 1 }]

                debouncedSyncCart(newCart)
                return newCart
            })
        },
        [debouncedSyncCart]
    )

    const updateQuantity = useCallback(
        (bookSlug: string, quantity: number) => {
            setCart((prevCart) => {
                const newCart =
                    quantity <= 0
                        ? prevCart.filter((item) => item.slug !== bookSlug)
                        : prevCart.map((item) =>
                              item.slug === bookSlug
                                  ? { ...item, quantity }
                                  : item
                          )

                debouncedSyncCart(newCart)
                return newCart
            })
        },
        [debouncedSyncCart]
    )

    const removeFromCart = useCallback(
        (bookSlug: string) => {
            setCart((prevCart) => {
                const newCart = prevCart.filter(
                    (item) => item.slug !== bookSlug
                )
                debouncedSyncCart(newCart)
                return newCart
            })
        },
        [debouncedSyncCart]
    )

    const clearCart = useCallback(() => {
        const emptyCart: CartItem[] = []
        setCart(emptyCart)
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(emptyCart))
        syncCartWithBackend(emptyCart)
    }, [syncCartWithBackend])

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error("useCart must be used within a CartProvider")
    return context
}
