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
                    "https://inkwell-oblr.onrender.com/api/auth/profile",
                    {
                        headers: { Authorization: `Bearer ${authToken}` },
                    }
                )

                if (response.ok) {
                    const data = await response.json()
                    setUser(data)
                } else {
                    logout()
                }
            } catch {
                logout()
            } finally {
                setLoading(false)
            }
        },
        [logout]
    )

    useEffect(() => {
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
