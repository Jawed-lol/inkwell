"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import FiltersSidebar from "@/components/shopPage/FiltersSidebar"
import BookGrid from "@/components/shopPage/BookGrid"
import { Book } from "@/types/book"
import { bookService } from "@/lib/api"
import { useCart } from "@/context/CartContext"
import Link from "next/link"

// Updated comment to explain SEO handling in client components
// SEO metadata is handled via the hidden div and useEffect for title since this is a client component

export default function ShopPage() {
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false)
    const [selectedGenres, setSelectedGenres] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
    const [authorSearch, setAuthorSearch] = useState<string>("")
    const [minRating, setMinRating] = useState<number>(0)
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const { cart } = useCart()

    // Set page title and meta description for SEO
    useEffect(() => {
        document.title = "Shop Books | Inkwell Bookstore"
        // Add meta description dynamically
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Browse our extensive collection of books across all genres. Filter by price, author, genre, and user ratings to find your perfect read.')
        } else {
            const newMetaDescription = document.createElement('meta')
            newMetaDescription.name = 'description'
            newMetaDescription.content = 'Browse our extensive collection of books across all genres. Filter by price, author, genre, and user ratings to find your perfect read.'
            document.head.appendChild(newMetaDescription)
        }
    }, [])

    useEffect(() => {
        const loadBooks = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await bookService.fetchBooks(currentPage, 12)
                
                if (!response.success) {
                    throw new Error(response.message || "Failed to load books")
                }
                
                setBooks(response.data || [])
                setTotalPages(response.totalPages ?? 1)
            } catch (err) {
                console.error("Error loading books:", err)
                setError(err instanceof Error ? err.message : "Failed to load books. Please try again.")
                setBooks([])
                setTotalPages(1)
            } finally {
                setLoading(false)
            }
        }

        loadBooks()
        
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [currentPage])

    const filteredBooks = useMemo(() => {
        if (!Array.isArray(books)) {
            return []
        }
        return books.filter((book) => {
            // Safely handle missing properties
            const reviews = book.reviews || []
            const genre = book.genre || ""
            const price = book.price || 0
            const authorName = book.author?.name || ""

            const genreMatch =
                selectedGenres.length === 0 ||
                selectedGenres.includes(genre)

            const priceMatch =
                price >= priceRange[0] && price <= priceRange[1]

            const authorMatch =
                authorSearch === "" ||
                authorName.toLowerCase().includes(authorSearch.toLowerCase())

            const avgRating = reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0

            const ratingMatch = avgRating >= minRating

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

    // Enhanced Schema.org structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Shop Books | Inkwell Bookstore",
        "description": "Browse our extensive collection of books across all genres. Filter by price, author, genre, and user ratings to find your perfect read.",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"}/shop`,
        "publisher": {
            "@type": "Organization",
            "name": "Inkwell Bookstore",
            "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"}/images/weblogo.png`
            }
        },
        "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "USD",
            "lowPrice": priceRange[0],
            "highPrice": priceRange[1],
            "offerCount": filteredBooks.length
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Shop",
                    "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"}/shop`
                }
            ]
        }
    }

    // Function to retry loading books
    const retryLoadBooks = () => {
        setCurrentPage(1)
        setLoading(true)
        setError(null)
        
        const loadBooks = async () => {
            try {
                const response = await bookService.fetchBooks(1, 12)
                
                if (!response.success) {
                    throw new Error(response.message || "Failed to load books")
                }
                
                setBooks(response.data || [])
                setTotalPages(response.totalPages ?? 1)
            } catch (err) {
                console.error("Error loading books:", err)
                setError(err instanceof Error ? err.message : "Failed to load books. Please try again.")
                setBooks([])
                setTotalPages(1)
            } finally {
                setLoading(false)
            }
        }
        
        loadBooks()
    }

    return (
        <>
            {/* Enhanced hidden SEO content */}
            <div className="hidden">
                <h1>Shop Books | Inkwell Bookstore</h1>
                <p>Browse our extensive collection of books across all genres. Filter by price, author, genre, and user ratings to find your perfect read.</p>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData)
                    }}
                />
                <link
                    rel="canonical"
                    href={`${process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"}/shop`}
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#1A1A1A" />
            </div>

            <div className="pt-[120px] bg-gradient-to-b from-charcoalBlack to-deepGray min-h-screen">
                <div className="max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12">
                    <header className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-author font-bold text-warmBeige">
                            Shop Books
                        </h1>
                        <p className="text-mutedSand mt-2">
                            Browse our collection and find your next favorite book
                        </p>
                        
                        {/* Added semantic breadcrumbs for accessibility and SEO */}
                        <nav aria-label="Breadcrumb" className="mt-4">
                            <ol className="flex flex-wrap text-xs text-mutedSand">
                                <li className="flex items-center">
                                    <Link href="/" className="hover:text-burntAmber focus:outline-none focus:underline">
                                        Home
                                    </Link>
                                    <span className="mx-2" aria-hidden="true">/</span>
                                </li>
                                <li className="flex items-center text-burntAmber" aria-current="page">
                                    Shop
                                </li>
                            </ol>
                        </nav>
                    </header>

                    <div className="flex flex-col lg:flex-row md:gap-6 relative">
                        <button
                            className="lg:hidden bg-deepGray text-warmBeige px-4 py-2 rounded-md mb-4 font-author focus:outline-none focus:ring-2 focus:ring-burntAmber"
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            aria-label={isFiltersOpen ? "Hide filters" : "Show filters"}
                            aria-expanded={isFiltersOpen}
                            aria-controls="filters-sidebar">
                            {isFiltersOpen ? "Hide Filters" : "Show Filters"}
                        </button>

                        <aside 
                            className="hidden lg:block w-[280px] bg-deepGray p-4 rounded-lg"
                            aria-label="Filters">
                            {sidebarContent}
                        </aside>

                        <AnimatePresence>
                            {isFiltersOpen && (
                                <>
                                    <motion.aside
                                        id="filters-sidebar"
                                        className="fixed inset-y-0 left-0 w-[280px] bg-deepGray p-4 shadow-lg z-50 lg:hidden overflow-y-auto"
                                        initial={{ x: "-100%" }}
                                        animate={{ x: 0 }}
                                        exit={{ x: "-100%" }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                        aria-label="Filters">
                                        <button
                                            className="absolute top-4 right-4 text-warmBeige hover:text-burntAmber focus:outline-none focus:ring-2 focus:ring-burntAmber rounded-full p-1"
                                            onClick={() => setIsFiltersOpen(false)}
                                            aria-label="Close filters">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        {sidebarContent}
                                    </motion.aside>
                                    <motion.div
                                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setIsFiltersOpen(false)}
                                        aria-hidden="true"
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        <main id="main-content" className="flex-1 px-3 lg:px-6">
                            <div 
                                className="mb-6 p-4 bg-deepGray text-warmBeige rounded-lg"
                                aria-label="Shopping cart summary">
                                <h2 className="font-author text-lg sm:text-xl mb-2">
                                    Your Cart ({cart.length})
                                </h2>
                                {cart.length === 0 ? (
                                    <p className="text-mutedSand text-sm sm:text-base">
                                        Your cart is empty. Start adding books
                                        to your collection!
                                    </p>
                                ) : (
                                    <>
                                        <ul className="space-y-2 mb-3" aria-label="Cart items">
                                            {cart.map((item) => (
                                                <li
                                                    key={item.slug}
                                                    className="text-sm sm:text-base flex justify-between">
                                                    <span className="truncate mr-2">{item.title}</span>
                                                    <span>
                                                        ${item.price != null
                                                            ? item.price.toFixed(2)
                                                            : "N/A"}{" "}
                                                        x {item.quantity}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href="/cart"
                                            className="inline-block bg-burntAmber text-warmBeige px-4 py-2 rounded-md text-sm font-author hover:bg-deepCopper transition-colors focus:outline-none focus:ring-2 focus:ring-burntAmber">
                                            View Cart
                                        </Link>
                                    </>
                                )}
                            </div>

                            <section aria-label="Books collection">
                                {loading ? (
                                    <div 
                                        className="flex items-center justify-center py-8"
                                        role="status"
                                        aria-live="polite">
                                        <svg className="animate-spin h-8 w-8 text-burntAmber" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="ml-3 text-warmBeige">Loading books...</span>
                                    </div>
                                ) : error ? (
                                    <div 
                                        className="bg-deepCopper/10 border border-deepCopper text-deepCopper p-4 rounded-lg"
                                        role="alert"
                                        aria-live="assertive">
                                        <p>{error}</p>
                                        <button 
                                            onClick={retryLoadBooks}
                                            className="mt-2 bg-burntAmber text-warmBeige px-3 py-1 rounded-md text-sm hover:bg-deepCopper transition-colors focus:outline-none focus:ring-2 focus:ring-burntAmber">
                                            Try Again
                                        </button>
                                    </div>
                                ) : filteredBooks.length > 0 ? (
                                    <>
                                        <div 
                                            className="mb-4 text-mutedSand"
                                            aria-live="polite">
                                            <p>Showing {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}</p>
                                        </div>
                                        
                                        <BookGrid books={filteredBooks} />

                                        <nav
                                            className="mt-8 flex flex-wrap justify-center gap-4"
                                            aria-label="Pagination">
                                            <button
                                                onClick={() =>
                                                    setCurrentPage((prev) =>
                                                        Math.max(prev - 1, 1)
                                                    )
                                                }
                                                disabled={currentPage === 1}
                                                className="bg-burntAmber text-warmBeige px-3 py-1 sm:px-4 sm:py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-colors hover:bg-deepCopper focus:outline-none focus:ring-2 focus:ring-burntAmber"
                                                aria-label="Go to previous page">
                                                <span aria-hidden="true">←</span> Previous
                                            </button>
                                            
                                            <div className="flex items-center">
                                                <span className="text-mutedSand text-sm sm:text-base">
                                                    Page {currentPage} of {totalPages}
                                                </span>
                                            </div>
                                            
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
                                                className="bg-burntAmber text-warmBeige px-3 py-1 sm:px-4 sm:py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-colors hover:bg-deepCopper focus:outline-none focus:ring-2 focus:ring-burntAmber"
                                                aria-label="Go to next page">
                                                Next <span aria-hidden="true">→</span>
                                            </button>
                                        </nav>
                                    </>
                                ) : (
                                    <div
                                        className="text-mutedSand text-center py-8"
                                        aria-live="polite">
                                        <p className="mb-3">No books found matching your filters.</p>
                                        <button
                                            onClick={() => {
                                                setSelectedGenres([]);
                                                setPriceRange([0, 100]);
                                                setAuthorSearch("");
                                                setMinRating(0);
                                            }}
                                            className="bg-burntAmber text-warmBeige px-4 py-2 rounded-md text-sm hover:bg-deepCopper transition-colors focus:outline-none focus:ring-2 focus:ring-burntAmber">
                                            Reset Filters
                                        </button>
                                    </div>
                                )}
                            </section>
                        </main>
                    </div>
                </div>
            </div>
        </>
    )
}
