"use client"

import {
    User,
    Settings as SettingsIcon,
    ShoppingBag,
    Heart,
} from "lucide-react"

type Tab = "profile" | "settings" | "orders" | "wishlist"

interface SidebarProps {
    activeTab: Tab
    setActiveTab: (tab: Tab) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    return (
        <aside className='bg-charcoalBlack p-6 h-full flex flex-col gap-4 shadow-lg'>
            <nav className='space-y-2'>
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-generalSans font-medium transition-colors ${
                        activeTab === "profile"
                            ? "bg-burntAmber text-darkMutedTeal"
                            : "text-mutedSand hover:bg-deepGray hover:text-warmBeige"
                    }`}>
                    <User size={20} />
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-generalSans font-medium transition-colors ${
                        activeTab === "settings"
                            ? "bg-burntAmber text-darkMutedTeal"
                            : "text-mutedSand hover:bg-deepGray hover:text-warmBeige"
                    }`}>
                    <SettingsIcon size={20} />
                    Settings
                </button>
                <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-generalSans font-medium transition-colors ${
                        activeTab === "orders"
                            ? "bg-burntAmber text-darkMutedTeal"
                            : "text-mutedSand hover:bg-deepGray hover:text-warmBeige"
                    }`}>
                    <ShoppingBag size={20} />
                    Orders
                </button>
                <button
                    onClick={() => setActiveTab("wishlist")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-generalSans font-medium transition-colors ${
                        activeTab === "wishlist"
                            ? "bg-burntAmber text-darkMutedTeal"
                            : "text-mutedSand hover:bg-deepGray hover:text-warmBeige"
                    }`}>
                    <Heart size={20} />
                    Wishlist
                </button>
            </nav>
        </aside>
    )
}
