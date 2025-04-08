export interface Book {
    _id: string
    title: string
    author: string
    description: string
    page_count: number
    publication_year: number
    genre: string
    price: number
    urlPath: string
    synopsis?: string
    publisher?: string
    language?: string
    isbn?: string
    author_bio?: string
    reviews_number: number
    reviews: {
        user_id: string
        rating: number
        comment?: string
        created_at: string
    }[]
}
