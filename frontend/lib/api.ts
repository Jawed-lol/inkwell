const BASE_URL = process.env.NEXT_PUBLIC_API_URL
import axios from "axios"

export interface LegacyBooksResponse {
    success: boolean
    message?: string
    data: Book[]
    totalPages: number
}

interface AuthResponse {
    success: boolean
    message?: string
    token?: string
    name?: string
    email?: string
    createdAt?: string
    wishlistItems?: number
    orderedItems?: number
    user?: UserProfile
}

interface UserProfile {
    id: string
    first_name: string
    second_name: string
    email: string
    createdAt: string
}

interface Book {
    _id: string
    title: string
    author: string
    price: number
    genre: string
    description: string
    urlPath: string
    category: string
    isbn: string
    publication_year: number
    publisher: string
    pages_number: number
    inStock?: boolean
    rating?: number
    language: string
    format?: string
    reviews_number?: number
}

export interface BooksResponse {
    success: boolean
    message?: string
    data: Book[]
    pagination: Pagination
}
export interface Pagination {
    total: number
    page: number
    limit: number
    totalPages: number
}

interface BookResponse {
    success: boolean
    message?: string
    data: Book
}

interface WishlistResponse {
    success: boolean
    message?: string
    data: Book[]
}

interface OrderItem {
    bookId: {
        _id: string
        title: string
        urlPath: string
    }
    quantity: number
    price: number
}

interface Order {
    _id: string
    orderId: string
    items: OrderItem[]
    total: number
    createdAt: string
}

interface OrdersResponse {
    success: boolean
    message?: string
    data: Order[]
}

interface OrderResponse {
    success: boolean
    message?: string
    data: Order
}

export const registerUser = async (
    first_name: string,
    second_name: string,
    email: string,
    password: string
): Promise<AuthResponse> => {
    try {
        console.log(`Registering user at: ${BASE_URL}/api/auth/register`)
        const response = await axios.post<AuthResponse>(
            `${BASE_URL}/api/auth/register`,
            {
                first_name,
                second_name,
                email,
                password,
            }
        )
        return response.data
    } catch (error) {
        console.error("Error registering user:", error)
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(
                error.response.data.message || "Registration failed"
            )
        }
        throw error
    }
}

export const loginUser = async (
    email: string,
    password: string
): Promise<AuthResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
        throw new Error("Login failed")
    }

    return response.json() as Promise<AuthResponse>
}

export const addToWishlist = async (
    token: string,
    bookId: string
): Promise<WishlistResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/wishlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId }),
    })

    if (!response.ok) {
        throw new Error("Failed to add to wishlist")
    }

    return response.json() as Promise<WishlistResponse>
}

export const getWishlist = async (token: string): Promise<WishlistResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
        throw new Error("Failed to fetch wishlist")
    }

    return response.json() as Promise<WishlistResponse>
}

export const removeFromWishlist = async (
    token: string,
    bookId: string
): Promise<WishlistResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/wishlist/${bookId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
        throw new Error("Failed to remove from wishlist")
    }

    return response.json() as Promise<WishlistResponse>
}

export const fetchBooks = async (
    page = 1,
    limit = 12
): Promise<BooksResponse | LegacyBooksResponse> => {
    const response = await axios.get(`${BASE_URL}/api/books`, {
        params: { page, limit },
    })
    return response.data
}

export const fetchBookById = async (id: string): Promise<BookResponse> => {
    try {
        console.log(`Fetching book by ID at: ${BASE_URL}/api/books/${id}`)
        const response = await axios.get<BookResponse>(
            `${BASE_URL}/api/books/${id}`
        )

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch book")
        }

        return response.data
    } catch (error) {
        console.error("Error fetching book by ID:", error)
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(
                error.response.data.message || "Failed to fetch book"
            )
        }
        throw error
    }
}

interface ProfileUpdateData {
    firstName?: string
    lastName?: string
    email?: string
}

export const updateProfile = async (
    token: string,
    data: ProfileUpdateData
): Promise<AuthResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error("Failed to update profile")
    }

    return response.json() as Promise<AuthResponse>
}

export const getProfile = async (token: string): Promise<AuthResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
        throw new Error("Failed to fetch profile")
    }

    return response.json() as Promise<AuthResponse>
}

export const getOrders = async (token: string): Promise<OrdersResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/orders`, {
        headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
        throw new Error("Failed to fetch orders")
    }

    return response.json() as Promise<OrdersResponse>
}

export const placeOrder = async (
    token: string,
    items: OrderItem[]
): Promise<OrderResponse> => {
    const response = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items }),
    })

    if (!response.ok) {
        throw new Error("Failed to place order")
    }

    return response.json() as Promise<OrderResponse>
}
