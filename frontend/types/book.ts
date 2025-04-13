export interface Review {
    user_id: string
    rating: number
    comment?: string
    created_at: string
}

export interface Book {
    slug: string
    title: string
    author: string
    description: string
    genre: string
    price: number
    urlPath: string
    pages_number: number
    publication_year: number
    synopsis: string
    publisher: string
    language: string
    isbn: string
    author_bio?: string
    reviews_number: number
    reviews: Review[]
}
