"use client"

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react"
import { useRouter } from "next/navigation"

// Define API base URL as a constant
const API_BASE_URL = 'https://inkwell-oblr.onrender.com/api'

interface User {
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    loading: boolean
    isAuthenticated: boolean
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const logout = useCallback(() => {
        localStorage.removeItem("authToken")
        setToken(null)
        setUser(null)
        router.push("/login")
    }, [router])

    const fetchProfile = useCallback(
        async (authToken: string) => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/auth/profile`,
                    {
                        headers: { 
                            Authorization: `Bearer ${authToken}`,
                            'Content-Type': 'application/json'
                        },
                    }
                )

                if (response.ok) {
                    const data = await response.json()
                    setUser(data)
                } else {
                    // Token is invalid or expired
                    logout()
                }
            } catch (error) {
                console.error("Profile fetch error:", error)
                logout()
            } finally {
                setLoading(false)
            }
        },
        [logout]
    )

    useEffect(() => {
        // Skip on server-side
        if (typeof window === "undefined") {
            setLoading(false)
            return
        }

        const storedToken = localStorage.getItem("authToken")

        if (storedToken) {
            setToken(storedToken)
            fetchProfile(storedToken)
        } else {
            setLoading(false)
        }
    }, [fetchProfile])

    const login = useCallback(
        (newToken: string) => {
            localStorage.setItem("authToken", newToken)
            setToken(newToken)
            fetchProfile(newToken)
            router.push("/dashboard")
        },
        [fetchProfile, router]
    )

    const value = {
        user, 
        token, 
        loading, 
        isAuthenticated: !!token, 
        login, 
        logout 
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}
