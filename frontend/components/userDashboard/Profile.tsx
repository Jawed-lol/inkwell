"use client"

import { useAuth } from "@/context/AuthContext"
import { ShoppingBag, Heart, Edit } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useId } from "react"
import { authService } from "@/lib/api"

interface ProfileData {
    name: string
    email: string
    createdAt: string
    wishlistItems: number
    orderedItems: number
}

// Helper component for stat cards
const StatCard = ({ 
    icon, 
    title, 
    value, 
    action = null,
    labelId
}: {
    icon: React.ReactNode
    title: string
    value: number
    action?: React.ReactNode | null
    labelId: string
}) => (
    <div 
        className="flex items-center gap-3 rounded-lg bg-slightlyLightGrey p-4"
        aria-labelledby={labelId}>
        <div className="text-burntAmber" aria-hidden="true">
            {icon}
        </div>
        <div>
            <p id={labelId} className="font-semibold text-warmBeige">{title}</p>
            <p className="text-mutedSand">
                {value} {action}
            </p>
        </div>
    </div>
)

export default function Profile() {
    const { user, token, loading } = useAuth()
    const [profileData, setProfileData] = useState<ProfileData | null>(null)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const profileHeadingId = useId()
    const ordersCardId = useId()
    const wishlistCardId = useId()

    useEffect(() => {
        if (!token) return

        const fetchProfile = async () => {
            try {
                const response = await authService.getProfile(token)
                setProfileData({
                    name: response.name,
                    email: response.email,
                    createdAt: response.createdAt,
                    wishlistItems: response.wishlistItems,
                    orderedItems: response.orderedItems
                })
                setFetchError(null)
            } catch (err) {
                console.error("Profile fetch error:", err)
                setFetchError(err instanceof Error ? err.message : 'Failed to load profile data')
            }
        }

        fetchProfile()
    }, [token])

    // Loading states
    if (loading) {
        return (
            <div 
                className="text-center text-mutedSand p-6" 
                role="status" 
                aria-live="polite">
                <div className="animate-pulse">
                    Loading profile...
                    <span className="sr-only">Please wait while we load your profile information</span>
                </div>
            </div>
        )
    }
    
    if (!user || !token) {
        return (
            <div 
                className="text-center text-mutedSand p-6" 
                role="alert">
                Please <Link href="/login" className="text-burntAmber hover:underline focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-2 focus:ring-offset-deepGray rounded">log in</Link> to view your profile.
            </div>
        )
    }
    
    if (fetchError) {
        return (
            <div 
                className="text-center text-mutedSand p-6 bg-red-900 bg-opacity-20 rounded-lg" 
                role="alert">
                {fetchError}
            </div>
        )
    }
    
    if (!profileData) {
        return (
            <div 
                className="text-center text-mutedSand p-6" 
                role="status" 
                aria-live="polite">
                <div className="animate-pulse">
                    Loading profile data...
                    <span className="sr-only">Please wait while we load your profile details</span>
                </div>
            </div>
        )
    }

    const joinedDate = profileData.createdAt
        ? new Date(profileData.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Unknown"

    return (
        <section 
            className="mx-auto w-full max-w-2xl rounded-lg bg-deepGray p-6 shadow-lg"
            aria-labelledby={profileHeadingId}>
            <h1 
                id={profileHeadingId}
                className="mb-6 text-center text-2xl font-bold text-warmBeige">
                Your Profile
            </h1>
            
            <div className="mb-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                {/* Profile avatar */}
                <div 
                    className="w-20 h-20 rounded-full bg-burntAmber flex items-center justify-center text-3xl font-bold text-darkMutedTeal"
                    aria-hidden="true">
                    {profileData.name.charAt(0).toUpperCase()}
                </div>
                
                {/* User info */}
                <div className="flex-1 text-center sm:text-left">
                    <h2 className="mb-2 text-xl font-semibold text-warmBeige">
                        {profileData.name}
                    </h2>
                    <dl className="grid gap-1">
                        <div className="flex flex-col sm:flex-row sm:gap-1">
                            <dt className="font-bold text-warmBeige">Email: </dt>
                            <dd className="text-mutedSand">{profileData.email}</dd>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-1">
                            <dt className="font-bold text-warmBeige">Member Since: </dt>
                            <dd className="text-mutedSand">
                                <time dateTime={new Date(profileData.createdAt).toISOString()}>
                                    {joinedDate}
                                </time>
                            </dd>
                        </div>
                    </dl>
                </div>
                
                {/* Edit profile button */}
                <Link 
                    href="/dashboard?tab=settings"
                    className="flex items-center gap-2 rounded-lg bg-burntAmber px-4 py-2 font-semibold text-darkMutedTeal transition-colors hover:bg-deepCopper focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-2 focus:ring-offset-deepGray">
                    <Edit size={20} aria-hidden="true" />
                    <span>Edit Profile</span>
                </Link>
            </div>
            
            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatCard 
                    icon={<ShoppingBag size={20} />}
                    title="Items Ordered"
                    value={profileData.orderedItems}
                    labelId={ordersCardId}
                />
                
                <StatCard 
                    icon={<Heart size={20} />}
                    title="Items Wishlisted"
                    value={profileData.wishlistItems}
                    labelId={wishlistCardId}
                    action={
                        <Link 
                            href="/dashboard?tab=wishlist" 
                            className="text-burntAmber hover:underline focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-1 focus:ring-offset-slightlyLightGrey rounded">
                            View
                        </Link>
                    }
                />
            </div>
        </section>
    )
}
