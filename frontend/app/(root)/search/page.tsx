// app/(root)/search/page.tsx
import { Suspense } from "react"
import SearchResults from "./SearchResults"
import type { NextPage } from "next"

// Define props using NextPage to align with Next.js's PageProps
type SearchPageProps = NextPage<{
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}>

// Use async to resolve searchParams Promise
const SearchPage: NextPage<SearchPageProps> = async ({ searchParams }) => {
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

export default SearchPage
