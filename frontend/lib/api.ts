import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export const registerUser = async (
    first_name: string,
    second_name: string,
    email: string,
    password: string
): Promise<any> => {
    try {
        console.log(`Registering user at: ${BASE_URL}/api/auth/register`)
        const response = await axios.post(`${BASE_URL}/api/auth/register`, {
            first_name,
            second_name,
            email,
            password,
        })
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

export const loginUser = async (email: string, password: string) => {
    const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
        throw new Error("Login failed")
    }
    return response.json()
}

export const addToWishlist = async (token: string, bookId: string) => {
    const response = await fetch("http://localhost:5000/api/auth/wishlist", {
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
    return response.json()
}

export const getWishlist = async (token: string) => {
    const response = await fetch("http://localhost:5000/api/auth/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) {
        throw new Error("Failed to fetch wishlist")
    }
    return response.json()
}

export const removeFromWishlist = async (token: string, bookId: string) => {
    const response = await fetch(
        `http://localhost:5000/api/auth/wishlist/${bookId}`,
        {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        }
    )
    if (!response.ok) {
        throw new Error("Failed to remove from wishlist")
    }
    return response.json()
}

export const fetchBooks = async (page = 1, limit = 10): Promise<any> => {
    try {
        const response = await axios.get(`${BASE_URL}/api/books`, {
            params: { page, limit },
        })
        if (!Array.isArray(response.data.data)) {
            throw new Error("API did not return an array")
        }
        return response.data
    } catch (error) {
        console.error("Error fetching books:", error)
        throw error
    }
}

export const fetchBookById = async (id: string): Promise<any> => {
    try {
        console.log(`Fetching book by ID at: ${BASE_URL}/api/books/${id}`)
        const response = await axios.get(`${BASE_URL}/api/books/${id}`)
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
