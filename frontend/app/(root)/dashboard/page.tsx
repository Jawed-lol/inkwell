// app/dashboard/page.tsx
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
    const router = useRouter()
    const { user, loading } = useAuth()

    // Initialize activeTab from query parameter or default to "profile"
    const [activeTab, setActiveTab] = useState<Tab>(() => {
        if (typeof window !== "undefined") {
            const tabFromQuery = new URLSearchParams(
                window.location.search
            ).get("tab") as Tab
            return tabFromQuery &&
                ["profile", "settings", "orders", "wishlist"].includes(
                    tabFromQuery
                )
                ? tabFromQuery
                : "profile"
        }
        return "profile" // Fallback for initial render
    })
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
    }, [user, loading, router])

    // Function to handle tab selection and close sidebar
    const handleTabSelect = (tab: Tab) => {
        setActiveTab(tab)
        setIsSidebarOpen(false)
        router.replace(`/dashboard?tab=${tab}`, undefined, { shallow: true }) // Update URL
    }

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev)
    }

    if (loading || !user) return null

    return (
        <div className='pt-[120px] flex min-h-screen flex-col md:flex-row max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 w-full relative'>
            {/* Mobile toggle button */}
            <button
                className='md:hidden fixed top-[140px] right-6 sm:right-8 md:right-12 p-3 text-warmBeige bg-burntAmber rounded-full hover:bg-deepCopper transition-colors duration-200 focus:outline-none z-20 shadow-md'
                onClick={toggleSidebar}>
                {isSidebarOpen ? (
                    <span className='text-xl'>✕</span>
                ) : (
                    <span className='text-xl'>☰</span>
                )}
            </button>

            {/* Sidebar */}
            <div
                className={`${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 fixed top-0 left-0 w-64 h-full bg-[#252525] transition-transform duration-300 ease-in-out md:static md:block z-10`}>
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={handleTabSelect}
                />
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-50 md:hidden z-0'
                    onClick={toggleSidebar}
                />
            )}

            {/* Main content */}
            <main className='flex-1 p-4 sm:p-6 md:p-8 w-full'>
                {activeTab === "profile" && <Profile />}
                {activeTab === "settings" && <Settings />}
                {activeTab === "orders" && <Orders />}
                {activeTab === "wishlist" && <Wishlist />}
            </main>
        </div>
    )
}
