"use client"

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react"
import { Book } from "@/types/book"
import { useAuth } from "@/context/AuthContext"

// Debounce utility to throttle frequent calls
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}

interface CartItem extends Book {
    quantity: number
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (book: Book) => void
    updateQuantity: (bookId: string, quantity: number) => void
    removeFromCart: (bookId: string) => void
    clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        if (typeof window === "undefined") return []
        const savedCart = localStorage.getItem("cart")
        return savedCart ? JSON.parse(savedCart) : []
    })
    const { token } = useAuth()

    // Load cart from backend when token changes (login/logout)
    useEffect(() => {
        const loadCartFromBackend = async () => {
            if (!token) {
                setCart([])
                localStorage.setItem("cart", JSON.stringify([]))
                syncCartWithBackend([]) // Clear backend cart on logout
                return
            }
            try {
                const response = await fetch("http://localhost:5000/api/cart", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.message || "Failed to load cart")
                }
                const data = await response.json()
                const backendCart = data.items || []
                console.log(
                    "Loaded backend cart:",
                    JSON.stringify(backendCart, null, 2)
                )
                setCart(backendCart)
                localStorage.setItem("cart", JSON.stringify(backendCart))
            } catch (error) {
                console.error("Error loading cart from backend:", error)
            }
        }
        loadCartFromBackend()
    }, [token])

    const syncCartWithBackend = async (updatedCart: CartItem[]) => {
        if (!token) return
        try {
            const payload = updatedCart.map((item) => ({
                _id: item._id,
                quantity: item.quantity,
            }))
            console.log(
                "Syncing cart with payload:",
                JSON.stringify(payload, null, 2)
            )
            const response = await fetch("http://localhost:5000/api/cart", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ items: payload }),
            })
            const responseText = await response.text()
            console.log("Raw PUT response:", responseText)
            if (!response.ok) {
                let errorData
                try {
                    errorData = JSON.parse(responseText)
                } catch {
                    errorData = { message: "Invalid JSON response" }
                }
                console.error("Sync error response:", errorData)
                throw new Error(errorData.message || "Failed to sync cart")
            }
            const data = JSON.parse(responseText)
            console.log("Sync response:", JSON.stringify(data.items, null, 2))
            setCart(data.items)
            localStorage.setItem("cart", JSON.stringify(data.items))
        } catch (error) {
            console.error("Error syncing cart with backend:", error)
        }
    }

    const debouncedSyncCart = debounce(syncCartWithBackend, 500) // 500ms debounce

    // Update localStorage when cart changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart])

    const addToCart = (book: Book) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item._id === book._id)
            const safeBook = { ...book, price: book.price ?? 0 }
            const newCart = existingItem
                ? prevCart.map((item) =>
                      item._id === book._id
                          ? { ...item, quantity: item.quantity + 1 }
                          : item
                  )
                : [...prevCart, { ...safeBook, quantity: 1 }]
            debouncedSyncCart(newCart)
            return newCart
        })
    }

    const updateQuantity = (bookId: string, quantity: number) => {
        setCart((prevCart) => {
            const newCart =
                quantity <= 0
                    ? prevCart.filter((item) => item._id !== bookId)
                    : prevCart.map((item) =>
                          item._id === bookId ? { ...item, quantity } : item
                      )
            debouncedSyncCart(newCart)
            return newCart
        })
    }

    const removeFromCart = (bookId: string) => {
        setCart((prevCart) => {
            const newCart = prevCart.filter((item) => item._id !== bookId)
            debouncedSyncCart(newCart)
            return newCart
        })
    }

    const clearCart = () => {
        setCart([])
        localStorage.setItem("cart", JSON.stringify([]))
        syncCartWithBackend([]) // Immediate sync
    }

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
