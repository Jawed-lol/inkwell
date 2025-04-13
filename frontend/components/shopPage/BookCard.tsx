import { motion } from "framer-motion"
import { Book } from "@/types/book"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/CartContext"

interface BookCardProps {
    book: Book
}

export default function BookCard({ book }: BookCardProps) {
    const { addToCart } = useCart()

    const handleAddToCart = () => {
        addToCart(book)
        alert(`${book.title} added to cart!`)
    }

    return (
        <Link
            href={`/book/${book.slug}`}
            passHref>
            <motion.div
                className='bg-deepGray rounded-lg overflow-hidden cursor-pointer'
                whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
                }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}>
                <Image
                    src={book.urlPath}
                    alt={book.title}
                    width={300}
                    height={200}
                    className='w-full h-48 object-cover rounded-t-lg'
                    crossOrigin='anonymous'
                />
                <div className='p-4'>
                    <h3 className='text-sm md:text-[16px] lg:text-lg leading-4 md:leading-5 lg:leading-6 font-author font-bold text-warmBeige text-center mb-2'>
                        {book.title}
                    </h3>
                    <p className='font-generalSans text-[10px] md:text-[12px] lg:text-sm leading-3 md:leading-4 lg:leading-5 text-mutedSand text-center mb-1'>
                        {book.author}
                    </p>
                    <p className='font-generalSans font-bold text-[12px] md:text-sm lg:text-[16px] leading-4 md:leading-5 lg:leading-6 text-burntAmber text-center mb-3'>
                        ${book.price.toFixed(2)}
                    </p>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            handleAddToCart()
                        }}
                        className='font-author font-bold text-[10px] md:text-[12px] lg:text-sm leading-3 md:leading-4 lg:leading-5 bg-burntAmber hover:bg-deepCopper rounded-[8px] py-1 px-2 md:py-1.5 md:px-3 lg:py-2 lg:px-4 w-full text-darkMutedTeal'
                        aria-label={`Add ${book.title} to cart`}>
                        Add to Cart
                    </button>
                </div>
            </motion.div>
        </Link>
    )
}
