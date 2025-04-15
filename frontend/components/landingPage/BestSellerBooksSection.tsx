"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import BestSellerBookCard from "@/components/landingPage/BestSellerBookCard"
import { Book } from "@/types/book"

type BookProps = Book


const BestSellerBooksSection = () => {
    const [books, setBooks] = useState<BookProps[]>([])
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
                const data: BookProps[] = await response.json()
                setBooks(data)
                console.log(data)
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                )
            } finally {
                setLoading(false)
            }
        }
        fetchBooks()
    }, [])

    return (
        <section className='w-full bg-[#1B1B1B]'>
            <div className='flex items-center justify-center'>
                <h2
                    className={
                        "font-authorSans text-[#EAE0D5] font-bold text-center text-[28px] md:text-[32px] lg:text-[36px] " +
                        "pt-[60px] md:pt-[70px] lg:pt-[80px] pb-[30px] lg:pb-[40px]"
                    }>
                    Our Best Sellers
                </h2>
            </div>

            {loading && (
                <p className='text-center text-[#EAE0D5] py-8'>
                    Loading best sellers...
                </p>
            )}
            {error && (
                <p className='text-center text-red-500 py-8'>Error: {error}</p>
            )}

            {!loading && !error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        staggerChildren: 0.2,
                    }}
                    className={
                        "container grid grid-cols-1 gap-8 px-4 py-4 mx-auto md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 " +
                        "md:gap-10 md:px-8 md:py-6 lg:px-12 lg:py-8"
                    }>
                    {books.map((book) => (
                        <motion.div
                            key={book._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut" }}>
                            <BestSellerBookCard {...book} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </section>
    )
}

export default BestSellerBooksSection
