import { Suspense } from "react"
import SearchResults from "./SearchResults"

interface SearchPageProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q || ""
    return (
        <Suspense
            fallback={
                <div className='text-warmBeige'>Loading search results...</div>
            }>
            <SearchResults query={typeof query === "string" ? query : ""} />
        </Suspense>
    )
}
