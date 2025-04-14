"use client"

import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

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
            // Format cart items according to what the backend expects
            const orderItems = cart.map(item => ({
                bookSlug: item.slug, // Backend expects 'bookSlug', not 'slug'
                quantity: item.quantity,
                price: item.price || 0
            }));

            if (orderItems.length === 0) {
                throw new Error("No items in cart");
            }

            const response = await fetch(
                API_URL+"/api/orders",
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

    return (
        <div className='pt-[120px] bg-gradient-to-b from-charcoalBlack to-deepGray min-h-screen'>
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
                            className='text-burntAmber hover:text-deepCopper'>
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
                            <ul className='space-y-4'>
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
                                className='font-author font-bold text-sm md:text-base bg-burntAmber text-darkMutedTeal py-2 px-6 rounded-lg hover:bg-deepCopper transition duration-200 disabled:bg-mutedSand disabled:cursor-not-allowed w-full sm:w-auto'>
                                {loading ? "Processing..." : "Confirm Order"}
                            </button>
                            <a
                                href='/cart'
                                className='font-author font-bold text-sm md:text-base bg-mutedSand text-charcoalBlack py-2 px-6 rounded-lg hover:bg-deepCopper hover:text-darkMutedTeal transition duration-200 text-center w-full sm:w-auto'>
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
        </div>
    )
}
