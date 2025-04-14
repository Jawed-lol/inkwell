"use client"

import { useAuth } from "@/context/AuthContext"
import { ShoppingBag, Heart, Edit } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { authService } from "@/lib/api"

interface ProfileData {
    name: string
    email: string
    createdAt: string
    wishlistItems: number
    orderedItems: number
}

export default function Profile() {
    const { user, token, loading } = useAuth()
    const [profileData, setProfileData] = useState<ProfileData | null>(null)
    const [fetchError, setFetchError] = useState<string | null>(null)

    useEffect(() => {
        if (!token) return

        const fetchProfile = async () => {
            try {
                const response = await authService.getProfile(token)
                const formattedData: ProfileData = {
                    name: response.name || "",
                    email: response.email || "",
                    createdAt: response.createdAt || "",
                    wishlistItems: response.wishlistItems || 0,
                    orderedItems: response.orderedItems || 0,
                }
                setProfileData(formattedData)
                setFetchError(null)
            } catch (err) {
                console.error("Profile fetch error:", err)
                setFetchError("Failed to load profile data")
            }
        }

        fetchProfile()
    }, [token])

    if (loading) {
        return (
            <div className='text-center text-mutedSand'>Loading profile...</div>
        )
    }

    if (!user || !token) {
        return (
            <div className='text-center text-mutedSand'>
                Please log in to view your profile.
            </div>
        )
    }

    if (fetchError) {
        return <div className='text-center text-mutedSand'>{fetchError}</div>
    }

    if (!profileData) {
        return (
            <div className='text-center text-mutedSand'>
                Loading profile data...
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
        <div className='mx-auto w-full max-w-2xl rounded-lg bg-deepGray p-6 shadow-lg'>
            <h2 className='mb-6 text-center text-2xl font-bold text-warmBeige'>
                Your Profile
            </h2>
            <div className='mb-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start'>
                <div className='w-20 h-20 rounded-full bg-burntAmber flex items-center justify-center text-3xl font-bold text-darkMutedTeal'>
                    {profileData.name.charAt(0).toUpperCase()}
                </div>
                <div className='flex-1 text-center sm:text-left'>
                    <h3 className='mb-2 text-xl font-semibold text-warmBeige'>
                        {profileData.name}
                    </h3>
                    <p className='mb-1 text-base text-mutedSand'>
                        <span className='font-bold text-warmBeige'>
                            Email:{" "}
                        </span>
                        {profileData.email}
                    </p>
                    <p className='text-base text-mutedSand'>
                        <span className='font-bold text-warmBeige'>
                            Member Since:{" "}
                        </span>
                        {joinedDate}
                    </p>
                </div>
                <Link href='/dashboard?tab=settings'>
                    <button className='flex items-center gap-2 rounded-lg bg-burntAmber px-4 py-2 font-semibold text-darkMutedTeal transition-colors hover:bg-deepCopper'>
                        <Edit size={20} />
                        Edit Profile
                    </button>
                </Link>
            </div>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='flex items-center gap-3 rounded-lg bg-slightlyLightGrey p-4'>
                    <ShoppingBag
                        size={20}
                        className='text-burntAmber'
                    />
                    <div>
                        <p className='font-semibold text-warmBeige'>
                            Items Ordered
                        </p>
                        <p className='text-mutedSand'>
                            {profileData.orderedItems}
                        </p>
                    </div>
                </div>
                <div
                    className='flex items-center gap-3 rounded-lg bg-slightlyLightGrey p-4

'>
                    <Heart
                        size={20}
                        className='text-burntAmber'
                    />
                    <div>
                        <p className='font-semibold text-warmBeige'>
                            Items Wishlisted
                        </p>
                        <p className='text-mutedSand'>
                            {profileData.wishlistItems}{" "}
                            <Link
                                href='/dashboard?tab=wishlist'
                                className='text-burntAmber hover:underline'>
                                View
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
