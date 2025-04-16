"use client"

import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Head from "next/head"

type CheckoutError = {
    message: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function CheckoutPage() {
    const { cart, clearCart } = useCart()
    const { token } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const total = cart.reduce(
        (sum, item) => sum + (item.price ?? 0) * item.quantity,
        0
    )

    const handleCheckout = async () => {
        if (!token) {
            router.push("/login")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const orderItems = cart.map(item => ({
                bookSlug: item.slug,
                quantity: item.quantity,
                price: item.price || 0
            }));

            if (orderItems.length === 0) {
                throw new Error("No items in cart");
            }

            const response = await fetch(
                `${API_URL}/api/orders`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ items: orderItems }),
                }
            )

            if (!response.ok) {
                const errorData = (await response.json()) as CheckoutError
                throw new Error(errorData.message || "Failed to place order")
            }

            clearCart()
            router.push("/dashboard?tab=orders")
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to process checkout. Please try again."

            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }

    const generateStructuredData = () => ({
        "@context": "https://schema.org",
        "@type": "Order",
        orderItem: cart.map((item) => ({
            "@type": "Product",
            name: item.title || "Unknown Title",
            offers: {
                "@type": "Offer",
                price: item.price,
                priceCurrency: "USD",
                itemCondition: "https://schema.org/NewCondition",
                availability: "https://schema.org/InStock",
            },
        })),
        priceCurrency: "USD",
        price: total.toFixed(2),
    })

    return (
        <>
            <Head>
                <title>Checkout | Inkwell Bookstore</title>
                <meta name="description" content="Secure checkout for your selected books. Confirm your order and enjoy your new reads." />
                <meta name="robots" content="noindex, follow" />
                <link rel="canonical" href="https://inkwellbookstore.com/checkout" />
                <meta property="og:title" content="Checkout | Inkwell Bookstore" />
                <meta property="og:description" content="Secure checkout for your selected books." />
                <meta property="og:url" content="https://inkwellbookstore.com/checkout" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Checkout | Inkwell Bookstore" />
                <meta name="twitter:description" content="Secure checkout for your selected books." />
            </Head>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ 
                    __html: JSON.stringify(generateStructuredData()) 
                }}
            />

            <main className='pt-[120px] bg-gradient-to-b from-charcoalBlack to-deepGray min-h-screen' aria-label="Checkout Page">
                <div className='max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 py-8'>
                    <motion.h1
                        initial='hidden'
                        animate='visible'
                        variants={fadeIn}
                        className='font-author text-warmBeige text-2xl sm:text-3xl md:text-4xl mb-8 text-center'>
                        Checkout
                    </motion.h1>

                    {cart.length === 0 ? (
                        <motion.p
                            initial='hidden'
                            animate='visible'
                            variants={fadeIn}
                            className='text-mutedSand text-center text-base sm:text-lg'>
                            Your cart is empty.{" "}
                            <a
                                href='/shop'
                                className='text-burntAmber hover:text-deepCopper focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-2 focus:ring-offset-deepGray'>
                                Shop now!
                            </a>
                        </motion.p>
                    ) : (
                        <motion.div
                            initial='hidden'
                            animate='visible'
                            variants={fadeIn}
                            className='space-y-6'>
                            <div className='bg-deepGray rounded-lg p-4'>
                                <h2 className='font-author text-warmBeige text-lg sm:text-xl md:text-2xl mb-4'>
                                    Order Summary
                                </h2>
                                <ul className='space-y-4' aria-label="Order Summary">
                                    {cart.map((item) => (
                                        <li
                                            key={item.slug}
                                            className='flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 border-b border-darkMocha pb-2'>
                                            <span className='text-warmBeige font-generalSans'>
                                                {item.title} ({item.quantity})
                                            </span>
                                            <span className='text-burntAmber font-bold'>
                                                $
                                                {item.price != null
                                                    ? (
                                                          item.price * item.quantity
                                                      ).toFixed(2)
                                                    : "N/A"}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <p className='font-author text-warmBeige text-lg sm:text-xl mt-4'>
                                    Total:{" "}
                                    <span className='text-burntAmber'>
                                        ${total.toFixed(2)}
                                    </span>
                                </p>
                            </div>

                            <div className='flex flex-col sm:flex-row justify-center gap-4'>
                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className='font-author font-bold text-sm md:text-base bg-burntAmber text-darkMutedTeal py-2 px-6 rounded-lg hover:bg-deepCopper transition duration-200 disabled:bg-mutedSand disabled:cursor-not-allowed w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-2 focus:ring-offset-deepGray'>
                                    {loading ? "Processing..." : "Confirm Order"}
                                </button>
                                <a
                                    href='/cart'
                                    className='font-author font-bold text-sm md:text-base bg-mutedSand text-charcoalBlack py-2 px-6 rounded-lg hover:bg-deepCopper hover:text-darkMutedTeal transition duration-200 text-center w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-2 focus:ring-offset-deepGray'>
                                    Back to Cart
                                </a>
                            </div>

                            {error && (
                                <p className='text-deepCopper text-center text-sm sm:text-base'>
                                    {error}
                                </p>
                            )}
                        </motion.div>
                    )}
                </div>
            </main>
        </>
    )
}
