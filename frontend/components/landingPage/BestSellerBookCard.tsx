"use client"

import Image from "next/image"
import starIcon from "@/public/icons/star-icon.svg"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { Book } from "@/types/book"

type BestSellerBookCardProps = Book;

const BestSellerBookCard = ({
    _id,
    slug,
    title,
    author,
    price,
    urlPath,
    synopsis,
    pages_number,
    publication_year,
    genre,
    publisher,
    language,
    isbn,
    reviews,
    reviews_number,
    description,
    stock,
    rating,
}: BestSellerBookCardProps) => {
    const router = useRouter()
    const { addToCart } = useCart()

    const handleCardClick = () => {
        router.push(`/book/${slug}`)
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation()
        const book = {
            _id,
            slug,
            title,
            author,
            price,
            urlPath,
            synopsis,
            pages_number,
            publication_year,
            genre,
            publisher,
            language,
            isbn,
            reviews,
            reviews_number,
            description,
            stock,
            rating, 
        }
        addToCart(book)
    }

    // Calculate average rating if available
    const averageRating = reviews && reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : rating?.toFixed(1) || "N/A"

    return (
        <article 
            className="flex w-full bg-[#252525] rounded-xl p-4 md:p-6 lg:p-8 items-start gap-4 hover:scale-[1.03] transition duration-300 ease-in-out shadow-[0px_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_6px_15px_rgba(0,0,0,0.3)] cursor-pointer"
            onClick={handleCardClick}
            aria-label={`${title} by ${author}`}
        >
            <div className="w-[35%] flex-shrink-0">
                <Image
                    src={urlPath || "/images/fallback.jpg"}
                    alt={`Cover of ${title} by ${author}`}
                    width={180}
                    height={250}
                    className="w-full h-auto rounded-[8px] object-cover object-center shadow-[0px_4px_12px_rgba(0,0,0,0.3)] hover:scale-[1.03] transition duration-300 ease-in-out"
                    priority={true}
                />
            </div>
            <div className="flex flex-col w-[65%] justify-between">
                <div>
                    <h3 className="font-authorSans text-[#EAE0D5] font-bold text-[16px] md:text-[18px] lg:text-[20px] mb-2 md:mb-3">
                        {title}
                    </h3>
                    <p className="font-generalSans text-[#BFB6A8] text-[14px] md:text-[15px] lg:text-[16px] mb-2 md:mb-3">
                        by {typeof author === 'object' ? author.name : author}
                    </p>
                    <p className="font-generalSans font-semibold text-[#D68C45] text-[16px] md:text-[17px] lg:text-[18px] mb-3 md:mb-3">
                        ${price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1 mb-4 md:mb-5" aria-label={`Rating: ${averageRating} out of 5`}>
                        <Image
                            src={starIcon}
                            alt="Rating star"
                            height={15}
                            width={15}
                            className="h-3 w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 text-[#F4C430]"
                        />
                        <span className="font-generalSans text-[#BFB6A8] text-[14px] md:text-[15px] lg:text-[16px]">
                            {averageRating}
                            {reviews_number > 0 && ` (${reviews_number})`}
                        </span>
                    </div>
                </div>

                <div className="mt-auto">
                    <Button
                        onClick={handleAddToCart}
                        className="bg-[#D68C45] hover:bg-[#B36E30] text-[#252525] font-generalSans font-semibold text-[14px] md:text-[15px] lg:text-[16px] w-full h-[40px] md:h-[45px] lg:h-[50px] rounded-[6px] py-2 px-4 transition duration-300 ease-in-out shadow-[0px_2px_6px_rgba(0,0,0,0.2)] hover:shadow-[0px_4px_10px_rgba(0,0,0,0.3)]"
                        aria-label={`Add ${title} to cart`}
                    >
                        Add to Cart
                    </Button>
                </div>
            </div>
        </article>
    )
}

export default BestSellerBookCard
