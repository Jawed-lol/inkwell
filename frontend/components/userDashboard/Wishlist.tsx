"use client"

import { useAuth } from "@/context/AuthContext"
import { useState, useEffect, useCallback } from "react"
import { wishlistService } from "@/lib/api"
import { Trash2, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Head from "next/head"
import { motion } from "framer-motion"
import Link from "next/link"
import { Book } from "@/types/book"

export default function Wishlist() {
    const { user, token, loading } = useAuth()
    const [wishlist, setWishlist] = useState<Book[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isRemoving, setIsRemoving] = useState<string | null>(null)

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
        } catch  {
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
        setIsRemoving(bookId)

        try {
            await wishlistService.remove(token, bookId)
            setWishlist(wishlist.filter((book) => book.slug !== bookId))
        } catch  {
            setError("Failed to remove item. Please try again.")
        } finally {
            setIsRemoving(null)
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
                author: {
                    "@type": "Person",
                    name: typeof book.author === 'object' && book.author?.name 
                        ? book.author.name 
                        : typeof book.author === 'string' 
                            ? book.author 
                            : "Unknown Author"
                },
                offers: {
                    "@type": "Offer",
                    price: book.price,
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock"
                },
                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inkwell-bookstore.com'}/book/${book.slug}`,
                image: book.urlPath || "/placeholder.svg",
            },
        })),
    }

    if (loading) {
        return (
            <div
                className='text-mutedSand text-center py-10'
                role='status'
                aria-live="polite">
                <span className="sr-only">Loading</span>
                Loading your wishlist...
            </div>
        )
    }

    if (!user || !token) {
        return (
            <div className='text-mutedSand text-center py-10'>
                Please{" "}
                <Link
                    href='/login'
                    className='text-burntAmber underline focus:ring-2 focus:ring-burntAmber focus:outline-none'>
                    log in
                </Link>{" "}
                to view your wishlist.
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Your Wishlist | Inkwell Bookstore</title>
                <meta
                    name='description'
                    content='Manage your personalized wishlist of books at Inkwell Bookstore. Save your favorite titles and add them to your cart anytime.'
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
                    content='Your Wishlist | Inkwell Bookstore'
                />
                <meta
                    property='og:description'
                    content='View and manage your favorite books in your Inkwell Bookstore wishlist.'
                />
                <meta
                    property='og:type'
                    content='website'
                />
                <meta
                    property='og:image'
                    content='/images/wishlist-og.jpg'
                />
                <meta
                    name='twitter:card'
                    content='summary_large_image'
                />
                <meta
                    name='twitter:title'
                    content='Your Wishlist | Inkwell Bookstore'
                />
                <meta
                    name='twitter:description'
                    content='View and manage your favorite books in your Inkwell Bookstore wishlist.'
                />
                <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://inkwell-bookstore.com'}/dashboard/wishlist`} />
            </Head>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
            <section 
                className='max-w-2xl mx-auto bg-deepGray p-6 rounded-lg shadow-lg my-8'
                aria-labelledby="wishlist-heading">
                <h1 
                    id="wishlist-heading"
                    className='text-xl sm:text-2xl font-bold mb-6 text-center md:text-left text-warmBeige'>
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
                            className='text-burntAmber underline hover:text-deepCopper focus:ring-2 focus:ring-burntAmber focus:outline-none transition-colors'>
                            Browse books
                        </Link>{" "}
                        to add some!
                    </p>
                ) : (
                    <div className='space-y-4' role="list">
                        {wishlist.map((book) => (
                            <motion.article
                                key={book.slug}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className='flex items-center gap-4 bg-slightlyLightGrey p-4 rounded-lg'
                                aria-labelledby={`book-title-${book.slug}`}
                                role="listitem">
                                <Link href={`/book/${book.slug}`} className="focus:outline-none focus:ring-2 focus:ring-burntAmber rounded-lg">
                                    <Image
                                        src={book.urlPath || "/placeholder.svg"}
                                        alt={`${book.title} book cover`}
                                        width={80}
                                        height={120}
                                        className='rounded-lg object-cover'
                                        loading='lazy'
                                    />
                                </Link>
                                <div className='flex-1'>
                                    <Link 
                                        href={`/book/${book.slug}`}
                                        className="hover:text-burntAmber focus:outline-none focus:ring-2 focus:ring-burntAmber rounded transition-colors">
                                        <h2
                                            id={`book-title-${book.slug}`}
                                            className='text-warmBeige font-semibold text-lg'>
                                            {book.title}
                                        </h2>
                                    </Link>
                                    <p className='text-mutedSand'>
                                        by{" "}
                                        {typeof book.author === 'object' && book.author?.name 
                                            ? book.author.name 
                                            : typeof book.author === 'string' 
                                                ? book.author 
                                                : "Unknown Author"}
                                    </p>
                                    <p className='text-warmBeige font-bold'>
                                        ${book.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={() => handleAddToCart(book.slug)}
                                        className='p-2 bg-burntAmber text-darkMutedTeal rounded-lg hover:bg-deepCopper focus:outline-none focus:ring-2 focus:ring-burntAmber transition-colors'
                                        aria-label={`Add ${book.title} to cart`}>
                                        <ShoppingCart size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleRemove(book.slug)}
                                        disabled={isRemoving === book.slug}
                                        className='p-2 bg-deepCopper text-warmBeige rounded-lg hover:bg-burntAmber focus:outline-none focus:ring-2 focus:ring-deepCopper transition-colors disabled:opacity-50'
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
