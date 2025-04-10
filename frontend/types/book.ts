export interface Review {
    user_id: string
    rating: number
    comment?: string
    created_at: string
}

export interface Book {
    _id: string
    title: string
    author: string
    description: string
    genre: string
    price: number
    urlPath: string
    pages_number: number
    publication_year: number | undefined
    author_bio?: string
    publisher?: string
    language?: string
    isbn?: string
    rating?: number
    reviews_number?: number
    reviews?: Review[]
}
