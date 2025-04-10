"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import Sidebar from "@/components/userDashboard/Sidebar"
import Profile from "@/components/userDashboard/Profile"
import Settings from "@/components/userDashboard/Settings"
import Orders from "@/components/userDashboard/Orders"
import Wishlist from "@/components/userDashboard/Wishlist"
import { useAuth } from "@/context/AuthContext"

type Tab = "profile" | "settings" | "orders" | "wishlist"

const tabTitles: Record<Tab, string> = {
    profile: "Your Profile",
    settings: "Account Settings",
    orders: "Your Orders",
    wishlist: "Your Wishlist",
}

const tabDescriptions: Record<Tab, string> = {
    profile: "Manage your personal profile information and preferences.",
    settings:
        "Update your account settings, notifications, and privacy options.",
    orders: "View and track your current and past orders.",
    wishlist:
        "Browse your saved items and add them to cart when ready to purchase.",
}

export default function Dashboard() {
    const router = useRouter()
    const { user, loading } = useAuth()

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
        return "profile"
    })

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [pageTitle, setPageTitle] = useState("")

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
    }, [user, loading, router])

    useEffect(() => {
        if (activeTab) {
            const title = `${tabTitles[activeTab]} | Your Account Dashboard`
            document.title = title
            setPageTitle(title)
        }
    }, [activeTab])

    const generateStructuredData = () => {
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://yourbookstore.com",
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: "Account Dashboard",
                    item: "https://yourbookstore.com/dashboard",
                },
                {
                    "@type": "ListItem",
                    position: 3,
                    name: tabTitles[activeTab],
                    item: `https://yourbookstore.com/dashboard?tab=${activeTab}`,
                },
            ],
        }
    }

    const handleTabSelect = (tab: Tab) => {
        setActiveTab(tab)
        setIsSidebarOpen(false)

        router.replace(`/dashboard?tab=${tab}`, { scroll: false })
    }

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev)
    }

    if (loading) {
        return (
            <div className='pt-[120px] flex justify-center items-center min-h-screen'>
                <p className='text-warmBeige text-xl'>
                    Loading your dashboard...
                </p>
            </div>
        )
    }

    if (!user) return null

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta
                    name='description'
                    content={tabDescriptions[activeTab]}
                />
                <meta
                    name='robots'
                    content='noindex, nofollow'
                />
                <link
                    rel='canonical'
                    href={`https://yourbookstore.com/dashboard?tab=${activeTab}`}
                />
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(generateStructuredData()),
                    }}
                />
            </Head>

            <div className='pt-[120px] flex min-h-screen flex-col md:flex-row max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 w-full relative'>
                <button
                    className='md:hidden fixed top-[140px] right-6 sm:right-8 md:right-12 p-3 text-warmBeige bg-burntAmber rounded-full hover:bg-deepCopper transition-colors duration-200 focus:outline-none z-20 shadow-md'
                    onClick={toggleSidebar}
                    aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isSidebarOpen}>
                    {isSidebarOpen ? (
                        <span
                            className='text-xl'
                            aria-hidden='true'>
                            ✕
                        </span>
                    ) : (
                        <span
                            className='text-xl'
                            aria-hidden='true'>
                            ☰
                        </span>
                    )}
                </button>

                <div
                    className={`${
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 fixed top-0 left-0 w-64 h-full bg-[#252525] transition-transform duration-300 ease-in-out md:static md:block z-10`}
                    role='navigation'
                    aria-label='Dashboard navigation'>
                    <Sidebar
                        activeTab={activeTab}
                        setActiveTab={handleTabSelect}
                    />
                </div>

                {isSidebarOpen && (
                    <div
                        className='fixed inset-0 bg-black bg-opacity-50 md:hidden z-0'
                        onClick={toggleSidebar}
                        aria-hidden='true'
                    />
                )}

                <main
                    className='flex-1 p-4 sm:p-6 md:p-8 w-full'
                    id={`dashboard-${activeTab}`}
                    aria-label={tabTitles[activeTab]}>
                    <h1 className='sr-only'>{tabTitles[activeTab]}</h1>

                    {activeTab === "profile" && <Profile />}
                    {activeTab === "settings" && <Settings />}
                    {activeTab === "orders" && <Orders />}
                    {activeTab === "wishlist" && <Wishlist />}
                </main>
            </div>
        </>
    )
}
