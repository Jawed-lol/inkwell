export interface BookReview {
    user_id: string
    rating: number
    comment?: string
    created_at: string
}

export interface Author {
    name: string
    _id: string
    bio: string
}

export interface Book {
    _id: string
    slug: string
    title: string
    author: Author
    price: number
    urlPath: string
    synopsis: string
    pages_number: number
    publication_year: number
    genre: string
    publisher: string
    language: string
    isbn: string
    reviews: BookReview[]
    reviews_number: number
    description: string
    stock: number
    rating: number
}
