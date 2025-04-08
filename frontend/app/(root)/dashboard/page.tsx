"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/userDashboard/Sidebar"
import Profile from "@/components/userDashboard/Profile"
import Settings from "@/components/userDashboard/Settings"
import Orders from "@/components/userDashboard/Orders"
import Wishlist from "@/components/userDashboard/Wishlist"
import { useAuth } from "@/context/AuthContext"

type Tab = "profile" | "settings" | "orders" | "wishlist"

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<Tab>("profile")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
    }, [user, loading, router])

    if (loading || !user) return null

    return (
        <div className='bg-gradient-to-b from-charcoalBlack to-deepGray min-h-screen'>
            <div className='pt-[120px] flex min-h-screen flex-col md:flex-row max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 w-full'>
                <button
                    className='md:hidden p-4 text-burntAmber focus:outline-none'
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? "✕" : "☰"}
                </button>

                <div
                    className={`${
                        isSidebarOpen ? "block" : "hidden"
                    } md:block w-full md:w-64 fixed md:static top-0 left-0 h-full z-10`}>
                    <Sidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>

                <main className='flex-1 p-4 sm:p-6 md:p-8 w-full'>
                    {activeTab === "profile" && <Profile />}
                    {activeTab === "settings" && <Settings />}
                    {activeTab === "orders" && <Orders />}
                    {activeTab === "wishlist" && <Wishlist />}
                </main>
            </div>
        </div>
    )
}
