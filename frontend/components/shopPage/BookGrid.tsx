import BookCard from "@/components/shopPage/BookCard"
import { Book } from "@/types/book"

interface BookGridProps {
    books: Book[]
}

export default function BookGrid({ books }: BookGridProps) {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {books.map((book, index) => (
                <BookCard
                    key={index}
                    book={book}
                />
            ))}
        </div>
    )
}
