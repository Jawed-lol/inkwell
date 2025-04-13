import { Suspense } from "react"
import SearchResults from "./SearchResult"

export default function SearchPage({
    searchParams,
}: {
    searchParams: { q?: string }
}) {
    return (
        <Suspense
            fallback={
                <div className='text-warmBeige'>Loading search results...</div>
            }>
            <SearchResults query={searchParams.q || ""} />
        </Suspense>
    )
}
