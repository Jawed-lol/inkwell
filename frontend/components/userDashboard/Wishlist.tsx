"use client"

import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { getWishlist, removeFromWishlist } from "@/lib/api"
import { Trash2, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

interface Book {
    _id: string
    title: string
    author: string
    price: number
    urlPath?: string
}

export default function Wishlist() {
    const { user, token, loading } = useAuth()
    const [wishlist, setWishlist] = useState<Book[]>([])
    const [fetchError, setFetchError] = useState<string | null>(null)

    useEffect(() => {
        if (token) {
            fetchWishlist()
        }
    }, [token])

    const fetchWishlist = async () => {
        try {
            const data = await getWishlist(token!)
            setWishlist(data)
            setFetchError(null)
        } catch (error) {
            setFetchError("Failed to load wishlist. Please try again.")
        }
    }

    const handleRemove = async (bookId: string) => {
        try {
            await removeFromWishlist(token!, bookId)
            setWishlist(wishlist.filter((book) => book._id !== bookId))
        } catch (error) {
            setFetchError("Failed to remove item. Please try again.")
        }
    }

    if (loading) {
        return (
            <div className='text-mutedSand text-center'>
                Loading wishlist...
            </div>
        )
    }

    if (!user || !token) {
        return (
            <div className='text-mutedSand text-center'>
                Please log in to view your wishlist.
            </div>
        )
    }

    return (
        <div className='max-w-2xl mx-auto bg-deepGray p-6 rounded-lg shadow-lg'>
            <h2 className='text-xl sm:text-2xl font-bold mb-6 text-center md:text-left text-warmBeige'>
                Your Wishlist
            </h2>
            {fetchError && <p className='text-deepCopper mb-4'>{fetchError}</p>}
            {wishlist.length === 0 ? (
                <p className='text-mutedSand text-center'>
                    Your wishlist is empty.
                </p>
            ) : (
                <div className='space-y-4'>
                    {wishlist.map((book) => (
                        <motion.div
                            key={book._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className='flex items-center gap-4 bg-slightlyLightGrey p-4 rounded-lg'>
                            <Image
                                src={book.urlPath || "/placeholder.svg"}
                                alt={`${book.title} cover`}
                                width={80}
                                height={120}
                                className='rounded-lg'
                            />
                            <div className='flex-1'>
                                <h3 className='text-warmBeige font-semibold'>
                                    {book.title}
                                </h3>
                                <p className='text-mutedSand'>
                                    by {book.author}
                                </p>
                                <p className='text-warmBeige font-bold'>
                                    ${book.price.toFixed(2)}
                                </p>
                            </div>
                            <div className='flex gap-2'>
                                <button
                                    onClick={() =>
                                        console.log("Add to cart:", book._id)
                                    } // Replace with onAddToCart logic
                                    className='p-2 bg-burntAmber text-darkMutedTeal rounded-lg hover:bg-deepCopper'>
                                    <ShoppingCart size={20} />
                                </button>
                                <button
                                    onClick={() => handleRemove(book._id)}
                                    className='p-2 bg-deepCopper text-warmBeige rounded-lg hover:bg-burntAmber'>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
