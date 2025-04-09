"use client"

import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { getOrders } from "@/lib/api"
import { ShoppingBag } from "lucide-react"
import Image from "next/image"

export default function Orders() {
    const { token, loading } = useAuth()
    const [orders, setOrders] = useState([])
    const [fetchError, setFetchError] = useState<string | null>(null)

    useEffect(() => {
        if (token) {
            const fetchOrders = async () => {
                try {
                    const data = await getOrders(token)
                    setOrders(data)
                    setFetchError(null)
                } catch (error) {
                    setFetchError("Failed to load orders. Please try again.")
                }
            }
            fetchOrders()
        }
    }, [token])

    if (loading) {
        return (
            <div className='text-mutedSand text-center py-4'>
                Loading orders...
            </div>
        )
    }

    if (!token) {
        return (
            <div className='text-mutedSand text-center py-4'>
                Please log in to view your orders.
            </div>
        )
    }

    return (
        <div className='w-full max-w-4xl mx-auto bg-deepGray p-4 sm:p-6 rounded-lg shadow-lg'>
            <h2 className='text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center text-warmBeige'>
                Your Orders
            </h2>
            {fetchError && (
                <p className='text-deepCopper mb-4 text-center sm:text-left'>
                    {fetchError}
                </p>
            )}
            {orders.length === 0 ? (
                <p className='text-mutedSand text-center py-4'>
                    You have no orders yet.
                </p>
            ) : (
                <div className='space-y-4 sm:space-y-6'>
                    {orders.map((order) => (
                        <div
                            key={order.orderId}
                            className='bg-slightlyLightGrey p-3 sm:p-4 rounded-lg'>
                            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4'>
                                <ShoppingBag
                                    size={20}
                                    className='text-burntAmber mx-auto sm:mx-0'
                                />
                                <div className='text-center sm:text-left'>
                                    <p className='text-warmBeige font-semibold text-sm sm:text-base'>
                                        Order #{order.orderId}
                                    </p>
                                    <p className='text-mutedSand text-xs sm:text-sm'>
                                        Placed on{" "}
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className='space-y-3'>
                                {order.items.map((item) => (
                                    <div
                                        key={item.bookId._id}
                                        className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4'>
                                        <Image
                                            src={
                                                item.bookId.urlPath ||
                                                "/placeholder.svg"
                                            }
                                            alt={item.bookId.title}
                                            width={50}
                                            height={75}
                                            className='rounded-lg object-cover w-[50px] h-[75px] sm:w-[60px] sm:h-[90px]'
                                        />
                                        <div className='flex-1 text-center sm:text-left'>
                                            <p className='text-warmBeige font-semibold text-sm sm:text-base'>
                                                {item.bookId.title}
                                            </p>
                                            <p className='text-mutedSand text-xs sm:text-sm'>
                                                Qty: {item.quantity} | $
                                                {item.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className='text-warmBeige font-bold mt-3 sm:mt-4 text-sm sm:text-base text-center sm:text-right'>
                                Total: ${order.total.toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
