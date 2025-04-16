import BookCard from "@/components/shopPage/BookCard"
import { Book } from "@/types/book"
import { Fragment } from "react"

interface BookGridProps {
    books: Book[]
    title?: string
}

export default function BookGrid({ books, title }: BookGridProps) {
    const gridId = `book-grid-${Math.random().toString(36).substring(2, 9)}`
    
    return (
        <Fragment>
            {title && (
                <h2 id={`${gridId}-heading`} className="text-2xl font-author text-warmBeige mb-6">
                    {title}
                </h2>
            )}
            <div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                role="feed"
                aria-labelledby={title ? `${gridId}-heading` : undefined}
                aria-label={!title ? "Book collection" : undefined}>
                {books.length > 0 ? (
                    books.map((book) => (
                        <BookCard
                            key={book._id || book.slug || `book-${book.title}`}
                            book={book}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-mutedSand py-8">
                        No books available at the moment.
                    </p>
                )}
            </div>
        </Fragment>
    )
}
