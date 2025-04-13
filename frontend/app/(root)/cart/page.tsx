"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import { XIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { NextSeo } from "next-seo"
import dynamic from "next/dynamic"

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
        if (item) updateQuantity(bookId, item.quantity + 1)
    }

    const handleDecreaseQuantity = (bookId: string) => {
        const item = cart.find((i) => i.slug === bookId)
        if (item) updateQuantity(bookId, item.quantity - 1)
    }

    const total = cart.reduce(
        (sum, item) => sum + (item.price ?? 0) * item.quantity,
        0
    )

    const itemCount = cart.reduce((count, item) => count + item.quantity, 0)

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }

    const generateStructuredData = () => {
        return {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: cart.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                    "@type": "Product",
                    name: item.title || "Unknown Title",
                    author: item.author || "Unknown Author",
                    offers: {
                        "@type": "Offer",
                        price: item.price,
                        priceCurrency: "USD",
                    },
                },
            })),
        }
    }

    const structuredData = generateStructuredData()

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
            <NextSeo
                title={`Your Shopping Cart (${itemCount} items) | Bookstore Name`}
                description='Review and manage your selected books before checkout. Update quantities or proceed to secure checkout.'
                canonical='https://yourbookstore.com/cart'
                openGraph={{
                    title: `Your Shopping Cart (${itemCount} items) | Bookstore Name`,
                    description:
                        "Review and manage your selected books before checkout.",
                    url: "https://yourbookstore.com/cart",
                    type: "website",
                }}
                noindex={true}
                additionalMetaTags={[
                    {
                        name: "structured-data",
                        content: JSON.stringify(structuredData),
                    },
                ]}
            />

            <main className='pt-[120px] bg-gradient-to-b from-charcoalBlack to-deepGray min-h-screen'>
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
                                                        {item.author ||
                                                            "Unknown Author"}
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
                                                        className='bg-burntAmber text-darkMutedTeal font-generalSans font-bold w-8 h-8 rounded-full hover:bg-deepCopper transition duration-200'
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
