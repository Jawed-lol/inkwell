"use client"

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
    useRef
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
    updateQuantity: (bookSlug: string, quantity: number) => void
    removeFromCart: (bookSlug: string) => void
    clearCart: () => void
}

interface CartApiResponse {
    items: CartItem[]
    message?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/cart"
const CART_STORAGE_KEY = "cart"
const DEBOUNCE_DELAY = 500

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([])
    const { token } = useAuth()
    
    // Refs for tracking state
    const loadedFromStorageRef = useRef(false)
    const isAuthTransitionRef = useRef(false)
    const previousTokenRef = useRef<string | null>(null)

    const syncCartWithBackend = useCallback(
        async (updatedCart: CartItem[]) => {
            if (!token) {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart))
                return
            }

            try {
                const payload = updatedCart
                    .filter(item => item && (item.slug || item._id))
                    .map(item => ({
                        slug: item.slug || item._id?.toString() || "",
                        quantity: item.quantity
                    }))

                const response = await fetch(API_URL, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ items: payload }),
                })
                
                if (!response.ok) {
                    throw new Error(`Failed to sync cart: ${response.status}`)
                }

                const data = (await response.json()) as CartApiResponse
                
                
                if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
                    return
                }
                
                setCart(data.items)
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data.items))
            } catch {
                // Fallback to local storage in case of error
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart))
            }
        },
        [token]
    )
    
    const debouncedSyncCart = debounce(syncCartWithBackend, DEBOUNCE_DELAY)

    // Initial load from localStorage (only once at component mount)
    useEffect(() => {
        if (typeof window === "undefined") return
        
        if (!loadedFromStorageRef.current) {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY)
            if (savedCart) {
                try {
                    const parsedCart = JSON.parse(savedCart)
                    if (Array.isArray(parsedCart)) {
                        setCart(parsedCart)
                    }
                } catch {
                    // Silent error in production
                }
            }
            loadedFromStorageRef.current = true
        }
    }, [])

    // Keep the cart in localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== "undefined" && !isAuthTransitionRef.current) {
            // Only save to localStorage if user is not logged in
            if (!token) {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
            }
        }
    }, [cart, token]);

    // Handle token changes (login/logout)
    useEffect(() => {
        if (typeof window === "undefined" || !loadedFromStorageRef.current) return
        
        isAuthTransitionRef.current = true
        
        // User logged out - don't clear backend cart
        if (!token && previousTokenRef.current) {
            // Clear local cart when logging out
            setCart([])
            localStorage.removeItem(CART_STORAGE_KEY)
            
            // Reset auth state
            previousTokenRef.current = null
            
            setTimeout(() => {
                isAuthTransitionRef.current = false
            }, 100)
            
            return
        }
        
        // No token (still logged out)
        if (!token) {
            isAuthTransitionRef.current = false
            return
        }
        
        // Token hasn't changed
        if (token === previousTokenRef.current) {
            isAuthTransitionRef.current = false
            return
        }
        
        // User logged in or token changed
        const loadCartFromBackend = async () => {
            try {
                // Save the local cart before fetching from backend
                const localCart = [...cart]
                setCart([])
                
                const response = await fetch(API_URL, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                
                if (!response.ok) {
                    throw new Error("Failed to load cart from backend")
                }
                
                const data = await response.json() as CartApiResponse
                const backendCart = data.items || []
                
                if (backendCart.length > 0) {
                    // If we had local items, merge them with backend cart
                    if (localCart.length > 0) {
                        // Create a map of backend items by slug for quick lookup
                        const backendItemMap = new Map(
                            backendCart.map(item => [item.slug, item])
                        )
                        
                        // Add local items that aren't in the backend cart
                        for (const localItem of localCart) {
                            if (!backendItemMap.has(localItem.slug)) {
                                backendCart.push(localItem)
                            } else {
                                // If item exists in both, add quantities
                                const backendItem = backendItemMap.get(localItem.slug)!
                                backendItem.quantity += localItem.quantity
                            }
                        }
                        
                        // Sync the merged cart with backend
                        syncCartWithBackend(backendCart)
                    }
                    
                    setCart(backendCart)
                } else {
                    if (localCart.length > 0) {
                        setCart(localCart)
                        syncCartWithBackend(localCart)
                    }
                }
            } catch  {
                // In case of error, restore the local cart
                const savedCart = localStorage.getItem(CART_STORAGE_KEY)
                if (savedCart) {
                    try {
                        const parsedCart = JSON.parse(savedCart)
                        if (Array.isArray(parsedCart)) {
                            setCart(parsedCart)
                        }
                    } catch  {
                        // Silent error in production
                    }
                }
            } finally {
                isAuthTransitionRef.current = false
            }
        }
        
        loadCartFromBackend()
        previousTokenRef.current = token
        
    }, [token, syncCartWithBackend, cart])
    
    const addToCart = useCallback(
        (book: Book) => {
            if (!book) {
                return
            }
            
            let bookSlug = book.slug
            if (!bookSlug && book.title) {
                bookSlug = book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            } else if (!bookSlug && book._id) {
                bookSlug = book._id.toString()
            }
            
            if (!bookSlug) {
                return
            }
            
            const bookWithSlug = {
                ...book,
                slug: bookSlug
            }
            
            setCart((prevCart) => {
                const existingItem = prevCart.find(
                    (item) => item.slug === bookWithSlug.slug
                )
                
                const safeBook = { 
                    ...bookWithSlug, 
                    price: typeof bookWithSlug.price === 'number' ? bookWithSlug.price : 0,
                }
                
                const newCart = existingItem
                    ? prevCart.map((item) =>
                          item.slug === bookWithSlug.slug
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
                
                // Immediately sync with backend instead of using debounced version
                // for deletion operations to ensure they happen right away
                if (token) {
                    syncCartWithBackend(newCart)
                } else {
                    debouncedSyncCart(newCart)
                }
                
                return newCart
            })
        },
        [debouncedSyncCart, syncCartWithBackend, token]
    )

    const clearCart = useCallback(() => {
        const emptyCart: CartItem[] = []
        setCart(emptyCart)
        
        if (token) {
            // Immediate sync for logged-in users
            syncCartWithBackend(emptyCart)
        } else {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(emptyCart))
            debouncedSyncCart(emptyCart)
        }
    }, [syncCartWithBackend, debouncedSyncCart, token])

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
