import GenreFilter from "@/components/shopPage/GenreFilter"
import PriceRangeFilter from "@/components/shopPage/PriceRangeFilter"
import AuthorFilter from "@/components/shopPage/AuthorFilter"
import RatingFilter from "@/components/shopPage/RatingFilter"
import { useId } from "react"

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
    const filtersHeadingId = useId()
    
    return (
        <aside 
            className="bg-deepGray p-4 rounded-lg"
            aria-labelledby={filtersHeadingId}>
            <h2 
                id={filtersHeadingId}
                className="text-warmBeige font-author leading-6 text-lg font-bold mb-4">
                Filters
            </h2>
            <div role="group" aria-label="Genre filters">
                <GenreFilter
                    selectedGenres={selectedGenres}
                    onChange={onGenreChange}
                />
            </div>
            <div role="group" aria-label="Price range filter">
                <PriceRangeFilter
                    priceRange={priceRange}
                    onChange={onPriceRangeChange}
                />
            </div>
            <div role="group" aria-label="Author filter">
                <AuthorFilter
                    authorSearch={authorSearch}
                    onChange={onAuthorSearchChange}
                />
            </div>
            <div role="group" aria-label="Rating filter">
                <RatingFilter
                    minRating={minRating}
                    onChange={onMinRatingChange}
                />
            </div>
        </aside>
    )
}
