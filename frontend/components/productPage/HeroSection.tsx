"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import {
    BookOpen,
    Calendar,
    Heart,
    Share2,
    ShoppingCart,
    Star,
    Tag,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { wishlistService } from "@/lib/api"
import { useState } from "react"
import Head from "next/head"

interface BookProps {
    slug: string // Changed from _id to slug
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
    onAddToCart: () => void
}

const HeroSectionProduct: React.FC<BookProps> = ({
    slug, // Changed from _id to slug
    title,
    author,
    reviews_number,
    description,
    pages_number,
    release_year,
    genre,
    price,
    urlPath,
    rating = 0, // Default value to avoid undefined
    onAddToCart,
}) => {
    const { token } = useAuth()
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }

    const handleWishlist = async () => {
        if (!token) {
            setMessage("Please log in to add to wishlist")
            return
        }
        if (!slug || typeof slug !== "string" || slug.trim() === "") {
            setMessage("Invalid book slug")
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
        }
    }

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Book",
        name: title,
        author: {
            "@type": "Person",
            name: author || "Unknown Author",
        },
        description: description,
        genre: genre,
        numberOfPages: pages_number,
        datePublished: release_year.toString(),
        offers: {
            "@type": "Offer",
            price: price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating,
            reviewCount: reviews_number,
        },
        image: urlPath || "/placeholder.svg",
    }

    return (
        <>
            <Head>
                <title>{`${title} by ${author || "Unknown Author"} | Bookstore`}</title>
                <meta
                    name='description'
                    content={`${description.slice(0, 150)}... Buy ${title} by ${
                        author || "Unknown Author"
                    } for $${price.toFixed(2)} at Bookstore.`}
                />
                <meta
                    name='robots'
                    content='index, follow'
                />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <meta
                    property='og:title'
                    content={`${title} by ${author || "Unknown Author"} | Bookstore`}
                />
                <meta
                    property='og:description'
                    content={`${description.slice(0, 150)}... Buy now for $${price.toFixed(
                        2
                    )}.`}
                />
                <meta
                    property='og:type'
                    content='product'
                />
                <meta
                    property='og:image'
                    content={urlPath || "/og-image.jpg"}
                />
                <meta
                    name='twitter:card'
                    content='summary_large_image'
                />
                <meta
                    name='twitter:title'
                    content={`${title} by ${author || "Unknown Author"}`}
                />
                <meta
                    name='twitter:description'
                    content={`${description.slice(0, 150)}... $${price.toFixed(2)}`}
                />
            </Head>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
            <motion.section
                initial='hidden'
                animate='visible'
                variants={fadeIn}
                className='relative bg-gradient-to-b from-deepBlue to-charcoalBlack py-8 sm:py-12 lg:py-20'>
                <div className='container mx-auto px-4'>
                    <article className='grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center'>
                        <motion.div
                            className='flex justify-center'
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}>
                            <div className='relative w-full max-w-[200px] sm:max-w-[250px] lg:max-w-[300px]'>
                                <Image
                                    src={urlPath || "/placeholder.svg"}
                                    alt={`${title} cover`}
                                    width={300}
                                    height={450}
                                    className='w-full h-auto rounded-2xl shadow-[0_0_20px_rgba(217,119,6,0.2)] hover:shadow-[0_0_30px_rgba(217,119,6,0.3)] transition-all duration-500'
                                    loading='lazy'
                                />
                                <motion.div
                                    className='absolute -right-2 -bottom-2 sm:-right-4 sm:-bottom-4 bg-warmBeige text-charcoalBlack px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold shadow-lg text-sm sm:text-base'
                                    whileHover={{ scale: 1.05 }}>
                                    ${price.toFixed(2)}
                                </motion.div>
                            </div>
                        </motion.div>
                        <div className='space-y-4 sm:space-y-6'>
                            <div>
                                <h1 className='font-author text-warmBeige text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 [text-shadow:0_0_10px_rgba(217,119,6,0.3)]'>
                                    {title}
                                </h1>
                                <h2 className='font-generalSans text-mutedSand text-lg sm:text-xl mb-3 sm:mb-4'>
                                    By {author || "Unknown Author"}
                                </h2>
                                <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
                                    <div className='flex gap-1'>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className='text-warmBeige sm:w-5 sm:h-5'
                                                fill={
                                                    i < Math.round(rating)
                                                        ? "#D97706"
                                                        : "none"
                                                }
                                            />
                                        ))}
                                    </div>
                                    <span className='text-mutedSand text-sm sm:text-base'>
                                        ({reviews_number} reviews)
                                    </span>
                                </div>
                            </div>
                            <p className='text-mutedSand text-base sm:text-lg leading-relaxed'>
                                {description}
                            </p>
                            <div className='flex flex-wrap gap-4 sm:gap-6'>
                                <div className='flex items-center gap-2 text-mutedSand text-sm sm:text-base'>
                                    <BookOpen
                                        size={16}
                                        className='sm:w-5 sm:h-5'
                                    />
                                    <span>{pages_number} pages</span>
                                </div>
                                <div className='flex items-center gap-2 text-mutedSand text-sm sm:text-base'>
                                    <Calendar
                                        size={16}
                                        className='sm:w-5 sm:h-5'
                                    />
                                    <span>{release_year}</span>
                                </div>
                                <div className='flex items-center gap-2 text-mutedSand text-sm sm:text-base'>
                                    <Tag
                                        size={16}
                                        className='sm:w-5 sm:h-5'
                                    />
                                    <span>{genre}</span>
                                </div>
                            </div>
                            <div className='flex flex-wrap gap-3 sm:gap-4'>
                                <motion.button
                                    onClick={onAddToCart}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className='bg-warmBeige text-charcoalBlack px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-colors text-sm sm:text-base'
                                    aria-label={`Add ${title} to cart`}>
                                    <ShoppingCart
                                        size={18}
                                        className='sm:w-5 sm:h-5'
                                    />
                                    Add to Cart
                                </motion.button>
                                <motion.button
                                    onClick={handleWishlist}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors text-sm sm:text-base ${
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
                                        className='sm:w-5 sm:h-5'
                                        fill={isWishlisted ? "#D97706" : "none"}
                                    />
                                    {isWishlisted ? "Wishlisted" : "Wishlist"}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className='bg-deepGray px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-warmBeige flex items-center gap-2 hover:bg-opacity-90 transition-colors text-sm sm:text-base'
                                    aria-label={`Share ${title}`}>
                                    <Share2
                                        size={18}
                                        className='sm:w-5 sm:h-5'
                                    />
                                    Share
                                </motion.button>
                            </div>
                            {message && (
                                <p
                                    className={`mt-2 text-sm sm:text-base ${
                                        message.includes("Added")
                                            ? "text-warmBeige"
                                            : "text-deepCopper"
                                    }`}
                                    role={
                                        message.includes("Added")
                                            ? "status"
                                            : "alert"
                                    }>
                                    {message}
                                </p>
                            )}
                        </div>
                    </article>
                </div>
            </motion.section>
        </>
    )
}

export default HeroSectionProduct
