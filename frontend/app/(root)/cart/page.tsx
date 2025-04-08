"use client"

import { motion, AnimatePresence } from "framer-motion"
import Head from "next/head"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import { XIcon } from "lucide-react"

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart()

    const handleIncreaseQuantity = (bookId: string) => {
        const item = cart.find((i) => i._id === bookId)
        if (item) {
            updateQuantity(bookId, item.quantity + 1)
        }
    }

    const handleDecreaseQuantity = (bookId: string) => {
        const item = cart.find((i) => i._id === bookId)
        if (item) {
            updateQuantity(bookId, item.quantity - 1)
        }
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }

    return (
        <>
            <Head>
                <meta charSet='UTF-8' />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <meta
                    name='robots'
                    content='index, follow'
                />
                <meta
                    name='description'
                    content='View and manage your shopping cart at Inkwell Bookstore.'
                />
                <meta
                    name='keywords'
                    content='cart, bookstore, books, shopping'
                />
                <meta
                    name='author'
                    content='Inkwell Bookstore'
                />
                <meta
                    property='og:title'
                    content='Inkwell Bookstore - Cart'
                />
                <meta
                    property='og:description'
                    content='View and manage your shopping cart at Inkwell Bookstore.'
                />
                <meta
                    property='og:type'
                    content='website'
                />
                <meta
                    property='og:url'
                    content='https://www.inkwellbookstore.com/cart'
                />
                <meta
                    property='og:image'
                    content='/images/hero-book-cover-1.jpg'
                />
                <meta
                    name='twitter:card'
                    content='summary_large_image'
                />
                <meta
                    name='twitter:title'
                    content='Inkwell Bookstore - Cart'
                />
                <meta
                    name='twitter:description'
                    content='View and manage your shopping cart at Inkwell Bookstore.'
                />
                <meta
                    name='twitter:image'
                    content='/images/hero-book-cover-1.jpg'
                />
                <link
                    rel='canonical'
                    href='https://www.inkwellbookstore.com/cart'
                />
                <link
                    rel='icon'
                    href='/favicon.ico'
                />
                <title>Inkwell Bookstore - Cart</title>
            </Head>

            <div className='pt-[120px] bg-gradient-to-b from-charcoalBlack to-deepGray min-h-screen'>
                <div className='max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 py-8'>
                    <motion.h1
                        initial='hidden'
                        animate='visible'
                        variants={fadeIn}
                        className='font-author text-warmBeige text-3xl md:text-4xl mb-8 text-center'>
                        Your Cart
                    </motion.h1>

                    {cart.length === 0 ? (
                        <motion.p
                            initial='hidden'
                            animate='visible'
                            variants={fadeIn}
                            className='text-mutedSand text-center text-lg'>
                            Your cart is empty.{" "}
                            <a
                                href='/shop'
                                className='text-burntAmber hover:text-deepCopper'>
                                Start shopping!
                            </a>
                        </motion.p>
                    ) : (
                        <div className='space-y-6'>
                            {/* Cart Items */}
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className='bg-deepGray rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4'>
                                        <div className='flex items-center gap-4'>
                                            <Image
                                                src={item.urlPath}
                                                alt={item.title}
                                                width={100}
                                                height={150}
                                                className='rounded-lg object-cover'
                                                crossOrigin='anonymous'
                                            />
                                            <div>
                                                <h2 className='font-author font-bold text-warmBeige text-lg md:text-xl'>
                                                    {item.title}
                                                </h2>
                                                <p className='font-generalSans text-mutedSand text-sm md:text-base'>
                                                    {item.author}
                                                </p>
                                                <p className='font-generalSans text-burntAmber font-bold text-sm md:text-base'>
                                                    ${item.price.toFixed(2)}
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
                                                aria-label={`Remove ${item.title} from cart`}>
                                                <XIcon className='w-6 h-6' />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Total and Actions */}
                            <motion.div
                                initial='hidden'
                                animate='visible'
                                variants={fadeIn}
                                className='bg-deepGray rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4'>
                                <p className='font-author text-warmBeige text-xl md:text-2xl'>
                                    Total:{" "}
                                    <span className='text-burntAmber'>
                                        ${total.toFixed(2)}
                                    </span>
                                </p>
                                <div className='flex gap-4'>
                                    <button
                                        onClick={clearCart}
                                        className='font-author font-bold text-sm md:text-base bg-mutedSand text-charcoalBlack py-2 px-4 rounded-[8px] hover:bg-deepCopper hover:text-darkMutedTeal transition duration-200'>
                                        Clear Cart
                                    </button>
                                    <button className='font-author font-bold text-sm md:text-base bg-burntAmber text-darkMutedTeal py-2 px-4 rounded-[8px] hover:bg-deepCopper transition duration-200'>
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
