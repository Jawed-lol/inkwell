import { motion, useReducedMotion } from "framer-motion"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

interface RelatedBookProps {
    id: string 
    title: string
    coverPath: string
    rating: number
    author: string
}

const RelatedBook = ({
    id,
    title,
    coverPath,
    rating,
    author,
}: RelatedBookProps) => {
    const prefersReducedMotion = useReducedMotion()
    const [isMounted, setIsMounted] = useState(false)
    
    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    const bookTitle = title || "Untitled"
    const authorName = author || "Unknown Author"
    const ratingValue = rating ? rating.toFixed(1) : "N/A"
    
    return (
        <Link 
            href={`/book/${id}`}
            className="block focus:outline-none focus:ring-2 focus:ring-warmBeige focus:ring-offset-2 focus:ring-offset-charcoalBlack rounded-xl"
            aria-label={`${bookTitle} by ${authorName}, rated ${ratingValue} out of 5`}>
            <motion.div
                key={id}
                whileHover={!isMounted || prefersReducedMotion ? {} : { y: -5 }}
                className="bg-charcoalGray bg-opacity-50 p-4 rounded-xl group cursor-pointer"
                role="article">
                <div className="relative mb-4">
                    <Image
                        src={coverPath || "/placeholder.svg"}
                        alt={`Cover of ${bookTitle} by ${authorName}`}
                        width={200}
                        height={300}
                        className="w-full rounded-lg shadow-lg group-hover:shadow-[0_0_20px_rgba(217,119,6,0.2)] transition-all duration-300"
                    />
                    <div 
                        className="absolute top-2 right-2 bg-charcoalBlack bg-opacity-90 px-2 py-1 rounded-md flex items-center gap-1"
                        aria-hidden="true">
                        <Star
                            size={14}
                            className="text-warmBeige"
                            fill="#D97706"
                        />
                        <span className="text-warmBeige text-sm">
                            {ratingValue}
                        </span>
                    </div>
                </div>
                <h3 className="text-warmBeige font-semibold mb-1 group-hover:text-opacity-80 transition-colors">
                    {bookTitle}
                </h3>
                <p className="text-mutedSand text-sm">
                    {authorName}
                </p>
            </motion.div>
        </Link>
    )
}

export default RelatedBook
