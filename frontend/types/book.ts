// types/book.ts
export interface Book {
    _id: string // Add this
    title: string
    author: string
    reviews_number?: number
    description: string
    pages_number: number
    release_year: number
    genre: string
    price: number
    urlPath: string
    rating?: number
}
