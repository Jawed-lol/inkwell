"use client"

import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { orderService } from "@/lib/api"
import { ShoppingBag } from "lucide-react"
import Image from "next/image"
import { Book } from "@/types/book"
import Link from "next/link"

// TypeScript interfaces
interface OrderItem {
    bookSlug: string
    book: Book | null
    quantity: number
    price: number
    _id: string
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

    useEffect(() => {
        if (!token) return

        const fetchOrders = async () => {
            setIsLoading(true)
            try {
                const response = await orderService.get(token)
                if (!response.success) {
                    throw new Error(response.message || "Failed to fetch orders")
                }
                setOrders(response.orders || [])
                console.log(response.orders)
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
                aria-busy="true"
                aria-labelledby="orders-heading-loading"
                className="text-mutedSand text-center py-8">
                <h1 id="orders-heading-loading" className="text-xl font-bold mb-4">Order History</h1>
                <div role="status" className="animate-pulse">
                    <p>Loading your orders...</p>
                    <span className="sr-only">Loading...</span>
                </div>
            </section>
        )
    }

    // Not logged in state
    if (!token) {
        return (
            <section 
                aria-labelledby="orders-heading-login"
                className="text-mutedSand text-center py-8">
                <h1 id="orders-heading-login" className="text-xl font-bold mb-4">Order History</h1>
                <p>Please <Link href="/login" className="text-burntAmber hover:underline focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-2 focus:ring-offset-deepBlue rounded">log in</Link> to view your order history.</p>
            </section>
        )
    }

    // Render order history
    return (
        <section
            aria-labelledby="orders-heading"
            className="w-full max-w-4xl mx-auto bg-deepGray p-4 sm:p-6 rounded-lg shadow-lg">
            <h1
                id="orders-heading"
                className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center text-warmBeige">
                Your Order History
            </h1>

            {error && (
                <div
                    role="alert"
                    className="text-deepCopper mb-4 text-center sm:text-left p-4 bg-red-50 rounded">
                    {error}
                </div>
            )}

            {orders.length === 0 && !error ? (
                <div className="text-mutedSand text-center py-4">
                    <p>You haven&apos;t placed any orders yet.</p>
                    <Link 
                        href="/shop" 
                        className="inline-block mt-3 bg-burntAmber text-darkMutedTeal px-4 py-2 rounded-lg hover:bg-deepCopper transition-colors focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-2 focus:ring-offset-deepGray">
                        Start shopping
                    </Link>
                </div>
            ) : (
                <ul className="space-y-4 sm:space-y-6" aria-label="Order list">
                    {orders.map((order) => (
                        <li
                            key={order._id}
                            className="bg-slightlyLightGrey p-3 sm:p-4 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <ShoppingBag
                                    size={20}
                                    className="text-burntAmber mx-auto sm:mx-0"
                                    aria-hidden="true"
                                />
                                <div className="text-center sm:text-left">
                                    <h2 className="text-warmBeige font-semibold text-sm sm:text-base">
                                        Order #{order.orderId}
                                    </h2>
                                    <time
                                        dateTime={new Date(
                                            order.createdAt
                                        ).toISOString()}
                                        className="text-mutedSand text-xs sm:text-sm">
                                        Placed on{" "}
                                        {formatDate(order.createdAt)}
                                    </time>
                                </div>
                            </div>

                            <ul className="space-y-3" aria-label={`Items in order #${order.orderId}`}>
                                {order.items.map((item, index) => {
                                    const bookTitle =
                                        item.book?.title || "Unknown book"
                                    const bookAuthor = 
                                        typeof item.book?.author === 'object' 
                                            ? item.book.author.name 
                                            : item.book?.author || "Unknown author"
                                    const bookImage =
                                        item.book?.urlPath ||
                                        "/images/placeholder.jpg"
                                    const bookSlug = item.book?.slug || item.bookSlug
                                    
                                    return (
                                        <li
                                            key={`${order._id}-item-${index}`}
                                            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                                            {bookSlug ? (
                                                <Link href={`/book/${bookSlug}`} className="focus:outline-none focus:ring-2 focus:ring-burntAmber rounded">
                                                    <Image
                                                        src={bookImage}
                                                        alt={`Cover for ${bookTitle} by ${bookAuthor}`}
                                                        width={50}
                                                        height={75}
                                                        className="rounded-lg object-cover w-[50px] h-[75px] sm:w-[60px] sm:h-[90px]"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.currentTarget.src =
                                                                "/images/placeholder.jpg"
                                                        }}
                                                    />
                                                </Link>
                                            ) : (
                                                <Image
                                                    src={bookImage}
                                                    alt={`Cover for ${bookTitle} by ${bookAuthor}`}
                                                    width={50}
                                                    height={75}
                                                    className="rounded-lg object-cover w-[50px] h-[75px] sm:w-[60px] sm:h-[90px]"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            "/images/placeholder.jpg"
                                                    }}
                                                />
                                            )}
                                            <div className="flex-1 text-center sm:text-left">
                                                {bookSlug ? (
                                                    <h3 className="text-warmBeige font-semibold text-sm sm:text-base">
                                                        <Link 
                                                            href={`/book/${bookSlug}`}
                                                            className="hover:underline focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-1 focus:ring-offset-slightlyLightGrey rounded">
                                                            {bookTitle}
                                                        </Link>
                                                    </h3>
                                                ) : (
                                                    <h3 className="text-warmBeige font-semibold text-sm sm:text-base">
                                                        {bookTitle}
                                                    </h3>
                                                )}
                                                <p className="text-mutedSand text-xs sm:text-sm">
                                                    {bookAuthor}
                                                </p>
                                                <p className="text-mutedSand text-xs sm:text-sm">
                                                    <span aria-label="Quantity">
                                                        {item.quantity} {item.quantity === 1 ? 'copy' : 'copies'}
                                                    </span> | 
                                                    <span aria-label="Price per item">
                                                        ${item.price.toFixed(2)}
                                                    </span>
                                                </p>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>

                            <div className="text-warmBeige font-bold mt-3 sm:mt-4 text-sm sm:text-base text-center sm:text-right">
                                <span id={`order-total-${order._id}`}>Order total: ${order.total.toFixed(2)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
