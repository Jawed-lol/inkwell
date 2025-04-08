"use client"

import { useAuth } from "@/context/AuthContext"
import { ShoppingBag, Heart, Edit } from "lucide-react"
import Link from "next/link"

export default function Profile() {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className='text-mutedSand text-center'>Loading profile...</div>
        )
    }

    if (!user) {
        return (
            <div className='text-mutedSand text-center'>
                Unable to load profile. Please log in again.
            </div>
        )
    }

    const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Unknown"

    // Mock data (replace with backend endpoints later)
    const totalOrders = 5 // Fetch from /api/orders
    const wishlistCount = 3 // Fetch from /api/wishlist

    return (
        <div className='max-w-2xl mx-auto bg-deepGray p-6 rounded-lg shadow-lg'>
            <h2 className='text-xl sm:text-2xl font-bold mb-6 text-center md:text-left text-warmBeige'>
                Your Profile
            </h2>

            {/* Profile Card */}
            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6'>
                {/* Avatar Placeholder */}
                <div className='flex-shrink-0'>
                    <div className='w-16 h-16 sm:w-20 sm:h-20 bg-burntAmber rounded-full flex items-center justify-center text-darkMutedTeal text-2xl sm:text-3xl font-bold'>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                </div>

                {/* User Info */}
                <div className='flex-1 text-center sm:text-left'>
                    <h3 className='text-lg sm:text-xl font-semibold text-warmBeige mb-2'>
                        {user.name}
                    </h3>
                    <p className='text-sm sm:text-base text-mutedSand mb-1'>
                        <span className='font-bold text-warmBeige'>Email:</span>{" "}
                        {user.email}
                    </p>
                    <p className='text-sm sm:text-base text-mutedSand'>
                        <span className='font-bold text-warmBeige'>
                            Member Since:
                        </span>{" "}
                        {joinedDate}
                    </p>
                </div>

                {/* Edit Button */}
                <Link href='/dashboard/settings'>
                    <button className='bg-burntAmber text-darkMutedTeal px-4 py-2 rounded-lg font-generalSans font-semibold flex items-center gap-2 hover:bg-deepCopper transition-colors'>
                        <Edit size={18} />
                        Edit Profile
                    </button>
                </Link>
            </div>

            {/* Quick Stats */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {/* Orders Summary */}
                <div className='bg-slightlyLightGrey p-4 rounded-lg flex items-center gap-3'>
                    <ShoppingBag
                        size={24}
                        className='text-burntAmber'
                    />
                    <div>
                        <p className='text-warmBeige font-semibold'>
                            Total Orders
                        </p>
                        <p className='text-mutedSand'>{totalOrders}</p>
                    </div>
                </div>

                {/* Wishlist Summary */}
                <div className='bg-slightlyLightGrey p-4 rounded-lg flex items-center gap-3'>
                    <Heart
                        size={24}
                        className='text-burntAmber'
                    />
                    <div>
                        <p className='text-warmBeige font-semibold'>Wishlist</p>
                        <p className='text-mutedSand'>
                            {wishlistCount}{" "}
                            <Link
                                href='/wishlist'
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
