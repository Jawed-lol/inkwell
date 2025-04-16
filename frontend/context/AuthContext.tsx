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

//const API_URL = process.env.NEXT_PUBLIC_API_URL
interface AuthContextType {
    user: { name: string; email: string } | null
    token: string | null
    loading: boolean
    isAuthenticated: boolean
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
                    //`${API_URL}+/api/auth/profile`,
                    'http://localhost:5000/api/auth/profile',
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

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            loading, 
            isAuthenticated: !!token, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}
