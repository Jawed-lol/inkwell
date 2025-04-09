"use client"

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
    user: { name: string; email: string } | null
    token: string | null
    loading: boolean
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<{ name: string; email: string } | null>(
        null
    )
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken")
        if (storedToken) {
            console.log("Found stored token:", storedToken)
            setToken(storedToken)
            fetchProfile(storedToken)
        } else {
            console.log("No stored token found")
            setLoading(false)
        }
    }, [])

    const fetchProfile = async (authToken: string) => {
        try {
            console.log("Fetching profile with token:", authToken)
            const response = await fetch(
                "http://localhost:5000/api/auth/profile",
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            )
            if (response.ok) {
                const data = await response.json()
                console.log("Profile fetched:", data)
                setUser(data)
            } else {
                console.error("Profile fetch failed:", response.status)
                logout()
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
            logout()
        } finally {
            setLoading(false)
        }
    }

    const login = (newToken: string) => {
        console.log("Logging in with token:", newToken)
        localStorage.setItem("authToken", newToken)
        setToken(newToken)
        fetchProfile(newToken)
        router.push("/dashboard")
    }

    const logout = () => {
        console.log("Logging out")
        localStorage.removeItem("authToken")
        setToken(null)
        setUser(null)
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}
