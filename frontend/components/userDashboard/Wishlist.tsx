"use client"

import { useAuth } from "@/context/AuthContext"
import { useState, useEffect, useCallback } from "react"
import { wishlistService } from "@/lib/api"
import { Trash2, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Head from "next/head"
import { motion } from "framer-motion"
import Link from "next/link"

interface Book {
    slug: string
    title: string
    author: { name: string; _id: string }
    price: number
    urlPath?: string
}

export default function Wishlist() {
    const { user, token, loading } = useAuth()
    const [wishlist, setWishlist] = useState<Book[]>([])
    const [error, setError] = useState<string | null>(null)

    const fetchWishlist = useCallback(async () => {
        if (!token) return

        try {
            const data = await wishlistService.get(token)
            setWishlist(
                Array.isArray(data)
                    ? data
                    : Array.isArray(data.wishlist)
                      ? data.wishlist
                      : []
            )
            setError(null)
        } catch {
            setError("Failed to load wishlist. Please try again.")
            setWishlist([])
        }
    }, [token])

    useEffect(() => {
        if (token && !loading) {
            fetchWishlist()
        }
    }, [token, loading, fetchWishlist])

    const handleRemove = async (bookId: string) => {
        if (!token) return

        try {
            await wishlistService.remove(token, bookId)
            setWishlist(wishlist.filter((book) => book.slug !== bookId))
        } catch {
            setError("Failed to remove item. Please try again.")
        }
    }

    const handleAddToCart = (bookId: string) => {
        // Placeholder for cart functionality
        console.log("Add to cart:", bookId)
    }

    // Schema.org structured data for SEO
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: wishlist.map((book, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "Book",
                name: book.title,
                author: book.author || "Unknown Author",
                offers: {
                    "@type": "Offer",
                    price: book.price,
                    priceCurrency: "USD",
                },
                image: book.urlPath || "/placeholder.svg",
            },
        })),
    }

    if (loading) {
        return (
            <div
                className='text-mutedSand text-center py-10'
                role='status'>
                Loading your wishlist...
            </div>
        )
    }

    if (!user || !token) {
        return (
            <div className='text-mutedSand text-center py-10'>
                Please{" "}
                <a
                    href='/login'
                    className='text-burntAmber underline'>
                    log in
                </a>{" "}
                to view your wishlist.
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Your Wishlist | Bookstore</title>
                <meta
                    name='description'
                    content='Explore your personalized wishlist of books at Bookstore. Save your favorite titles and add them to your cart anytime.'
                />
                <meta
                    name='robots'
                    content='index, follow'
                />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <meta
                    property='og:title'
                    content='Your Wishlist | Bookstore'
                />
                <meta
                    property='og:description'
                    content='View and manage your favorite books in your Bookstore wishlist.'
                />
                <meta
                    property='og:type'
                    content='website'
                />
                <meta
                    property='og:image'
                    content='/og-image.jpg'
                />{" "}
                {/* Replace with actual image */}
                <meta
                    name='twitter:card'
                    content='summary_large_image'
                />
                <meta
                    name='twitter:title'
                    content='Your Wishlist | Bookstore'
                />
                <meta
                    name='twitter:description'
                    content='View and manage your favorite books in your Bookstore wishlist.'
                />
            </Head>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
            <section className='max-w-2xl mx-auto bg-deepGray p-6 rounded-lg shadow-lg my-8'>
                <h1 className='text-xl sm:text-2xl font-bold mb-6 text-center md:text-left text-warmBeige'>
                    Your Wishlist
                </h1>
                {error && (
                    <p
                        className='text-deepCopper mb-4 text-center'
                        role='alert'>
                        {error}
                    </p>
                )}
                {wishlist.length === 0 ? (
                    <p className='text-mutedSand text-center py-10'>
                        Your wishlist is empty.{" "}
                        <Link
                            href='/shop'
                            className='text-burntAmber underline'>
                            Browse books
                        </Link>{" "}
                        to add some!
                    </p>
                ) : (
                    <div className='space-y-4'>
                        {wishlist.map((book) => (
                            <motion.article
                                key={book.slug}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className='flex items-center gap-4 bg-slightlyLightGrey p-4 rounded-lg'
                                aria-labelledby={`book-title-${book.slug}`}>
                                <Image
                                    src={book.urlPath || "/placeholder.svg"}
                                    alt={`${book.title} cover`}
                                    width={80}
                                    height={120}
                                    className='rounded-lg object-cover'
                                    loading='lazy'
                                />
                                <div className='flex-1'>
                                    <h2
                                        id={`book-title-${book.slug}`}
                                        className='text-warmBeige font-semibold text-lg'>
                                        {book.title}
                                    </h2>
                                    <p className='text-mutedSand'>
                                        by{" "}
                                        {book.author.name || "Unknown Author"}
                                    </p>
                                    <p className='text-warmBeige font-bold'>
                                        ${book.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={() =>
                                            handleAddToCart(book.slug)
                                        }
                                        className='p-2 bg-burntAmber text-darkMutedTeal rounded-lg hover:bg-deepCopper focus:outline-none focus:ring-2 focus:ring-burntAmber'
                                        aria-label={`Add ${book.title} to cart`}>
                                        <ShoppingCart size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleRemove(book.slug)}
                                        className='p-2 bg-deepCopper text-warmBeige rounded-lg hover:bg-burntAmber focus:outline-none focus:ring-2 focus:ring-deepCopper'
                                        aria-label={`Remove ${book.title} from wishlist`}>
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </section>
        </>
    )
}
