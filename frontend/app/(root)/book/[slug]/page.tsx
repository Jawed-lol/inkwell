"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Head from "next/head"
import HeroSectionProduct from "@/components/productPage/HeroSection"
import ReviewProduct, { AddReview } from "@/components/productPage/ReviewProduct"
import BookDetailsSectionProduct from "@/components/productPage/BookDetailsSection"
import RelatedBook from "@/components/productPage/RelatedBook"
import { bookService } from "@/lib/api"
import { useCart } from "@/context/CartContext"
import { Book } from "@/types/book"

export default function BookPage() {
    const params = useParams()
    const bookSlug = params.slug as string 
    const { addToCart } = useCart()

    const [book, setBook] = useState<Book | null>(null)
    const [relatedBooks, setRelatedBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showAllReviews, setShowAllReviews] = useState(false)

    useEffect(() => {
        const getBookDetails = async () => {
            try {
                setLoading(true)
                const bookData = await bookService.fetchBySlug(bookSlug)
                
                const bookWithAuthor = bookData.data as Book;
                
                if (typeof bookWithAuthor.author === 'string') {
                    bookWithAuthor.author = {
                        name: bookWithAuthor.author as unknown as string,
                        _id: (bookWithAuthor as { author_id?: string }).author_id || '',
                        bio: (bookWithAuthor as { author_bio?: string }).author_bio || ''
                    };
                }
                
                setBook(bookWithAuthor)

                const allBooks = await bookService.fetchBooks()
                const filteredRelatedBooks = (allBooks.data as Book[])
                    .filter(
                        (b) =>
                            b.slug !== bookSlug &&
                            b.genre === (bookData.data as Book).genre
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

        if (bookSlug) getBookDetails()
    }, [bookSlug])

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
        synopsis: book.synopsis,
        aboutAuthor: book.author.bio || "Information about the author not available.",
        publisher: book.publisher || "Unknown publisher",
        language: book.language || "English",
        pages_number: book.pages_number,
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

    const handleReviewAdded = async () => {
        try {
            const bookData = await bookService.fetchBySlug(bookSlug)
            
            const bookWithAuthor = bookData.data as Book;
            
            if (typeof bookWithAuthor.author === 'string') {
                bookWithAuthor.author = {
                    name: bookWithAuthor.author as unknown as string,
                    _id: (bookWithAuthor as { author_id?: string }).author_id || '',
                    bio: (bookWithAuthor as { author_bio?: string }).author_bio || ''
                };
            }
            
            setBook(bookWithAuthor)
        } catch (err) {
            console.error("Failed to refresh book details:", err)
        }
    }
    
    // Prepare SEO metadata
    const bookTitle = `${book.title} by ${typeof book.author === 'string' ? book.author : book.author.name}`;
    const bookDescription = book.description.slice(0, 150) + "...";
    const authorName = typeof book.author === 'string' ? book.author : book.author.name;
    const canonicalUrl = `https://v0-inkwell.vercel.app//books/${bookSlug}`;
    const keywords = `${book.title}, ${authorName}, ${book.genre}, bookstore, books, reading, literature`;
    
    return (
        <>
            <Head>
                <meta charSet='UTF-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <meta name='robots' content='index, follow' />
                <meta name='description' content={`${bookDescription} Buy ${book.title} by ${authorName} at Inkwell Bookstore.`} />
                <meta name='keywords' content={keywords} />
                <meta name='author' content={authorName} />
                
                {/* Open Graph tags for social sharing */}
                <meta property='og:title' content={`${bookTitle} - Inkwell Bookstore`} />
                <meta property='og:description' content={`${bookDescription} Buy ${book.title} by ${authorName} at Inkwell Bookstore.`} />
                <meta property='og:type' content='product' />
                <meta property='og:url' content={canonicalUrl} />
                <meta property='og:image' content={book.urlPath} />
                <meta property='og:price:amount' content={book.price.toString()} />
                <meta property='og:price:currency' content='USD' />
                
                {/* Twitter Card tags */}
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:title' content={bookTitle} />
                <meta name='twitter:description' content={bookDescription} />
                <meta name='twitter:image' content={book.urlPath} />
                
                {/* Canonical URL to prevent duplicate content issues */}
                <link rel='canonical' href={canonicalUrl} />
                <link rel='icon' href='/favicon.ico' />
                
                {/* Structured data for rich snippets */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Book",
                        "name": book.title,
                        "author": {
                            "@type": "Person",
                            "name": authorName
                        },
                        "isbn": book.isbn,
                        "numberOfPages": book.pages_number,
                        "publisher": book.publisher,
                        "inLanguage": book.language,
                        "genre": book.genre,
                        "description": book.description,
                        "image": book.urlPath,
                        "offers": {
                            "@type": "Offer",
                            "price": book.price,
                            "priceCurrency": "USD",
                            "availability": book.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                        },
                        "aggregateRating": book.reviews && book.reviews.length > 0 ? {
                            "@type": "AggregateRating",
                            "ratingValue": avgRating.toFixed(1),
                            "reviewCount": book.reviews.length
                        } : undefined
                    })}
                </script>
                
                <title>{`${bookTitle} - Inkwell Bookstore`}</title>
            </Head>

            <main className='bg-charcoalBlack min-h-screen'>
                <HeroSectionProduct
                    slug={book.slug}
                    title={book.title}
                    author={book.author.name}
                    reviews_number={book.reviews?.length || 0}
                    description={book.description}
                    pages_number={book.pages_number}
                    release_year={book.publication_year}
                    genre={book.genre}
                    price={book.price}
                    urlPath={book.urlPath}
                    rating={avgRating}
                    stock={book.stock}
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
                        
                        <div className="mb-12">
                            <AddReview 
                                productId={book._id} 
                                onReviewAdded={handleReviewAdded} 
                            />
                        </div>
                        
                        {book.reviews && book.reviews.length > 0 ? (
                            <>
                                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                    {(showAllReviews ? book.reviews : book.reviews.slice(0, 6)).map((review) => (
                                        <ReviewProduct
                                            key={review._id}
                                            id={review._id}
                                            user={review.userName || "User"}
                                            rating={review.rating}
                                            text={review.comment || ""}
                                            date={new Date(
                                                review.created_at
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                        />
                                    ))}
                                </div>
                                
                                {!showAllReviews && book.reviews.length > 6 && (
                                    <div className="mt-8 text-center">
                                        <button 
                                            onClick={() => setShowAllReviews(true)}
                                            className="font-author bg-burntAmber text-darkMutedTeal px-4 py-2 rounded-lg hover:bg-deepCopper transition-colors duration-200"
                                            aria-label="Show more reviews"
                                        >
                                            See More Reviews ({book.reviews.length - 6} more)
                                        </button>
                                    </div>
                                )}
                            </>
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
                                        key={relatedBook.slug}
                                        id={relatedBook.slug}
                                        title={relatedBook.title}
                                        author={relatedBook.author.name}
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
