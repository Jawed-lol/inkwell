export interface Book {
    _id: string
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

    author_bio?: string
    publisher?: string
    language?: string
    isbn?: string
    page_count?: number
    publication_year?: number
    reviews: Array<{
        user_id: string
        rating: number
        comment?: string
        created_at: string
    }>
}
