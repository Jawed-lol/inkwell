import { useId } from "react"

interface AuthorFilterProps {
    authorSearch: string
    onChange: (search: string) => void
    label?: string
}

export default function AuthorFilter({
    authorSearch,
    onChange,
    label = "Author"
}: AuthorFilterProps) {
    const authorFilterId = useId()
    
    return (
        <div className="mb-4">
            <label 
                htmlFor={authorFilterId} 
                className="text-mutedSand text-sm mb-2 font-generalSans leading-4 block">
                {label}
            </label>
            <input
                id={authorFilterId}
                type="text"
                value={authorSearch}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search by author..."
                className="font-generalSans bg-slightlyLightGrey border border-darkMocha rounded-[4px] py-2 px-2.5 w-full max-w-[280px] h-9 placeholder-mutedSand text-mutedSand focus:outline-none focus:ring-2 focus:ring-burntAmber focus:border-burntAmber transition-colors"
                role="searchbox"
                aria-label={`Search by ${label.toLowerCase()}`}
            />
        </div>
    )
}
