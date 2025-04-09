"use client"

import { motion, AnimatePresence } from "framer-motion"
import Head from "next/head"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import { XIcon } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart()

    const handleIncreaseQuantity = (bookId: string) => {
        const item = cart.find((i) => i._id === bookId)
        if (item) updateQuantity(bookId, item.quantity + 1)
    }

    const handleDecreaseQuantity = (bookId: string) => {
        const item = cart.find((i) => i._id === bookId)
        if (item) updateQuantity(bookId, item.quantity - 1)
    }

    const total = cart.reduce(
        (sum, item) => sum + (item.price ?? 0) * item.quantity,
        0
    )

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }

    return (
        <>
            <Head>{/* Unchanged Head content */}</Head>

            <div className='pt-[120px] bg-gradient-to-b from-charcoalBlack to-deepGray min-h-screen'>
                <div className='max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 py-8'>
                    <motion.h1
                        initial='hidden'
                        animate='visible'
                        variants={fadeIn}
                        className='font-author text-warmBeige text-2xl sm:text-3xl md:text-4xl mb-8 text-center'>
                        Your Cart
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
                                Start shopping!
                            </a>
                        </motion.p>
                    ) : (
                        <div className='space-y-6'>
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div
                                        key={item._id}
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
                                                alt={item.title || "Unknown"}
                                                width={100}
                                                height={150}
                                                className='rounded-lg object-cover w-[80px] h-[120px] sm:w-[100px] sm:h-[150px]'
                                                crossOrigin='anonymous'
                                            />
                                            <div className='text-center sm:text-left'>
                                                <h2 className='font-author font-bold text-warmBeige text-lg md:text-xl'>
                                                    {item.title ||
                                                        "Unknown Title"}
                                                </h2>
                                                <p className='font-generalSans text-mutedSand text-sm md:text-base'>
                                                    {item.author ||
                                                        "Unknown Author"}
                                                </p>
                                                <p className='font-generalSans text-burntAmber font-bold text-sm md:text-base'>
                                                    $
                                                    {item.price != null
                                                        ? item.price.toFixed(2)
                                                        : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-4'>
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    onClick={() =>
                                                        handleDecreaseQuantity(
                                                            item._id
                                                        )
                                                    }
                                                    className='bg-burntAmber text-darkMutedTeal font-generalSans font-bold w-8 h-8 rounded-full hover:bg-deepCopper transition duration-200'>
                                                    -
                                                </button>
                                                <span className='font-generalSans text-warmBeige text-lg'>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleIncreaseQuantity(
                                                            item._id
                                                        )
                                                    }
                                                    className='bg-burntAmber text-darkMutedTeal font-generalSans font-bold w-8 h-8 rounded-full hover:bg-deepCopper transition duration-200'>
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    removeFromCart(item._id)
                                                }
                                                className='text-mutedSand hover:text-burntAmber transition duration-200'
                                                aria-label={`Remove ${item.title || "item"} from cart`}>
                                                <XIcon className='w-6 h-6' />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

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
                                    <Link href='/checkout'>
                                        <button className='font-author font-bold text-sm md:text-base bg-burntAmber text-darkMutedTeal py-2 px-4 rounded-lg hover:bg-deepCopper transition duration-200 w-full sm:w-auto'>
                                            Proceed to Checkout
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
