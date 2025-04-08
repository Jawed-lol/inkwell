// RatingFilter.tsx
interface RatingFilterProps {
    minRating: number
    onChange: (rating: number) => void
}

export default function RatingFilter({
    minRating,
    onChange,
}: RatingFilterProps) {
    const stars = [1, 2, 3, 4, 5]

    return (
        <div className='mb-4'>
            <h3 className='text-mutedSand text-sm mb-2 font-generalSans'>
                Minimum Rating
            </h3>
            <div className='flex'>
                {stars.map((star) => (
                    <button
                        key={star}
                        onClick={() => onChange(star)}
                        className={`text-2xl mr-2 ${
                            star <= minRating
                                ? "text-burntAmber"
                                : "text-mutedSand"
                        } hover:text-burntAmber focus:outline-none`}
                        aria-label={`Set minimum rating to ${star} stars`}>
                        ★
                    </button>
                ))}
            </div>
        </div>
    )
}
