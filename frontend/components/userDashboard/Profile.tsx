"use client"

import { useAuth } from "@/context/AuthContext"
import { ShoppingBag, Heart, Edit } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getProfile } from "@/lib/api"

export default function Profile() {
    const { user, token, loading } = useAuth()
    const [profileData, setProfileData] = useState<{
        name: string
        email: string
        createdAt: string
        wishlistItems: number
        orderedItems: number
    } | null>(null)
    const [fetchError, setFetchError] = useState<string | null>(null)

    useEffect(() => {
        if (token) {
            const fetchProfile = async () => {
                try {
                    const apiResponse = await getProfile(token)
                    console.log("Profile API Response:", apiResponse) // Log the response
                    const formattedData = {
                        name: apiResponse.name || "",
                        email: apiResponse.email || "",
                        createdAt: apiResponse.user?.createdAt || "",
                        wishlistItems: apiResponse.wishlistItems || 0,
                        orderedItems: apiResponse.orderedItems || 0,
                    }
                    setProfileData(formattedData)
                    setFetchError(null)
                } catch (err) {
                    setFetchError("Failed to load profile data")
                    console.error("Profile fetch error:", err)
                }
            }
            fetchProfile()
        }
    }, [token])

    if (loading) {
        return (
            <div className='text-mutedSand text-center'>Loading profile...</div>
        )
    }

    if (!user || !token) {
        return (
            <div className='text-mutedSand text-center'>
                Unable to load profile. Please log in again.
            </div>
        )
    }

    if (fetchError) {
        return <div className='text-mutedSand text-center'>{fetchError}</div>
    }

    if (!profileData) {
        return (
            <div className='text-mutedSand text-center'>
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
        <div className='w-full max-w-2xl mx-auto bg-deepGray p-4 sm:p-6 rounded-lg shadow-lg'>
            <h2 className='text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center text-warmBeige'>
                Your Profile
            </h2>
            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-4 sm:mb-6'>
                <div className='flex-shrink-0'>
                    <div className='w-16 h-16 sm:w-20 sm:h-20 bg-burntAmber rounded-full flex items-center justify-center text-darkMutedTeal text-2xl sm:text-3xl font-bold'>
                        {profileData.name.charAt(0).toUpperCase()}
                    </div>
                </div>
                <div className='flex-1 text-center sm:text-left'>
                    <h3 className='text-base sm:text-lg md:text-xl font-semibold text-warmBeige mb-2'>
                        {profileData.name}
                    </h3>
                    <p className='text-sm sm:text-base text-mutedSand mb-1'>
                        <span className='font-bold text-warmBeige'>Email:</span>{" "}
                        {profileData.email}
                    </p>
                    <p className='text-sm sm:text-base text-mutedSand'>
                        <span className='font-bold text-warmBeige'>
                            Member Since:
                        </span>{" "}
                        {joinedDate}
                    </p>
                </div>
                <Link href='/dashboard'>
                    <button className='bg-burntAmber text-darkMutedTeal px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-generalSans font-semibold flex items-center gap-2 hover:bg-deepCopper transition-colors text-sm sm:text-base'>
                        <Edit
                            size={16}
                            className='sm:w-5 sm:h-5'
                        />
                        Edit Profile
                    </button>
                </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                <div className='bg-slightlyLightGrey p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3'>
                    <ShoppingBag
                        size={20}
                        className='text-burntAmber'
                    />
                    <div>
                        <p className='text-warmBeige font-semibold text-sm sm:text-base'>
                            Items Ordered
                        </p>
                        <p className='text-mutedSand text-sm sm:text-base'>
                            {profileData.orderedItems}
                        </p>
                    </div>
                </div>
                <div className='bg-slightlyLightGrey p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3'>
                    <Heart
                        size={20}
                        className='text-burntAmber'
                    />
                    <div>
                        <p className='text-warmBeige font-semibold text-sm sm:text-base'>
                            Items Wishlisted
                        </p>
                        <p className='text-mutedSand text-sm sm:text-base'>
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
