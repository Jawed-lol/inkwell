"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Head from "next/head"
import FiltersSidebar from "@/components/shopPage/FiltersSidebar"
import BookGrid from "@/components/shopPage/BookGrid"
import { Book } from "@/types/book"
import { bookService } from "@/lib/api"
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
        const loadBooks = async () => {
            try {
                setLoading(true)
                const response = await bookService.fetchBooks(currentPage, 12)
                setBooks(response.data)
                setTotalPages(response.totalPages ?? 1) // Fallback to 1 if totalPages is undefined
            } catch (error) {
                console.error("Error loading books:", error)
                setTotalPages(1) // Fallback in case of error
            } finally {
                setLoading(false)
            }
        }

        loadBooks()
    }, [currentPage])

    const filteredBooks = useMemo(() => {
        if (!Array.isArray(books)) {
            return []
        }
        return books.filter((book) => {
            const reviews = book.reviews || []

            const genreMatch =
                selectedGenres.length === 0 ||
                selectedGenres.includes(book.genre)

            const priceMatch =
                book.price >= priceRange[0] && book.price <= priceRange[1]

            const authorMatch =
                authorSearch === "" ||
                book.author.name.toLowerCase().includes(authorSearch.toLowerCase())

            const ratingMatch =
                reviews.length === 0 ||
                reviews.reduce((sum, r) => sum + r.rating, 0) /
                    reviews.length >=
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
            <Head>
                <title>Online Bookstore | Discover Your Next Great Read</title>
                <meta
                    name='description'
                    content='Browse our extensive collection of books across all genres. Filter by price, author, genre, and user ratings to find your perfect read.'
                />
                <meta
                    name='keywords'
                    content='books, online bookstore, literature, fiction, non-fiction, reading, book shop'
                />
                <link
                    rel='canonical'
                    href='https://yourbookstore.com/shop'
                />
                <meta
                    property='og:title'
                    content='Online Bookstore | Shop Books'
                />
                <meta
                    property='og:description'
                    content='Discover and purchase your next favorite book from our curated collection.'
                />
                <meta
                    property='og:type'
                    content='website'
                />
                <meta
                    property='og:url'
                    content='https://yourbookstore.com/shop'
                />
                <meta
                    name='twitter:card'
                    content='summary_large_image'
                />
                <meta
                    name='twitter:title'
                    content='Online Bookstore | Shop Books'
                />
                <meta
                    name='twitter:description'
                    content='Find your next great read from our extensive collection.'
                />
            </Head>

            <div className='pt-[120px] bg-gradient-to-b from-charcoalBlack to-deepGray min-h-screen'>
                <div className='max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12'>
                    <header>
                        <h1 className='sr-only'>
                            Online Bookstore - Browse Our Collection
                        </h1>
                    </header>

                    <div className='flex flex-col lg:flex-row md:gap-6 relative'>
                        <button
                            className='lg:hidden bg-deepGray text-warmBeige px-4 py-2 rounded-md mb-4 font-author'
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            aria-label='Toggle filters'
                            aria-expanded={isFiltersOpen}>
                            {isFiltersOpen ? "Hide Filters" : "Show Filters"}
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
                            <div className='mb-6 p-4 bg-deepGray text-warmBeige rounded-lg'>
                                <h2 className='font-author text-lg sm:text-xl'>
                                    Cart ({cart.length})
                                </h2>
                                {cart.length === 0 ? (
                                    <p className='text-mutedSand text-sm sm:text-base'>
                                        Your cart is empty. Start adding books
                                        to your collection!
                                    </p>
                                ) : (
                                    <ul className='space-y-2'>
                                        {cart.map((item) => (
                                            <li
                                                key={item.slug}
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

                            <section aria-label='Books collection'>
                                {loading ? (
                                    <p
                                        className='text-mutedSand text-center'
                                        aria-live='polite'>
                                        Loading books...
                                    </p>
                                ) : filteredBooks.length > 0 ? (
                                    <>
                                        <BookGrid books={filteredBooks} />

                                        <nav
                                            className='mt-6 flex justify-center gap-4'
                                            aria-label='Pagination'>
                                            <button
                                                onClick={() =>
                                                    setCurrentPage((prev) =>
                                                        Math.max(prev - 1, 1)
                                                    )
                                                }
                                                disabled={currentPage === 1}
                                                className='bg-burntAmber text-warmBeige px-3 py-1 sm:px-4 sm:py-2 rounded-md disabled:opacity-50 text-sm sm:text-base'
                                                aria-label='Go to previous page'>
                                                Previous
                                            </button>
                                            <span className='text-mutedSand text-sm sm:text-base'>
                                                Page {currentPage} of{" "}
                                                {totalPages}
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
                                                className='bg-burntAmber text-warmBeige px-3 py-1 sm:px-4 sm:py-2 rounded-md disabled:opacity-50 text-sm sm:text-base'
                                                aria-label='Go to next page'>
                                                Next
                                            </button>
                                        </nav>
                                    </>
                                ) : (
                                    <p
                                        className='text-mutedSand text-center'
                                        aria-live='polite'>
                                        No books found matching your filters.
                                        Try adjusting your criteria.
                                    </p>
                                )}
                            </section>
                        </main>
                    </div>
                </div>
            </div>
        </>
    )
}
