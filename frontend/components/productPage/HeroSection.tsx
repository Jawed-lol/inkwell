"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import {
    BookOpen,
    Calendar,
    Heart,
    Share2,
    ShoppingCart,
    Star,
    Tag,
    AlertCircle
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { wishlistService } from "@/lib/api"
import { useState, useEffect } from "react"

interface BookProps {
    slug: string 
    urlPath: string
    title: string
    author: string
    description: string
    reviews_number: number
    pages_number: number
    release_year: number
    genre: string
    price: number
    rating?: number
    stock?: number
    onAddToCart: () => void
}

const HeroSectionProduct: React.FC<BookProps> = ({
    slug,
    title,
    author,
    reviews_number,
    description,
    pages_number,
    release_year,
    genre,
    price,
    urlPath,
    rating = 0,
    stock,
    onAddToCart,
}) => {
    const { token } = useAuth()
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [isMounted, setIsMounted] = useState(false)
    const prefersReducedMotion = useReducedMotion()
    
    // Check if book is in stock
    const isInStock = stock === undefined || stock > 0

    useEffect(() => {
        setIsMounted(true)
        
        // Check if book is in wishlist when component mounts
        const checkWishlistStatus = async () => {
            if (token && slug) {
                try {
                    const wishlist = await wishlistService.getAll(token)
                    const isInWishlist = wishlist.some((item: { slug: string }) => item.slug === slug)
                    setIsWishlisted(isInWishlist)
                } catch (err) {
                    console.error("Failed to check wishlist status:", err)
                }
            }
        }
        
        checkWishlistStatus()
    }, [token, slug])

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }

    const handleWishlist = async () => {
        if (!token) {
            setMessage("Please log in to add to wishlist")
            setTimeout(() => setMessage(null), 3000)
            return
        }
        if (!slug || typeof slug !== "string" || slug.trim() === "") {
            setMessage("Invalid book slug")
            setTimeout(() => setMessage(null), 3000)
            return
        }
        try {
            await wishlistService.add(token, slug)
            setIsWishlisted(true)
            setMessage("Added to wishlist!")
            setTimeout(() => setMessage(null), 3000)
        } catch (err) {
            setMessage(
                err instanceof Error ? err.message : "Failed to add to wishlist"
            )
            setTimeout(() => setMessage(null), 3000)
        }
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${title} by ${author || "Unknown Author"}`,
                text: `Check out ${title} by ${author || "Unknown Author"}`,
                url: window.location.href,
            }).catch(err => {
                console.error('Error sharing:', err);
            });
        } else {
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    setMessage("Link copied to clipboard!");
                    setTimeout(() => setMessage(null), 3000);
                })
                .catch(() => {
                    setMessage("Failed to copy link");
                    setTimeout(() => setMessage(null), 3000);
                });
        }
    };

    return (
        <motion.section
            initial={!isMounted || prefersReducedMotion ? "visible" : "hidden"}
            animate="visible"
            variants={fadeIn}
            className="relative bg-gradient-to-b from-deepBlue to-charcoalBlack py-16 lg:py-24"
            aria-labelledby="book-title">
            <div className="container mx-auto px-4">
                <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center" itemScope itemType="https://schema.org/Book">
                    <meta itemProp="isbn" content={slug} />
                    <meta itemProp="numberOfPages" content={pages_number.toString()} />
                    <meta itemProp="datePublished" content={release_year.toString()} />
                    <meta itemProp="genre" content={genre} />
                    
                    <motion.div
                        className="flex justify-center"
                        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}>
                        <div className="relative w-full max-w-[200px] sm:max-w-[250px] lg:max-w-[300px]">
                            <Image
                                src={urlPath || "/placeholder.svg"}
                                alt={`Cover of ${title} by ${author || "Unknown Author"}`}
                                width={300}
                                height={450}
                                className="w-full h-auto rounded-2xl shadow-[0_0_20px_rgba(217,119,6,0.2)] hover:shadow-[0_0_30px_rgba(217,119,6,0.3)] transition-all duration-500"
                                priority
                                itemProp="image"
                            />
                            <motion.div
                                className="absolute -right-2 -bottom-2 sm:-right-4 sm:-bottom-4 bg-warmBeige text-charcoalBlack px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold shadow-lg text-sm sm:text-base"
                                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}>
                                <span aria-label={`Price: ${price.toFixed(2)} dollars`} itemProp="price">${price.toFixed(2)}</span>
                                <meta itemProp="priceCurrency" content="USD" />
                            </motion.div>
                            {!isInStock && (
                                <div className="absolute top-0 left-0 right-0 bg-charcoalBlack bg-opacity-80 py-2 text-center text-warmBeige text-sm font-bold rounded-t-2xl">
                                    Out of Stock
                                </div>
                            )}
                        </div>
                    </motion.div>
                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <h1 
                                id="book-title"
                                className="font-author text-warmBeige text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 [text-shadow:0_0_10px_rgba(217,119,6,0.3)]"
                                itemProp="name">
                                {title}
                            </h1>
                            <h2 className="font-generalSans text-mutedSand text-lg sm:text-xl mb-3 sm:mb-4">
                                By <span itemProp="author">{author || "Unknown Author"}</span>
                            </h2>
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <div 
                                    className="flex gap-1"
                                    aria-label={`Rating: ${rating} out of 5 stars`}
                                    itemProp="aggregateRating"
                                    itemScope
                                    itemType="https://schema.org/AggregateRating">
                                    <meta itemProp="ratingValue" content={rating.toString()} />
                                    <meta itemProp="reviewCount" content={reviews_number.toString()} />
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className="text-warmBeige sm:w-5 sm:h-5"
                                            fill={i < Math.round(rating) ? "#D97706" : "none"}
                                            aria-hidden="true"
                                        />
                                    ))}
                                </div>
                                <span className="text-mutedSand text-sm sm:text-base">
                                    ({reviews_number} {reviews_number === 1 ? 'review' : 'reviews'})
                                </span>
                            </div>
                        </div>
                        <p className="text-mutedSand text-base sm:text-lg leading-relaxed" itemProp="description">
                            {description}
                        </p>
                        <div className="flex flex-wrap gap-4 sm:gap-6">
                            <div className="flex items-center gap-2 text-mutedSand text-sm sm:text-base">
                                <BookOpen
                                    size={16}
                                    className="sm:w-5 sm:h-5"
                                    aria-hidden="true"
                                />
                                <span>{pages_number} pages</span>
                            </div>
                            <div className="flex items-center gap-2 text-mutedSand text-sm sm:text-base">
                                <Calendar
                                    size={16}
                                    className="sm:w-5 sm:h-5"
                                    aria-hidden="true"
                                />
                                <span>Published in {release_year}</span>
                            </div>
                            <div className="flex items-center gap-2 text-mutedSand text-sm sm:text-base">
                                <Tag
                                    size={16}
                                    className="sm:w-5 sm:h-5"
                                    aria-hidden="true"
                                />
                                <span>Genre: {genre}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 sm:gap-4">
                            {isInStock ? (
                                <motion.button
                                    onClick={onAddToCart}
                                    whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                                    whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                                    className="bg-warmBeige text-charcoalBlack px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-warmBeige focus:ring-offset-2 focus:ring-offset-charcoalBlack"
                                    aria-label={`Add ${title} to cart`}>
                                    <ShoppingCart
                                        size={18}
                                        className="sm:w-5 sm:h-5"
                                        aria-hidden="true"
                                    />
                                    Add to Cart
                                </motion.button>
                            ) : (
                                <motion.div
                                    className="bg-gray-500 text-gray-200 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold flex items-center gap-2 text-sm sm:text-base cursor-not-allowed"
                                    aria-label={`${title} is out of stock`}>
                                    <AlertCircle
                                        size={18}
                                        className="sm:w-5 sm:h-5"
                                        aria-hidden="true"
                                    />
                                    Out of Stock
                                </motion.div>
                            )}
                            <motion.button
                                onClick={handleWishlist}
                                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                                className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-warmBeige focus:ring-offset-2 focus:ring-offset-charcoalBlack ${
                                    isWishlisted
                                        ? "bg-burntAmber text-warmBeige"
                                        : "bg-deepGray text-warmBeige hover:bg-opacity-90"
                                }`}
                                aria-label={
                                    isWishlisted
                                        ? `${title} is in wishlist`
                                        : `Add ${title} to wishlist`
                                }
                                disabled={isWishlisted}>
                                <Heart
                                    size={18}
                                    className="sm:w-5 sm:h-5"
                                    fill={isWishlisted ? "#D97706" : "none"}
                                    aria-hidden="true"
                                />
                                {isWishlisted ? "Wishlisted" : "Wishlist"}
                            </motion.button>
                            <motion.button
                                onClick={handleShare}
                                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                                className="bg-deepGray px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-warmBeige flex items-center gap-2 hover:bg-opacity-90 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-warmBeige focus:ring-offset-2 focus:ring-offset-charcoalBlack"
                                aria-label={`Share ${title}`}>
                                <Share2
                                    size={18}
                                    className="sm:w-5 sm:h-5"
                                    aria-hidden="true"
                                />
                                Share
                            </motion.button>
                        </div>
                        {message && (
                            <p
                                className={`mt-2 text-sm sm:text-base ${
                                    message.includes("Added") || message.includes("copied")
                                        ? "text-warmBeige"
                                        : "text-deepCopper"
                                }`}
                                role={
                                    message.includes("Added") || message.includes("copied")
                                        ? "status"
                                        : "alert"
                                }
                                aria-live="polite">
                                {message}
                            </p>
                        )}
                    </div>
                </article>
            </div>
        </motion.section>
    )
}

export default HeroSectionProduct
