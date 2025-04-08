import GenreFilter from "@/components/shopPage/GenreFilter"
import PriceRangeFilter from "@/components/shopPage/PriceRangeFilter"
import AuthorFilter from "@/components/shopPage/AuthorFilter"
import RatingFilter from "@/components/shopPage/RatingFilter"

interface FiltersSidebarProps {
    selectedGenres: string[]
    onGenreChange: (genres: string[]) => void
    priceRange: [number, number]
    onPriceRangeChange: (range: [number, number]) => void
    authorSearch: string
    onAuthorSearchChange: (search: string) => void
    minRating: number
    onMinRatingChange: (rating: number) => void
}

export default function FiltersSidebar({
    selectedGenres,
    onGenreChange,
    priceRange,
    onPriceRangeChange,
    authorSearch,
    onAuthorSearchChange,
    minRating,
    onMinRatingChange,
}: FiltersSidebarProps) {
    return (
        <div>
            <h2 className='text-warmBeige font-author leading-6 text-lg font-bold mb-4'>
                Filters
            </h2>
            <GenreFilter
                selectedGenres={selectedGenres}
                onChange={onGenreChange}
            />
            <PriceRangeFilter
                priceRange={priceRange}
                onChange={onPriceRangeChange}
            />
            <AuthorFilter
                authorSearch={authorSearch}
                onChange={onAuthorSearchChange}
            />
            <RatingFilter
                minRating={minRating}
                onChange={onMinRatingChange}
            />
        </div>
    )
}
