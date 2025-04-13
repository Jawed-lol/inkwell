const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

import axios from "axios"

interface BookReviewData {
    user_id: string
    rating: number
    _id?: string
    comment?: string
    created_at: string
}

interface BookData {
    _id: string
    title: string
    author: string
    price: number
    urlPath: string
    synopsis: string
    page_count: number
    publication_year: number
    genre: string
    publisher: string
    language: string
    isbn: string
    reviews: BookReviewData[]
    reviews_number: number
    author_bio?: string
    description: string
    pages_number: number
}

interface UserProfileData {
    id: string
    first_name: string
    second_name: string
    email: string
    createdAt: string
}

interface RegisterResponse {
    success: boolean
    message?: string
    token?: string
    name?: string
    email?: string
    createdAt?: string
    wishlistItems?: number
    orderedItems?: number
    user?: UserProfileData
}

interface LoginResponse {
    success: boolean
    message?: string
    token?: string
    name?: string
    email?: string
    createdAt?: string
    wishlistItems?: number
    orderedItems?: number
    user?: UserProfileData
}

interface UpdateProfileResponse {
    success: boolean
    message?: string
    user?: UserProfileData
}

interface FetchProfileResponse {
    success: boolean
    message?: string
    user?: UserProfileData
    token?: string
    name?: string
    email?: string
    createdAt?: string
    wishlistItems?: number
    orderedItems?: number
}

interface FetchBooksResponse {
    success: boolean
    message?: string
    data: BookData[]
    totalPages: number
    currentPage: number
}

interface SearchBooksResponse {
    success: boolean
    message?: string
    data: BookData[]
    totalPages: number
    currentPage: number
}

interface FetchBookResponse {
    success: boolean
    message?: string
    data: BookData
}

interface WishlistResponse {
    success: boolean
    message?: string
    data: BookData[]
}

interface OrderItemData {
    bookId: {
        _id: string
        title: string
        urlPath: string
    }
    quantity: number
    price: number
}

interface OrderData {
    _id: string
    orderId: string
    items: OrderItemData[]
    total: number
    createdAt: string
}

interface PlaceOrderResponse {
    success: boolean
    message?: string
    data: OrderData
}

interface FetchOrdersResponse {
    success: boolean
    message?: string
    data: OrderData[]
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
): Promise<RegisterResponse> => {
    try {
        const response = await axios.post<RegisterResponse>(
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
): Promise<LoginResponse> => {
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

export const getWishlist = async (token: string): Promise<WishlistResponse> => {
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
): Promise<FetchBooksResponse> => {
    try {
        const response = await axios.get<FetchBooksResponse>(
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

export const fetchBookById = async (id: string): Promise<FetchBookResponse> => {
    try {
        const response = await axios.get<FetchBookResponse>(
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

export const fetchBooksBySearch = async (
    query: string
): Promise<SearchBooksResponse> => {
    try {
        const response = await axios.get<SearchBooksResponse>(
            `${BASE_URL}/api/books/search`,
            {
                params: { q: query },
            }
        )
        if (!response.data.success) {
            throw new Error(
                response.data.message || "Failed to fetch search results"
            )
        }
        return response.data
    } catch (error) {
        console.error("Error fetching search results:", error)
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(
                error.response.data.message || "Failed to fetch search results"
            )
        }
        throw error
    }
}

export const updateProfile = async (
    token: string,
    data: { firstName?: string; lastName?: string; email?: string }
): Promise<UpdateProfileResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
    })
    return handleFetchResponse(response, "Failed to update profile")
}

export const getProfile = async (
    token: string
): Promise<FetchProfileResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        headers: getAuthHeaders(token),
    })
    return handleFetchResponse(response, "Failed to fetch profile")
}

export const getOrders = async (
    token: string
): Promise<FetchOrdersResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/orders`, {
        headers: getAuthHeaders(token),
    })
    return handleFetchResponse(response, "Failed to fetch orders")
}

export const placeOrder = async (
    token: string,
    items: OrderItemData[]
): Promise<PlaceOrderResponse> => {
    const response = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ items }),
    })
    return handleFetchResponse(response, "Failed to place order")
}
