"use client"

import {
    User,
    Settings as SettingsIcon,
    ShoppingBag,
    Heart,
} from "lucide-react"
import { useId } from "react"

type Tab = "profile" | "settings" | "orders" | "wishlist"

interface SidebarProps {
    activeTab: Tab
    setActiveTab: (tab: Tab) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const navId = useId()
    
    return (
        <aside 
            className="bg-charcoalBlack p-6 h-full flex flex-col gap-4 shadow-lg rounded-lg"
            aria-label="Dashboard navigation">
            <nav 
                id={navId}
                className="space-y-2"
                aria-label="Dashboard sections">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-generalSans font-medium transition-colors ${
                        activeTab === "profile"
                            ? "bg-burntAmber text-darkMutedTeal"
                            : "text-mutedSand hover:bg-deepGray hover:text-warmBeige"
                    }`}
                    aria-current={activeTab === "profile" ? "page" : undefined}
                    aria-label="Profile section">
                    <User size={20} aria-hidden="true" />
                    <span>Profile</span>
                </button>
                <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-generalSans font-medium transition-colors ${
                        activeTab === "settings"
                            ? "bg-burntAmber text-darkMutedTeal"
                            : "text-mutedSand hover:bg-deepGray hover:text-warmBeige"
                    }`}
                    aria-current={activeTab === "settings" ? "page" : undefined}
                    aria-label="Settings section">
                    <SettingsIcon size={20} aria-hidden="true" />
                    <span>Settings</span>
                </button>
                <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-generalSans font-medium transition-colors ${
                        activeTab === "orders"
                            ? "bg-burntAmber text-darkMutedTeal"
                            : "text-mutedSand hover:bg-deepGray hover:text-warmBeige"
                    }`}
                    aria-current={activeTab === "orders" ? "page" : undefined}
                    aria-label="Orders section">
                    <ShoppingBag size={20} aria-hidden="true" />
                    <span>Orders</span>
                </button>
                <button
                    onClick={() => setActiveTab("wishlist")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-generalSans font-medium transition-colors ${
                        activeTab === "wishlist"
                            ? "bg-burntAmber text-darkMutedTeal"
                            : "text-mutedSand hover:bg-deepGray hover:text-warmBeige"
                    }`}
                    aria-current={activeTab === "wishlist" ? "page" : undefined}
                    aria-label="Wishlist section">
                    <Heart size={20} aria-hidden="true" />
                    <span>Wishlist</span>
                </button>
            </nav>
        </aside>
    )
}
