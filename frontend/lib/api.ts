import axios, { AxiosError } from "axios"
import { Book } from "@/types/book"

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`

// Types


interface UserProfile {
    success: boolean
    name: string
    email: string
    createdAt: string
    wishlistItems: number
    orderedItems: number
}

interface OrderItem {
    bookSlug: string
    book: Book | null
    quantity: number
    price: number
    _id: string
}

interface Order {
    _id: string
    orderId: string
    items: OrderItem[]
    total: number
    createdAt: string
}

// Response Types
interface AuthResponse { 
    success?: boolean
    token: string 
    message?: string
}

interface WishlistResponse { 
    message: string
    wishlist: Book[] 
}

interface BooksResponse {
    success: boolean
    message?: string
    data: Book[]
    totalPages: number
    currentPage: number
}

interface BookResponse { 
    success: boolean
    message?: string
    data: Book 
}

interface OrderResponse { 
    success: boolean
    message: string
    data: Order 
}

interface OrdersResponse {
    success: boolean
    message?: string
    orders: Order[]
    totalPages: number
    currentPage: number
}

// API Client
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
})

const getAuthHeaders = (token: string) => ({
    Authorization: `Bearer ${token}`,
})

const handleError = (error: unknown, defaultMessage: string): never => {
    if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message || defaultMessage)
    }
    throw new Error(defaultMessage)
}

// API Functions
export const authService = {
    register: async (
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ): Promise<AuthResponse> => {
        try {
            const { data } = await apiClient.post("/auth/register", {
                firstName,
                lastName,
                email,
                password,
            })
            return data
        } catch (error) {
            return handleError(error, "Registration failed")
        }
    },

    login: async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const { data } = await apiClient.post("/auth/login", {
                email,
                password,
            })
            return data
        } catch (error) {
            return handleError(error, "Login failed")
        }
    },

    updateProfile: async (
        token: string,
        userData: { firstName?: string; lastName?: string; email?: string }
    ): Promise<UserProfile> => {
        try {
            const { data } = await apiClient.put("/auth/profile", userData, {
                headers: getAuthHeaders(token),
            })
            return data
        } catch (error) {
            return handleError(error, "Failed to update profile")
        }
    },

    getProfile: async (token: string): Promise<UserProfile> => {
        try {
            const { data } = await apiClient.get("/auth/profile", {
                headers: getAuthHeaders(token),
            })
            return data
        } catch (error) {
            return handleError(error, "Failed to fetch profile")
        }
    },
}

export const bookService = {
    fetchBooks: async (page = 1, limit = 12): Promise<BooksResponse> => {
        try {
            const { data } = await apiClient.get("/books", {
                params: { page, limit },
            })
            return data
        } catch (error) {
            return handleError(error, "Failed to fetch books")
        }
    },

    fetchBySlug: async (slug: string): Promise<BookResponse> => {
        try {
            const { data } = await apiClient.get(`/books/${slug}`)
            return data
        } catch (error) {
            return handleError(error, "Failed to fetch book")
        }
    },

    search: async (query: string): Promise<BooksResponse> => {
        try {
            const { data } = await apiClient.get("/books/search", {
                params: { q: query },
            })
            return data
        } catch (error) {
            return handleError(error, "Failed to fetch search results")
        }
    },
}

export const wishlistService = {
    add: async (token: string, bookSlug: string): Promise<WishlistResponse> => {
        try {
            const { data } = await apiClient.post(
                "/auth/wishlist",
                { bookSlug },
                { headers: getAuthHeaders(token) }
            )
            return data
        } catch (error) {
            return handleError(error, "Failed to add to wishlist")
        }
    },

    get: async (token: string): Promise<WishlistResponse> => {
        try {
            const { data } = await apiClient.get<Book[]>("/auth/wishlist", {
                headers: getAuthHeaders(token),
            })
            return { message: "Wishlist fetched successfully", wishlist: data }
        } catch (error) {
            return handleError(error, "Failed to fetch wishlist")
        }
    },

    remove: async (
        token: string,
        bookSlug: string
    ): Promise<WishlistResponse> => {
        try {
            const { data } = await apiClient.delete(
                `/auth/wishlist/${bookSlug}`,
                {
                    headers: getAuthHeaders(token),
                }
            )
            return data
        } catch (error) {
            return handleError(error, "Failed to remove from wishlist")
        }
    },
}

export const orderService = {
    get: async (
        token: string,
        page = 1,
        limit = 10
    ): Promise<OrdersResponse> => {
        try {
            const { data } = await apiClient.get("/orders", {
                headers: getAuthHeaders(token),
                params: { page, limit },
            })
            return data
        } catch (error) {
            return handleError(error, "Failed to fetch orders")
        }
    },

    place: async (
        token: string,
        items: OrderItem[]
    ): Promise<OrderResponse> => {
        try {
            const { data } = await apiClient.post(
                "/orders",
                { items },
                { headers: getAuthHeaders(token) }
            )
            return data
        } catch (error) {
            return handleError(error, "Failed to place order")
        }
    },
}
