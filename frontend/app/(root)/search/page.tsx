// app/(root)/search/page.tsx
import { Suspense } from "react"
import SearchResults from "./SearchResults"

// Define props with searchParams as a Promise
interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Use async to resolve searchParams Promise
export default async function SearchPage({ searchParams }: SearchPageProps) {
    // Resolve the searchParams Promise
    const resolvedSearchParams = await searchParams
    const query =
        (typeof resolvedSearchParams.q === "string"
            ? resolvedSearchParams.q
            : "") || ""

    return (
        <Suspense
            fallback={
                <div className='text-warmBeige'>Loading search results...</div>
            }>
            <SearchResults query={query} />
        </Suspense>
    )
}
