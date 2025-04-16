import { useId } from "react"
import { Star } from "lucide-react"

interface RatingFilterProps {
    minRating: number
    onChange: (rating: number) => void
}

export default function RatingFilter({
    minRating,
    onChange,
}: RatingFilterProps) {
    const stars = [1, 2, 3, 4, 5]
    const ratingHeadingId = useId()
    
    return (
        <div className="mb-4">
            <h3 
                id={ratingHeadingId}
                className="text-mutedSand text-sm mb-2 font-generalSans">
                Minimum Rating
            </h3>
            <div 
                className="flex"
                role="radiogroup"
                aria-labelledby={ratingHeadingId}>
                {stars.map((star) => (
                    <button
                        key={star}
                        onClick={() => onChange(star)}
                        className={`p-1 mr-1 rounded-md flex items-center justify-center ${
                            star <= minRating
                                ? "text-burntAmber"
                                : "text-mutedSand"
                        } hover:text-burntAmber focus:outline-none focus:ring-2 focus:ring-burntAmber`}
                        aria-label={`${star} star${star !== 1 ? 's' : ''} and above`}
                        role="radio"
                        aria-checked={star === minRating}>
                        <Star 
                            size={20} 
                            fill={star <= minRating ? "currentColor" : "none"} 
                            strokeWidth={1.5} 
                        />
                    </button>
                ))}
                <button
                    onClick={() => onChange(0)}
                    className={`p-1 ml-1 rounded-md text-sm ${
                        minRating === 0
                            ? "text-burntAmber"
                            : "text-mutedSand"
                    } hover:text-burntAmber focus:outline-none focus:ring-2 focus:ring-burntAmber`}
                    aria-label="Clear rating filter"
                    aria-pressed={minRating === 0}>
                    Clear
                </button>
            </div>
        </div>
    )
}
