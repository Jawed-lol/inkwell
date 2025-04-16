"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import { XIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Head from "next/head"

// Define types for cart items

declare global {
    interface Window {
        gtag?: (command: string, action: string, params: object) => void
    }
}

function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "page_view", {
                page_title: "Shopping Cart",
                page_path: "/cart",
            })
        }
    }, [])

    const handleIncreaseQuantity = (bookId: string) => {
        const item = cart.find((i) => i.slug === bookId)
        if (item) {
            updateQuantity(bookId, item.quantity + 1)
        }
    }

    const handleDecreaseQuantity = (bookId: string) => {
        const item = cart.find((i) => i.slug === bookId)
        if (item) {
            if (item.quantity > 1) {
                updateQuantity(bookId, item.quantity - 1)
            } else {
                removeFromCart(bookId)
            }
        }
    }

    const total = cart.reduce(
        (sum, item) => sum + (item.price ?? 0) * item.quantity,
        0
    )

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }
    
    const generateStructuredData = () => ({
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: cart.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "Product",
                name: item.title || "Unknown Title",
                author: typeof item.author === 'string' 
                    ? item.author 
                    : (item.author?.name || "Unknown Author"),
                offers: {
                    "@type": "Offer",
                    price: item.price,
                    priceCurrency: "USD",
                },
            },
        })),
    })

    const generateBreadcrumbData = () => ({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://inkwellbookstore.com"
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Shopping Cart",
                item: "https://inkwellbookstore.com/cart"
            }
        ]
    })

    if (!isClient) {
        return (
            <main className='pt-[120px] bg-gradient-to-b from-charcoalBlack to-deepGray min-h-screen'>
                <div className='max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 py-8'>
                    <p className='text-warmBeige text-center'>
                        Loading cart...
                    </p>
                </div>
            </main>
        )
    }

    return (
        <>
            <Head>
                <title>Your Shopping Cart | Inkwell Bookstore</title>
                <meta name="description" content="Review and manage your selected books before checkout. Update quantities or proceed to secure checkout." />
                <meta name="robots" content="noindex, follow" />
                <link rel="canonical" href="https://inkwellbookstore.com/cart" />
                <meta property="og:title" content="Your Shopping Cart | Inkwell Bookstore" />
                <meta property="og:description" content="Review and manage your selected books before checkout." />
                <meta property="og:url" content="https://inkwellbookstore.com/cart" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Your Shopping Cart | Inkwell Bookstore" />
                <meta name="twitter:description" content="Review and manage your selected books before checkout." />
            </Head>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ 
                    __html: JSON.stringify(generateStructuredData()) 
                }}
            />
            
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ 
                    __html: JSON.stringify(generateBreadcrumbData()) 
                }}
            />

            <main className='pt-[120px] bg-gradient-to-b from-charcoalBlack to-deepGray min-h-screen' aria-label="Shopping Cart Page">
                <div className='max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 py-8'>
                    <motion.h1
                        initial='hidden'
                        animate='visible'
                        variants={fadeIn}
                        className='font-author text-warmBeige text-2xl sm:text-3xl md:text-4xl mb-8 text-center'>
                        Your Shopping Cart
                    </motion.h1>

                    {cart.length === 0 ? (
                        <motion.div
                            initial='hidden'
                            animate='visible'
                            variants={fadeIn}
                            className='text-center'>
                            <p className='text-mutedSand text-center text-base sm:text-lg mb-4'>
                                Your cart is empty.
                            </p>
                            <Link
                                href='/shop'
                                className='text-burntAmber hover:text-deepCopper inline-block font-author font-bold py-2 px-4 rounded-lg border border-burntAmber hover:border-deepCopper transition duration-200'>
                                Browse Our Book Collection
                            </Link>
                        </motion.div>
                    ) : (
                        <div className='space-y-6'>
                            <section aria-label='Cart items'>
                                <AnimatePresence>
                                    {cart.map((item) => (
                                        <motion.article
                                            key={item.slug}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className='bg-deepGray rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4'>
                                            <div className='flex flex-col sm:flex-row items-center gap-4'>
                                                <Image
                                                    src={
                                                        item.urlPath ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={`Cover of ${item.title || "Unknown book"}`}
                                                    width={100}
                                                    height={150}
                                                    className='rounded-lg object-cover w-[80px] h-[120px] sm:w-[100px] sm:h-[150px]'
                                                    crossOrigin='anonymous'
                                                    priority={true}
                                                />
                                                <div className='text-center sm:text-left'>
                                                    <h2 className='font-author font-bold text-warmBeige text-lg md:text-xl'>
                                                        {item.title ||
                                                            "Unknown Title"}
                                                    </h2>
                                                    <p className='font-generalSans text-mutedSand text-sm md:text-base'>
                                                        by{" "}
                                                        {typeof item.author === 'string'
                                                            ? item.author
                                                            : (item.author?.name || "Unknown Author")}
                                                    </p>
                                                    <p className='font-generalSans text-burntAmber font-bold text-sm md:text-base'>
                                                        $
                                                        {item.price != null
                                                            ? item.price.toFixed(
                                                                  2
                                                              )
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-4'>
                                                <div
                                                    className='flex items-center gap-2'
                                                    role='group'
                                                    aria-label={`Quantity controls for ${item.title}`}>
                                                    <button
                                                        onClick={() =>
                                                            handleDecreaseQuantity(
                                                                item.slug
                                                            )
                                                        }
                                                        className={`bg-burntAmber text-darkMutedTeal font-generalSans font-bold w-8 h-8 rounded-full hover:bg-deepCopper transition duration-200`}
                                                        aria-label={`Decrease quantity of ${item.title}`}>
                                                        -
                                                    </button>
                                                    <span
                                                        className='font-generalSans text-warmBeige text-lg'
                                                        aria-live='polite'>
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleIncreaseQuantity(
                                                                item.slug
                                                            )
                                                        }
                                                        className='bg-burntAmber text-darkMutedTeal font-generalSans font-bold w-8 h-8 rounded-full hover:bg-deepCopper transition duration-200'
                                                        aria-label={`Increase quantity of ${item.title}`}>
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item.slug
                                                        )
                                                    }
                                                    className='text-mutedSand hover:text-burntAmber transition duration-200'
                                                    aria-label={`Remove ${item.title || "item"} from cart`}>
                                                    <XIcon className='w-6 h-6' />
                                                </button>
                                            </div>
                                        </motion.article>
                                    ))}
                                </AnimatePresence>
                            </section>

                            <motion.div
                                initial='hidden'
                                animate='visible'
                                variants={fadeIn}
                                className='bg-deepGray rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4'>
                                <p className='font-author text-warmBeige text-lg sm:text-xl md:text-2xl'>
                                    Total:{" "}
                                    <span className='text-burntAmber'>
                                        ${total.toFixed(2)}
                                    </span>
                                </p>
                                <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto'>
                                    <button
                                        onClick={clearCart}
                                        className='font-author font-bold text-sm md:text-base bg-mutedSand text-charcoalBlack py-2 px-4 rounded-lg hover:bg-deepCopper hover:text-darkMutedTeal transition duration-200 w-full sm:w-auto'>
                                        Clear Cart
                                    </button>
                                    <Link
                                        href='/checkout'
                                        className='font-author font-bold text-sm md:text-base bg-burntAmber text-darkMutedTeal py-2 px-4 rounded-lg hover:bg-deepCopper transition duration-200 w-full sm:w-auto text-center inline-block'>
                                        Proceed to Checkout
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}

export default dynamic(() => Promise.resolve(CartPage), { ssr: false })
