"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Head from "next/head"
import HeroSectionProduct from "@/components/productPage/HeroSection"
import ReviewProduct from "@/components/productPage/ReviewProduct"
import BookDetailsSectionProduct from "@/components/productPage/BookDetailsSection"
import RelatedBook from "@/components/productPage/RelatedBook"
import { fetchBookById, fetchBooks } from "@/lib/api"

interface BookReview {
    user_id: string
    rating: number
    comment?: string
    created_at: string
}

interface BookApiResponse {
    _id: string
    title: string
    author: string
    description: string
    genre: string
    price: number
    urlPath: string
    page_count?: number
    pages_number?: number
    publication_year?: number
    release_year?: number
    author_bio?: string
    publisher?: string
    language?: string
    isbn?: string
    reviews: BookReview[]
}

interface RawBookData {
    _id?: string
    title?: string
    author?: string
    description?: string
    genre?: string
    price?: number
    urlPath?: string
    page_count?: number
    pages_number?: number
    publication_year?: number
    release_year?: number
    author_bio?: string
    publisher?: string
    language?: string
    isbn?: string
    reviews?: BookReview[]
}

export default function BookPage() {
    const params = useParams()
    const bookId = params.id as string

    const [book, setBook] = useState<BookApiResponse | null>(null)
    const [relatedBooks, setRelatedBooks] = useState<BookApiResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const handleAddToCart = () => {
        console.log("Added to cart:", book?.title)
    }

    useEffect(() => {
        const getBookDetails = async () => {
            if (!bookId) return

            try {
                setLoading(true)
                setError("")

                const bookData = await fetchBookById(bookId)
                const rawBook = bookData.data as RawBookData

                const processedBook: BookApiResponse = {
                    _id: bookId,
                    title: rawBook.title || "",
                    author: rawBook.author || "",
                    description: rawBook.description || "",
                    genre: rawBook.genre || "",
                    price: rawBook.price || 0,
                    urlPath: rawBook.urlPath || "",
                    pages_number:
                        rawBook.pages_number || rawBook.page_count || 0,
                    release_year:
                        rawBook.release_year || rawBook.publication_year || 0,
                    author_bio: rawBook.author_bio || "",
                    publisher: rawBook.publisher || "",
                    language: rawBook.language || "",
                    isbn: rawBook.isbn || "",
                    reviews: rawBook.reviews || [],
                }

                // Fixed setter usage by directly providing the value
                setBook(processedBook)

                const allBooks = await fetchBooks()
                const rawRelatedBooks = allBooks.data as RawBookData[]

                const filteredRelatedBooks: BookApiResponse[] = rawRelatedBooks
                    .filter(
                        (b) =>
                            b._id !== bookId && b.genre === processedBook.genre
                    )
                    .slice(0, 4)
                    .map((rawBook) => ({
                        _id: rawBook._id || "",
                        title: rawBook.title || "",
                        author: rawBook.author || "",
                        description: rawBook.description || "",
                        genre: rawBook.genre || "",
                        price: rawBook.price || 0,
                        urlPath: rawBook.urlPath || "",
                        pages_number:
                            rawBook.pages_number || rawBook.page_count || 0,
                        release_year:
                            rawBook.release_year ||
                            rawBook.publication_year ||
                            0,
                        reviews: rawBook.reviews || [],
                    }))

                // Fixed setter usage
                setRelatedBooks(filteredRelatedBooks)
            } catch (err) {
                console.error("Failed to load book details:", err)
                setError("Failed to load book details. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        getBookDetails()
    }, [bookId])

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }

    const avgRating = useMemo(() => {
        if (!book || !book.reviews || book.reviews.length === 0) return 0

        return (
            book.reviews.reduce((sum, r) => sum + r.rating, 0) /
            book.reviews.length
        )
    }, [book])

    const bookDetails = useMemo(() => {
        if (!book) return null

        return {
            synopsis: book.description,
            aboutAuthor:
                book.author_bio ||
                "Information about the author not available.",
            publisher: book.publisher || "Unknown publisher",
            language: book.language || "English",
            pages_number: book.pages_number || 0,
            isbn: book.isbn || "Not available",
        }
    }, [book])

    const seoDescription = useMemo(() => {
        if (!book) return ""

        return `${book.title} by ${book.author}: ${book.description.slice(0, 140)}... Find this ${book.genre} book at Inkwell Bookstore. Free shipping on orders over $35.`
    }, [book])

    if (loading) {
        return (
            <div className='bg-charcoalBlack min-h-screen flex items-center justify-center'>
                <div
                    role='status'
                    className='text-center'>
                    <div className='animate-pulse h-8 w-32 bg-warmBeige/20 rounded mb-4 mx-auto'></div>
                    <p className='text-warmBeige'>Loading book details...</p>
                </div>
            </div>
        )
    }

    if (error || !book) {
        return (
            <div className='bg-charcoalBlack min-h-screen flex items-center justify-center'>
                <div className='text-center p-6 max-w-lg'>
                    <h2 className='text-warmBeige text-xl mb-4'>
                        Unable to load book
                    </h2>
                    <p className='text-warmBeige'>
                        {error || "Book not found"}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{`${book.title} by ${book.author} | Inkwell Bookstore`}</title>
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
                    content={seoDescription}
                />

                <script type='application/ld+json'>
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Book",
                        name: book.title,
                        author: {
                            "@type": "Person",
                            name: book.author,
                        },
                        isbn: book.isbn,
                        numberOfPages: book.pages_number,
                        publisher: book.publisher,
                        inLanguage: book.language || "English",
                        genre: book.genre,
                        datePublished: book.release_year?.toString(),
                        aggregateRating:
                            book.reviews.length > 0
                                ? {
                                      "@type": "AggregateRating",
                                      ratingValue: avgRating.toFixed(1),
                                      reviewCount: book.reviews.length,
                                  }
                                : undefined,
                        offers: {
                            "@type": "Offer",
                            price: book.price.toString(),
                            priceCurrency: "USD",
                            availability: "https://schema.org/InStock",
                        },
                    })}
                </script>

                <meta
                    name='keywords'
                    content={`${book.title}, ${book.author}, ${book.genre}, books, bookstore, literature, fiction, best sellers, ${book.release_year}`}
                />

                <meta
                    property='og:title'
                    content={`${book.title} by ${book.author} | Inkwell Bookstore`}
                />
                <meta
                    property='og:description'
                    content={seoDescription}
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
                    property='og:site_name'
                    content='Inkwell Bookstore'
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
                    name='twitter:site'
                    content='@inkwellbooks'
                />
                <meta
                    name='twitter:title'
                    content={`${book.title} by ${book.author}`}
                />
                <meta
                    name='twitter:description'
                    content={book.description.slice(0, 190)}
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
            </Head>

            <main className='bg-charcoalBlack min-h-screen'>
                <HeroSectionProduct
                    _id={book._id}
                    title={book.title}
                    author={book.author}
                    reviews_number={book.reviews.length}
                    description={book.description}
                    pages_number={book.pages_number || 0}
                    release_year={book.release_year || 0}
                    genre={book.genre}
                    price={book.price}
                    urlPath={book.urlPath}
                    rating={avgRating}
                    onAddToCart={handleAddToCart}
                />

                {bookDetails && <BookDetailsSectionProduct {...bookDetails} />}

                <motion.section
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className='bg-charcoalBlack py-16'
                    aria-labelledby='reviews-heading'>
                    <div className='container mx-auto px-4'>
                        <h2
                            id='reviews-heading'
                            className='font-author text-warmBeige text-3xl mb-8'>
                            Reader Reviews
                        </h2>
                        {book.reviews && book.reviews.length > 0 ? (
                            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {book.reviews.map((review) => (
                                    <ReviewProduct
                                        key={`${review.user_id}-${review.created_at}`}
                                        id={parseInt(review.user_id) || 0}
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
                        className='bg-deepGray py-16'
                        aria-labelledby='related-books-heading'>
                        <div className='container mx-auto px-4'>
                            <h2
                                id='related-books-heading'
                                className='font-author text-warmBeige text-3xl mb-8'>
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
