"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import BestSellerBookCard from "@/components/landingPage/BestSellerBookCard"
import { Book } from "@/types/book"

// Use the Book type directly instead of creating a redundant type
const BestSellerBooksSection = () => {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/books/random`
                )
                if (!response.ok) {
                    throw new Error("Failed to fetch books")
                }
                const data: Book[] = await response.json()
                setBooks(data)
                // Remove console.log in production code
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                )
                console.error("Error fetching bestseller books:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchBooks()
    }, [])

    // Animation variants for consistent animations
    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    }

    return (
        <section 
            className='w-full bg-[#1B1B1B]'
            aria-labelledby="bestsellers-heading"
        >
            <div className='flex items-center justify-center'>
                <h2
                    id="bestsellers-heading"
                    className={
                        "font-authorSans text-[#EAE0D5] font-bold text-center text-[28px] md:text-[32px] lg:text-[36px] " +
                        "pt-[60px] md:pt-[70px] lg:pt-[80px] pb-[30px] lg:pb-[40px]"
                    }>
                    Our Best Sellers
                </h2>
            </div>

            {loading && (
                <div 
                    className='text-center text-[#EAE0D5] py-8'
                    role="status"
                    aria-live="polite"
                >
                    <div className="inline-block animate-spin h-8 w-8 border-4 border-[#D68C45] border-t-transparent rounded-full mr-2" aria-hidden="true"></div>
                    <span>Loading best sellers...</span>
                </div>
            )}
            
            {error && (
                <div 
                    className='text-center text-red-500 py-8 max-w-md mx-auto bg-red-100 rounded-lg p-4'
                    role="alert"
                    aria-live="assertive"
                >
                    <p className="font-bold">Error loading bestsellers</p>
                    <p>{error}</p>
                    <button 
                        onClick={() => {
                            setLoading(true);
                            setError(null);
                            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/random`)
                                .then(response => {
                                    if (!response.ok) throw new Error("Failed to fetch books");
                                    return response.json();
                                })
                                .then(data => {
                                    setBooks(data);
                                    setLoading(false);
                                })
                                .catch(err => {
                                    setError(err instanceof Error ? err.message : "An error occurred");
                                    setLoading(false);
                                });
                        }}
                        className="mt-2 bg-[#D68C45] text-white px-4 py-2 rounded hover:bg-[#B36E30] focus:outline-none focus:ring-2 focus:ring-[#D68C45] focus:ring-opacity-50"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && books.length === 0 && (
                <p 
                    className='text-center text-[#EAE0D5] py-8'
                    aria-live="polite"
                >
                    No bestsellers available at the moment.
                </p>
            )}

            {!loading && !error && books.length > 0 && (
                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className={
                        "container grid grid-cols-1 gap-8 px-4 py-4 mx-auto md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 " +
                        "md:gap-10 md:px-8 md:py-6 lg:px-12 lg:py-8"
                    }
                    aria-label={`${books.length} bestselling books`}
                >
                    {books.map((book) => (
                        <motion.div
                            key={book._id}
                            variants={itemVariants}
                        >
                            <BestSellerBookCard {...book} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </section>
    )
}

export default BestSellerBooksSection
