"use client"

import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { getOrders } from "@/lib/api"
import { ShoppingBag } from "lucide-react"
import Image from "next/image"
import Head from "next/head"

// TypeScript interfaces for better type safety
interface Book {
    _id: string
    title: string
    urlPath: string
}

interface OrderItem {
    bookId: Book
    quantity: number
    price: number
}

interface Order {
    _id: string
    orderId: string
    items: OrderItem[]
    total: number
    createdAt: string
}

export default function Orders() {
    const { token, loading: authLoading } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const pageTitle = "Your Order History | Book Store"
    const pageDescription =
        "View and track all your book orders in one place. Check order status, items purchased, and order details."

    useEffect(() => {
        // Only fetch orders if user is authenticated
        if (!token) return

        const fetchOrders = async () => {
            setIsLoading(true)
            try {
                const response = await getOrders(token)

                // Handle both array response and object with data property
                if (Array.isArray(response)) {
                    setOrders(response)
                } else if (response && typeof response === "object") {
                    setOrders(response.data || [])
                } else {
                    throw new Error("Invalid response format")
                }

                setError(null)
            } catch (error) {
                console.error("Error fetching orders:", error)
                setOrders([])
                setError(
                    "Failed to load your order history. Please try again later."
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrders()
    }, [token])

    // Format date in a more readable way
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    // Loading state
    if (authLoading || isLoading) {
        return (
            <section
                aria-busy='true'
                className='text-mutedSand text-center py-8'>
                <h1 className='text-xl font-bold mb-4'>Order History</h1>
                <p>Loading your orders...</p>
            </section>
        )
    }

    // Unauthenticated state
    if (!token) {
        return (
            <section className='text-mutedSand text-center py-8'>
                <h1 className='text-xl font-bold mb-4'>Order History</h1>
                <p>Please log in to view your order history.</p>
            </section>
        )
    }

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta
                    name='description'
                    content={pageDescription}
                />
                <meta
                    property='og:title'
                    content={pageTitle}
                />
                <meta
                    property='og:description'
                    content={pageDescription}
                />
                <meta
                    property='og:type'
                    content='website'
                />
                <meta
                    name='twitter:card'
                    content='summary'
                />
                <meta
                    name='twitter:title'
                    content={pageTitle}
                />
                <meta
                    name='twitter:description'
                    content={pageDescription}
                />
            </Head>

            <section
                aria-labelledby='orders-heading'
                className='w-full max-w-4xl mx-auto bg-deepGray p-4 sm:p-6 rounded-lg shadow-lg'>
                <h1
                    id='orders-heading'
                    className='text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center text-warmBeige'>
                    Your Order History
                </h1>

                {error && (
                    <div
                        role='alert'
                        className='text-deepCopper mb-4 text-center sm:text-left p-4 bg-red-50 rounded'>
                        {error}
                    </div>
                )}

                {orders.length === 0 && !error ? (
                    <p className='text-mutedSand text-center py-4'>
                        You haven&lsquo;t placed any orders yet. Start shopping
                        to see your orders here!
                    </p>
                ) : (
                    <ul className='space-y-4 sm:space-y-6'>
                        {orders.map((order) => (
                            <li
                                key={order._id}
                                className='bg-slightlyLightGrey p-3 sm:p-4 rounded-lg'>
                                <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4'>
                                    <ShoppingBag
                                        size={20}
                                        className='text-burntAmber mx-auto sm:mx-0'
                                        aria-hidden='true'
                                    />
                                    <div className='text-center sm:text-left'>
                                        <h2 className='text-warmBeige font-semibold text-sm sm:text-base'>
                                            Order #{order.orderId}
                                        </h2>
                                        <time
                                            dateTime={new Date(
                                                order.createdAt
                                            ).toISOString()}
                                            className='text-mutedSand text-xs sm:text-sm'>
                                            Placed on{" "}
                                            {formatDate(order.createdAt)}
                                        </time>
                                    </div>
                                </div>

                                <ul className='space-y-3'>
                                    {order.items.map((item, index) => {
                                        const bookTitle =
                                            item.bookId?.title || "Unknown book"
                                        const bookImage =
                                            item.bookId?.urlPath ||
                                            "/placeholder.svg"

                                        return (
                                            <li
                                                key={`${order._id}-item-${index}`}
                                                className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4'>
                                                <Image
                                                    src={bookImage}
                                                    alt={`Cover for ${bookTitle}`}
                                                    width={50}
                                                    height={75}
                                                    className='rounded-lg object-cover w-[50px] h-[75px] sm:w-[60px] sm:h-[90px]'
                                                    loading='lazy'
                                                />
                                                <div className='flex-1 text-center sm:text-left'>
                                                    <h3 className='text-warmBeige font-semibold text-sm sm:text-base'>
                                                        {bookTitle}
                                                    </h3>
                                                    <p className='text-mutedSand text-xs sm:text-sm'>
                                                        <span className='sr-only'>
                                                            Quantity:
                                                        </span>{" "}
                                                        {item.quantity} |
                                                        <span className='sr-only'>
                                                            Price:
                                                        </span>{" "}
                                                        ${item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>

                                <p className='text-warmBeige font-bold mt-3 sm:mt-4 text-sm sm:text-base text-center sm:text-right'>
                                    <span className='sr-only'>
                                        Order total:
                                    </span>{" "}
                                    ${order.total.toFixed(2)}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </>
    )
}
