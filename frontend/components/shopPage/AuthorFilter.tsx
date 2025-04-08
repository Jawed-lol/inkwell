interface AuthorFilterProps {
    authorSearch: string
    onChange: (search: string) => void
}

export default function AuthorFilter({
    authorSearch,
    onChange,
}: AuthorFilterProps) {
    return (
        <div className='mb-4'>
            <h3 className='text-mutedSand text-sm mb-2 font-generalSans leading-4'>
                Author
            </h3>
            <input
                type='text'
                value={authorSearch}
                onChange={(e) => onChange(e.target.value)}
                placeholder='Search by author...'
                className='font-generalSans bg-slightlyLightGrey border border-darkMocha rounded-[4px] py-2 px-2.5 w-full max-w-[280px] h-9 placeholder-mutedSand text-mutedSand'
                aria-label='Search by author'
            />
        </div>
    )
}
