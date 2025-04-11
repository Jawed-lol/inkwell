const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

import axios from "axios"

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

interface UserProfile {
    id: string
    first_name: string
    second_name: string
    email: string
    createdAt: string
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

interface BooksResponse {
    success: boolean
    message?: string
    data: Book[]
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

interface BookResponse {
    success: boolean
    message?: string
    data: Book
}

interface WishlistResponse {
    success: boolean
    message?: string
    data?: Book[]
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

interface OrderResponse {
    success: boolean
    message?: string
    data: Order
}

interface OrdersResponse {
    success: boolean
    message?: string
    data: Order[]
}

// Shared request headers
const getAuthHeaders = (token: string) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
})

// Shared error handler for axios
const handleAxiosError = (error: unknown, defaultMessage: string): never => {
    if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || defaultMessage)
    }
    throw new Error(defaultMessage)
}

// Shared fetch handler
const handleFetchResponse = async (
    response: Response,
    errorMessage: string
) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorMessage)
    }
    return response.json()
}

export const registerUser = async (
    first_name: string,
    second_name: string,
    email: string,
    password: string
): Promise<AuthResponse> => {
    try {
        const response = await axios.post<AuthResponse>(
            `${BASE_URL}/api/auth/register`,
            { first_name, second_name, email, password }
        )
        return response.data
    } catch (error) {
        return handleAxiosError(error, "Registration failed")
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
    return handleFetchResponse(response, "Login failed")
}

export const addToWishlist = async (
    token: string,
    bookId: string
): Promise<WishlistResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/wishlist`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ bookId }),
    })
    return handleFetchResponse(response, "Failed to add to wishlist")
}

export const getWishlist = async (
    token: string
): Promise<WishlistResponse | Book[]> => {
    const response = await fetch(`${BASE_URL}/api/auth/wishlist`, {
        headers: getAuthHeaders(token),
    })
    return handleFetchResponse(response, "Failed to fetch wishlist")
}

export const removeFromWishlist = async (
    token: string,
    bookId: string
): Promise<WishlistResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/wishlist/${bookId}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
    })
    return handleFetchResponse(response, "Failed to remove from wishlist")
}

export const fetchBooks = async (
    page = 1,
    limit = 12
): Promise<BooksResponse> => {
    try {
        const response = await axios.get<BooksResponse>(
            `${BASE_URL}/api/books`,
            {
                params: { page, limit },
            }
        )
        return response.data
    } catch (error) {
        return handleAxiosError(error, "Failed to fetch books")
    }
}

export const fetchBookById = async (id: string): Promise<BookResponse> => {
    try {
        const response = await axios.get<BookResponse>(
            `${BASE_URL}/api/books/${id}`
        )
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch book")
        }
        return response.data
    } catch (error) {
        return handleAxiosError(error, "Failed to fetch book")
    }
}

export const updateProfile = async (
    token: string,
    data: { firstName?: string; lastName?: string; email?: string }
): Promise<AuthResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
    })
    return handleFetchResponse(response, "Failed to update profile")
}

export const getProfile = async (token: string): Promise<AuthResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        headers: getAuthHeaders(token),
    })
    return handleFetchResponse(response, "Failed to fetch profile")
}

export const getOrders = async (token: string): Promise<OrdersResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/orders`, {
        headers: getAuthHeaders(token),
    })
    return handleFetchResponse(response, "Failed to fetch orders")
}

export const placeOrder = async (
    token: string,
    items: OrderItem[]
): Promise<OrderResponse> => {
    const response = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ items }),
    })
    return handleFetchResponse(response, "Failed to place order")
}
