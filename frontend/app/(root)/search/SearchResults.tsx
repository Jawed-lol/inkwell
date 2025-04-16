"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { bookService } from "@/lib/api"
import { Book } from "@/types/book"

interface SearchResultsProps {
    query: string
}

const SearchResults = ({ query }: SearchResultsProps) => {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query || query.trim() === '') {
                setBooks([])
                return
            }
            setLoading(true)
            setError(null)
            
            try {
                const response = await bookService.search(query)
                if (!response.success) {
                    throw new Error(response.message || "Failed to search books")
                }
                setBooks(response.data || [])
            } catch (err: unknown) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                )
                console.error("Search error:", err)
            } finally {
                setLoading(false)
            }
        }
        
        // Add debounce to prevent excessive API calls
        const timeoutId = setTimeout(() => {
            fetchSearchResults()
        }, 300)
        
        return () => clearTimeout(timeoutId)
    }, [query])

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

    // Calculate average rating for a book
    const getAverageRating = (book: Book): string => {
        if (!book.reviews || book.reviews.length === 0) return "N/A"
        const avgRating = book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length
        return avgRating.toFixed(1)
    }

    return (
        <div className='bg-charcoalBlack text-warmBeige min-h-screen py-20 lg:py-24'>
            <div className='container mx-auto py-8 px-6 lg:px-8'>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='text-3xl font-generalSans font-bold mb-6 text-burntAmber'>
                    Search Results for &quot;{query}&quot;
                </motion.h1>
                
                {/* Status messages with proper ARIA roles */}
                {loading && (
                    <div 
                        className='text-warmBeige flex items-center space-x-2'
                        role="status"
                        aria-live="polite">
                        <svg className="animate-spin h-5 w-5 text-burntAmber" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Searching for books...</span>
                    </div>
                )}
                
                {error && (
                    <div 
                        className='text-deepCopper bg-deepCopper/10 p-4 rounded-lg border border-deepCopper'
                        role="alert"
                        aria-live="assertive">
                        <p>Error: {error}</p>
                    </div>
                )}
                
                {!loading && !error && books.length === 0 && (
                    <p 
                        className='text-warmBeige'
                        aria-live="polite">
                        No books found for &quot;{query}&quot;. Try a different search term.
                    </p>
                )}
                
                <AnimatePresence>
                    {!loading && !error && books.length > 0 && (
                        <div 
                            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                            role="feed"
                            aria-busy={loading}
                            aria-label={`Search results for ${query}`}>
                            {books.map((book, index) => (
                                <motion.div
                                    key={book.slug}
                                    custom={index}
                                    initial='hidden'
                                    animate='visible'
                                    exit='hidden'
                                    variants={cardVariants}
                                    whileHover='hover'
                                    className='bg-deepGray rounded-lg overflow-hidden shadow-md'
                                    role="article">
                                    <Link 
                                        href={`/book/${book.slug}`}
                                        className="block h-full focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-2 focus:ring-offset-deepGray rounded-lg"
                                        aria-labelledby={`book-title-${book.slug}`}>
                                        <div className='relative w-full h-48'>
                                            <Image
                                                src={
                                                    book.urlPath ||
                                                    "/images/placeholder.png"
                                                }
                                                alt={`Cover of ${book.title}`}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                className='object-cover'
                                                priority={index < 4} // Prioritize loading first 4 images
                                            />
                                        </div>
                                        <div className='p-4'>
                                            <h2 
                                                id={`book-title-${book.slug}`}
                                                className='text-lg font-medium text-warmBeige truncate'>
                                                {book.title}
                                            </h2>
                                            <p className='text-sm text-mutedSand'>
                                                By {book.author.name}
                                            </p>
                                            <div className='flex justify-between items-center mt-2'>
                                                <p className='text-burntAmber font-bold'>
                                                    ${book.price.toFixed(2)}
                                                </p>
                                                {book.reviews_number > 0 && (
                                                    <div className='flex items-center'>
                                                        <svg 
                                                            className="w-4 h-4 text-burntAmber mr-1" 
                                                            fill="currentColor" 
                                                            viewBox="0 0 20 20"
                                                            aria-hidden="true">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className='text-sm text-mutedSand'>
                                                            {getAverageRating(book)}
                                                            <span className="sr-only"> out of 5 stars</span>
                                                            <span className="ml-1">
                                                                ({book.reviews_number})
                                                            </span>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
                
                {/* Structured data for SEO */}
                {books.length > 0 && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "ItemList",
                                "itemListElement": books.map((book, index) => ({
                                    "@type": "ListItem",
                                    "position": index + 1,
                                    "item": {
                                        "@type": "Book",
                                        "name": book.title,
                                        "author": {
                                            "@type": "Person",
                                            "name": book.author.name
                                        },
                                        "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://inkwell-bookstore.com"}/book/${book.slug}`,
                                        "image": book.urlPath,
                                        "offers": {
                                            "@type": "Offer",
                                            "price": book.price,
                                            "priceCurrency": "USD"
                                        }
                                    }
                                }))
                            })
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default SearchResults
