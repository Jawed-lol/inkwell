"use client"

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react"
import { Book } from "@/types/book"

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
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem("cart")
            return savedCart ? JSON.parse(savedCart) : []
        }
        return []
    })

    // Load cart from backend on mount
    useEffect(() => {
        const loadCartFromBackend = async () => {
            const token = localStorage.getItem("authToken")
            if (token) {
                try {
                    const response = await fetch(
                        "http://localhost:5000/api/cart",
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    )
                    const data = await response.json()
                    if (data.items && data.items.length > 0) {
                        setCart(data.items)
                        localStorage.setItem("cart", JSON.stringify(data.items))
                    }
                } catch (error) {
                    console.error("Error loading cart from backend:", error)
                }
            }
        }
        loadCartFromBackend()
    }, [])

    const syncCartWithBackend = async (updatedCart: CartItem[]) => {
        try {
            const token = localStorage.getItem("authToken")
            if (token) {
                // Temporarily disable until endpoint exists
                console.log("Cart sync skipped - endpoint not implemented yet")
                // const response = await fetch("http://localhost:5000/api/cart", {
                //   method: "PUT",
                //   headers: {
                //     "Content-Type": "application/json",
                //     "Authorization": `Bearer ${token}`,
                //   },
                //   body: JSON.stringify({ items: updatedCart }),
                // });
                // if (!response.ok) throw new Error("Failed to sync cart");
            }
        } catch (error) {
            console.error("Error syncing cart with backend:", error)
        }
    }

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
        syncCartWithBackend(cart)
    }, [cart])

    const addToCart = (book: Book) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item._id === book._id)
            if (existingItem) {
                return prevCart.map((item) =>
                    item._id === book._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prevCart, { ...book, quantity: 1 }]
        })
    }

    const updateQuantity = (bookId: string, quantity: number) => {
        setCart((prevCart) => {
            if (quantity <= 0) {
                return prevCart.filter((item) => item._id !== bookId)
            }
            return prevCart.map((item) =>
                item._id === bookId ? { ...item, quantity } : item
            )
        })
    }

    const removeFromCart = (bookId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== bookId))
    }

    const clearCart = () => {
        setCart([])
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
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
