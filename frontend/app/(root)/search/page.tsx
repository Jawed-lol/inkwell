"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { fetchBooksBySearch } from "@/lib/api"

interface Book {
    _id: string
    title: string
    author: string
    price: number
    urlPath: string
    reviews: { rating: number }[]
    reviews_number: number
}

const SearchResults = () => {
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || ""
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return
            setLoading(true)
            try {
                const { data } = await fetchBooksBySearch(query)
                setBooks(data || [])
            } catch (err: unknown) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                )
            } finally {
                setLoading(false)
            }
        }
        fetchSearchResults()
    }, [query])

    // Animation variants for the book cards
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut",
            },
        }),
        hover: {
            scale: 1.05,
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
    }

    return (
        <div className='bg-charcoalBlack text-warmBeige min-h-screen py-20 lg:py-24'>
            <div className='container mx-auto py-8 px-6 lg:px-8'>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='text-3xl font-generalSans font-bold mb-6 text-burntAmber'>
                    Search Results for “{query}“
                </motion.h1>
                {loading && <p className='text-warmBeige'>Loading...</p>}
                {error && <p className='text-deepCopper'>Error: {error}</p>}
                {!loading && !error && books.length === 0 && (
                    <p className='text-warmBeige'>
                        No books found for “{query}”.
                    </p>
                )}
                <AnimatePresence>
                    {!loading && !error && books.length > 0 && (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                            {books.map((book, index) => (
                                <motion.div
                                    key={book._id}
                                    custom={index}
                                    initial='hidden'
                                    animate='visible'
                                    exit='hidden'
                                    variants={cardVariants}
                                    whileHover='hover'
                                    className='bg-deepGray rounded-lg overflow-hidden shadow-md'>
                                    <Link href={`/book/${book._id}`}>
                                        <div className='relative w-full h-48'>
                                            <Image
                                                src={
                                                    book.urlPath ||
                                                    "/images/placeholder.png"
                                                }
                                                alt={book.title}
                                                fill
                                                className='object-cover'
                                            />
                                        </div>
                                        <div className='p-4'>
                                            <h2 className='text-lg font-medium text-warmBeige truncate'>
                                                {book.title}
                                            </h2>
                                            <p className='text-sm text-mutedSand'>
                                                {book.author}
                                            </p>
                                            <p className='text-burntAmber font-bold mt-2'>
                                                ${book.price.toFixed(2)}
                                            </p>
                                            {book.reviews_number > 0 && (
                                                <p className='text-sm text-mutedSand'>
                                                    Rating:{" "}
                                                    {(
                                                        book.reviews.reduce(
                                                            (sum, r) =>
                                                                sum + r.rating,
                                                            0
                                                        ) / book.reviews.length
                                                    ).toFixed(1)}{" "}
                                                    ({book.reviews_number}{" "}
                                                    reviews)
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default SearchResults
