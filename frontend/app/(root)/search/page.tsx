"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"

const SearchResults = () => {
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || ""
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return
            setLoading(true)
            try {
                // Using your BASE_URL from the API client
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/books/search?q=${encodeURIComponent(query)}`
                )
                if (!response.ok) throw new Error("Failed to fetch books")
                const data = await response.json()
                if (!data.success)
                    throw new Error(data.message || "Search failed")
                setBooks(data.data || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchSearchResults()
    }, [query])

    return (
        <div className='bg-charcoalBlack text-warmBeige min-h-screen'>
            <div className='container mx-auto py-8 px-6 lg:px-8'>
                <h1 className='text-3xl font-generalSans font-bold mb-6 text-burntAmber'>
                    Search Results for "{query}"
                </h1>

                {loading && <p className='text-mutedSand'>Loading...</p>}

                {error && <p className='text-deepCopper'>Error: {error}</p>}

                {!loading && !error && books.length === 0 && query && (
                    <p className='text-mutedSand'>
                        No books found for "{query}".
                    </p>
                )}

                {!loading && !error && books.length > 0 && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {books.map((book) => (
                            <Link
                                key={book._id}
                                href={`/book/${book._id}`}
                                className='bg-deepGray rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200'>
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
                                                    (sum, r) => sum + r.rating,
                                                    0
                                                ) / book.reviews.length
                                            ).toFixed(1)}{" "}
                                            ({book.reviews_number} reviews)
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchResults
