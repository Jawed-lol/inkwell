"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Head from "next/head"
import FiltersSidebar from "@/components/shopPage/FiltersSidebar"
import BookGrid from "@/components/shopPage/BookGrid"
import { Book } from "@/types/book"
import { fetchBooks } from "@/lib/api"
import { useCart } from "@/context/CartContext"

export default function ShopPage() {
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false)
    const [selectedGenres, setSelectedGenres] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
    const [authorSearch, setAuthorSearch] = useState<string>("")
    const [minRating, setMinRating] = useState<number>(0)
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const { cart } = useCart()

    useEffect(() => {
        const getBooks = async () => {
            try {
                setLoading(true)
                const response = await fetchBooks(currentPage, 12)
                setBooks(response.data)
                setTotalPages(response.totalPages)
            } catch (error) {
                console.error("Failed to load books:", error)
            } finally {
                setLoading(false)
            }
        }
        getBooks()
    }, [currentPage])

    const filteredBooks = useMemo(() => {
        if (!Array.isArray(books)) {
            return []
        }
        return books.filter((book) => {
            const genreMatch =
                selectedGenres.length === 0 ||
                selectedGenres.includes(book.genre)
            const priceMatch =
                book.price >= priceRange[0] && book.price <= priceRange[1]
            const authorMatch =
                authorSearch === "" ||
                book.author.toLowerCase().includes(authorSearch.toLowerCase())
            const ratingMatch =
                book.reviews.length === 0 ||
                book.reviews.reduce((sum, r) => sum + r.rating, 0) /
                    book.reviews.length >=
                    minRating
            return genreMatch && priceMatch && authorMatch && ratingMatch
        })
    }, [books, selectedGenres, priceRange, authorSearch, minRating])

    const sidebarContent = (
        <FiltersSidebar
            selectedGenres={selectedGenres}
            onGenreChange={setSelectedGenres}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            authorSearch={authorSearch}
            onAuthorSearchChange={setAuthorSearch}
            minRating={minRating}
            onMinRatingChange={setMinRating}
        />
    )

    return (
        <>
            <Head>{/* Unchanged Head content */}</Head>

            <div className='pt-[120px] bg-gradient-to-b from-charcoalBlack to-deepGray min-h-screen'>
                <div className='max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12'>
                    <div className='flex flex-col lg:flex-row md:gap-6 relative'>
                        <button
                            className='lg:hidden bg-deepGray text-warmBeige px-4 py-2 rounded-md mb-4 font-author'
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            aria-label='Toggle filters'>
                            Filters
                        </button>

                        <aside className='hidden lg:block w-[280px] bg-deepGray p-4 rounded-lg'>
                            {sidebarContent}
                        </aside>

                        <AnimatePresence>
                            {isFiltersOpen && (
                                <>
                                    <motion.aside
                                        className='fixed inset-y-0 left-0 w-[280px] bg-deepGray p-4 shadow-lg z-50 lg:hidden'
                                        initial={{ x: "-100%" }}
                                        animate={{ x: 0 }}
                                        exit={{ x: "-100%" }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                        }}>
                                        {sidebarContent}
                                    </motion.aside>
                                    <motion.div
                                        className='fixed inset-0 bg-black/50 z-40 lg:hidden'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setIsFiltersOpen(false)}
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        <main className='flex-1 px-3 lg:px-6'>
                            {/* Cart Display */}
                            <div className='mb-6 p-4 bg-deepGray text-warmBeige rounded-lg'>
                                <h2 className='font-author text-lg sm:text-xl'>
                                    Cart ({cart.length})
                                </h2>
                                {cart.length === 0 ? (
                                    <p className='text-mutedSand text-sm sm:text-base'>
                                        Cart is empty.
                                    </p>
                                ) : (
                                    <ul className='space-y-2'>
                                        {cart.map((item) => (
                                            <li
                                                key={item._id}
                                                className='text-sm sm:text-base'>
                                                {item.title} - $
                                                {item.price != null
                                                    ? item.price.toFixed(2)
                                                    : "N/A"}{" "}
                                                x {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {loading ? (
                                <p className='text-mutedSand text-center'>
                                    Loading books...
                                </p>
                            ) : filteredBooks.length > 0 ? (
                                <>
                                    <BookGrid books={filteredBooks} />
                                    <div className='mt-6 flex justify-center gap-4'>
                                        <button
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.max(prev - 1, 1)
                                                )
                                            }
                                            disabled={currentPage === 1}
                                            className='bg-burntAmber text-warmBeige px-3 py-1 sm:px-4 sm:py-2 rounded-md disabled:opacity-50 text-sm sm:text-base'>
                                            Previous
                                        </button>
                                        <span className='text-mutedSand text-sm sm:text-base'>
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        prev + 1,
                                                        totalPages
                                                    )
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className='bg-burntAmber text-warmBeige px-3 py-1 sm:px-4 sm:py-2 rounded-md disabled:opacity-50 text-sm sm:text-base'>
                                            Next
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p className='text-mutedSand text-center'>
                                    No books found matching your filters.
                                </p>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </>
    )
}
