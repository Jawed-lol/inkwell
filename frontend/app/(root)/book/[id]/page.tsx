"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Head from "next/head"
import HeroSectionProduct from "@/components/productPage/HeroSection"
import ReviewProduct from "@/components/productPage/ReviewProduct"
import BookDetailsSectionProduct from "@/components/productPage/BookDetailsSection"
import RelatedBook from "@/components/productPage/RelatedBook"
import { fetchBookById, fetchBooks } from "@/lib/api"
import { Book } from "@/types/book"
import { useCart } from "@/context/CartContext"

export default function BookPage() {
    const params = useParams()
    const bookId = params.id as string
    const { addToCart } = useCart()

    const [book, setBook] = useState<Book | null>(null)
    const [relatedBooks, setRelatedBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const getBookDetails = async () => {
            try {
                setLoading(true)
                const bookData = await fetchBookById(bookId)
                const book = bookData.data
                setBook(book)

                const allBooks = await fetchBooks()
                const filteredRelatedBooks = allBooks.data
                    .filter(
                        (b: Book) => b._id !== bookId && b.genre === book.genre
                    )
                    .slice(0, 4)
                setRelatedBooks(filteredRelatedBooks)
            } catch (err) {
                console.error("Failed to load book details:", err)
                setError("Failed to load book details. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        if (bookId) getBookDetails()
    }, [bookId])

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }

    if (loading) {
        return (
            <div className='bg-charcoalBlack min-h-screen flex items-center justify-center'>
                <p className='text-warmBeige'>Loading book details...</p>
            </div>
        )
    }

    if (error || !book) {
        return (
            <div className='bg-charcoalBlack min-h-screen flex items-center justify-center'>
                <p className='text-warmBeige'>{error || "Book not found"}</p>
            </div>
        )
    }

    const bookDetails = {
        synopsis: book.description,
        aboutAuthor:
            book.author_bio || "Information about the author not available.",
        publisher: book.publisher || "Unknown publisher",
        language: book.language || "English",
        pages_number: book.page_count,
        isbn: book.isbn || "Not available",
    }

    const avgRating =
        book.reviews && book.reviews.length > 0
            ? book.reviews.reduce((sum, r) => sum + r.rating, 0) /
              book.reviews.length
            : 0

    const handleAddToCart = () => {
        addToCart(book)
        alert(`${book.title} added to cart!`)
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
                    content={`${book.description.slice(0, 150)}... Buy ${book.title} by ${book.author} at Inkwell Bookstore.`}
                />
                <meta
                    name='keywords'
                    content={`${book.title}, ${book.author}, ${book.genre}, bookstore, books, reading, literature`}
                />
                <meta
                    name='author'
                    content={book.author}
                />
                <meta
                    property='og:title'
                    content={`${book.title} by ${book.author} - Inkwell Bookstore`}
                />
                <meta
                    property='og:description'
                    content={`${book.description.slice(0, 150)}... Buy ${book.title} by ${book.author} at Inkwell Bookstore.`}
                />
                <meta
                    property='og:type'
                    content='product'
                />
                <meta
                    property='og:url'
                    content={`https://www.inkwellbookstore.com/book/${bookId}`}
                />
                <meta
                    property='og:image'
                    content={book.urlPath}
                />
                <meta
                    property='og:price:amount'
                    content={book.price.toString()}
                />
                <meta
                    property='og:price:currency'
                    content='USD'
                />
                <meta
                    name='twitter:card'
                    content='summary_large_image'
                />
                <meta
                    name='twitter:title'
                    content={`${book.title} by ${book.author}`}
                />
                <meta
                    name='twitter:description'
                    content={`${book.description.slice(0, 150)}...`}
                />
                <meta
                    name='twitter:image'
                    content={book.urlPath}
                />
                <link
                    rel='canonical'
                    href={`https://www.inkwellbookstore.com/book/${bookId}`}
                />
                <link
                    rel='icon'
                    href='/favicon.ico'
                />
                <title>{`${book.title} by ${book.author} - Inkwell Bookstore`}</title>
            </Head>

            <main className='bg-charcoalBlack min-h-screen'>
                <HeroSectionProduct
                    _id={book._id}
                    title={book.title}
                    author={book.author}
                    reviews_number={book.reviews?.length || 0}
                    description={book.description}
                    pages_number={book.page_count}
                    release_year={book.publication_year}
                    genre={book.genre}
                    price={book.price}
                    urlPath={book.urlPath}
                    rating={avgRating}
                    onAddToCart={handleAddToCart}
                />
                <BookDetailsSectionProduct {...bookDetails} />
                <motion.section
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className='bg-charcoalBlack py-16'>
                    <div className='container mx-auto px-4'>
                        <h2 className='font-author text-warmBeige text-3xl mb-8'>
                            Reader Reviews
                        </h2>
                        {book.reviews && book.reviews.length > 0 ? (
                            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {book.reviews.map((review) => (
                                    <ReviewProduct
                                        key={
                                            review._id ||
                                            `${review.user_id}-${review.created_at}`
                                        }
                                        id={review._id || 0}
                                        author={review.user_id}
                                        rating={review.rating}
                                        text={review.comment || ""}
                                        date={new Date(
                                            review.created_at
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                        })}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className='text-warmBeige'>
                                No reviews yet. Be the first to leave a review!
                            </p>
                        )}
                    </div>
                </motion.section>
                {relatedBooks.length > 0 && (
                    <motion.section
                        initial='hidden'
                        whileInView='visible'
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className='bg-deepGray py-16'>
                        <div className='container mx-auto px-4'>
                            <h2 className='font-author text-warmBeige text-3xl mb-8'>
                                You May Also Like
                            </h2>
                            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                                {relatedBooks.map((relatedBook) => (
                                    <RelatedBook
                                        key={relatedBook._id}
                                        id={relatedBook._id}
                                        title={relatedBook.title}
                                        author={relatedBook.author}
                                        coverPath={relatedBook.urlPath}
                                        rating={
                                            relatedBook.reviews &&
                                            relatedBook.reviews.length > 0
                                                ? relatedBook.reviews.reduce(
                                                      (sum, r) =>
                                                          sum + r.rating,
                                                      0
                                                  ) / relatedBook.reviews.length
                                                : 0
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.section>
                )}
            </main>
        </>
    )
}
