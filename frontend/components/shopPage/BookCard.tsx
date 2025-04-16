import { motion, useReducedMotion } from "framer-motion"
import { Book } from "@/types/book"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"

interface BookCardProps {
    book: Book
}

export default function BookCard({ book }: BookCardProps) {
    const { addToCart } = useCart()
    const prefersReducedMotion = useReducedMotion()
    const [isMounted, setIsMounted] = useState(false)
    const [message, setMessage] = useState("")
    
    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        addToCart(book)
        setMessage(`${book.title} added to cart!`)
        
        // Clear message after 3 seconds
        setTimeout(() => {
            setMessage("")
        }, 3000)
    }

    return (
        <div className="relative">
            <Link
                href={`/book/${book.slug}`}
                className="block focus:outline-none focus:ring-2 focus:ring-warmBeige focus:ring-offset-2 focus:ring-offset-deepBlue rounded-lg">
                <motion.article
                    className="bg-deepGray rounded-lg overflow-hidden cursor-pointer h-full flex flex-col"
                    whileHover={prefersReducedMotion ? {} : {
                        scale: 1.03,
                        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
                    }}
                    transition={{ duration: 0.2 }}
                    initial={isMounted && !prefersReducedMotion ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}>
                    <div className="relative">
                        <Image
                            src={book.urlPath || "/placeholder.svg"}
                            alt={`Cover of ${book.title} by ${book.author?.name || "Unknown Author"}`}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover rounded-t-lg"
                            priority={false}
                        />
                        <div className="absolute top-2 right-2 bg-charcoalBlack bg-opacity-80 px-2 py-1 rounded text-warmBeige text-sm font-bold">
                            ${book.price.toFixed(2)}
                        </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                        <h2 className="text-sm md:text-[16px] lg:text-lg leading-tight font-author font-bold text-warmBeige mb-2">
                            {book.title}
                        </h2>
                        <p className="font-generalSans text-[10px] md:text-[12px] lg:text-sm text-mutedSand mb-1">
                            {book.author?.name || "Unknown Author"}
                        </p>
                        <div className="mt-auto pt-3">
                            <button
                                onClick={handleAddToCart}
                                className="font-author font-bold text-[10px] md:text-[12px] lg:text-sm bg-burntAmber hover:bg-deepCopper rounded-[8px] py-1 px-2 md:py-1.5 md:px-3 lg:py-2 lg:px-4 w-full text-darkMutedTeal transition-colors flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-1 focus:ring-offset-deepGray"
                                aria-label={`Add ${book.title} to cart`}>
                                <ShoppingCart size={16} aria-hidden="true" />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </motion.article>
            </Link>
            
            {message && (
                <div 
                    className="absolute top-2 left-2 right-2 bg-deepCopper bg-opacity-90 text-darkMutedTeal px-3 py-2 rounded-md text-sm text-center"
                    role="status"
                    aria-live="polite">
                    {message}
                </div>
            )}
        </div>
    )
}
