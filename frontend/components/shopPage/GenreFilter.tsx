import { useId } from "react"

interface GenreFilterProps {
    selectedGenres: string[]
    onChange: (genres: string[]) => void
    genres?: string[]
}

export default function GenreFilter({
    selectedGenres,
    onChange,
    genres = ["Fiction", "Non-Fiction", "Mystery", "Sci-Fi", "Romance", "Biography", "History", "Fantasy"]
}: GenreFilterProps) {
    const genreHeadingId = useId()
    
    return (
        <fieldset className="mb-4">
            <legend 
                id={genreHeadingId}
                className="text-mutedSand text-sm mb-2 font-generalSans leading-4">
                Genre
            </legend>
            <div 
                className="space-y-3"
                role="group"
                aria-labelledby={genreHeadingId}>
                {genres.map((genre) => {
                    const genreId = `genre-${genre.toLowerCase().replace(/\s+/g, '-')}`
                    return (
                        <div key={genre} className="flex items-center gap-2">
                            <input
                                id={genreId}
                                type="checkbox"
                                checked={selectedGenres.includes(genre)}
                                onChange={() => {
                                    if (selectedGenres.includes(genre)) {
                                        onChange(
                                            selectedGenres.filter((g) => g !== genre)
                                        )
                                    } else {
                                        onChange([...selectedGenres, genre])
                                    }
                                }}
                                className="appearance-none h-4 w-4 border border-darkMocha bg-transparent hover:bg-burntAmber checked:bg-burntAmber checked:border-slightlyLightGrey transition-colors ease-in duration-150 relative after:content-['✓'] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-[10px] after:text-warmBeige after:opacity-0 checked:after:opacity-100 focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-1 focus:ring-offset-deepGray rounded"
                                aria-labelledby={genreId}
                            />
                            <label 
                                id={genreId}
                                htmlFor={genreId} 
                                className="text-mutedSand text-[12px] font-generalSans leading-4 cursor-pointer">
                                {genre}
                            </label>
                        </div>
                    )
                })}
            </div>
        </fieldset>
    )
}
