// GenreFilter.tsx
interface GenreFilterProps {
    selectedGenres: string[]
    onChange: (genres: string[]) => void
}

export default function GenreFilter({
    selectedGenres,
    onChange,
}: GenreFilterProps) {
    const genres = ["Fiction", "Non-Fiction", "Mystery", "Sci-Fi", "Romance"]

    return (
        <div className='mb-4'>
            <h3 className='text-mutedSand text-sm mb-2 font-generalSans leading-4'>
                Genre
            </h3>
            {genres.map((genre) => (
                <label
                    key={genre}
                    className='flex items-center mb-3 gap-2'>
                    <input
                        type='checkbox'
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
                        className="appearance-none h-4 w-4 border border-darkMocha bg-transparent hover:bg-burntAmber checked:bg-burntAmber checked:border-slightlyLightGrey transition-colors ease-in duration-150 relative after:content-['✓'] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-[10px] after:text-warmBeige after:opacity-0 checked:after:opacity-100"
                        aria-label={`Select ${genre}`}
                    />
                    <span className='text-mutedSand text-[12px] font-generalSans leading-4'>
                        {genre}
                    </span>
                </label>
            ))}
        </div>
    )
}
