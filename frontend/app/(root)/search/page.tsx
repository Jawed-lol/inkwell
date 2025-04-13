// app/(root)/search/page.tsx
import { Suspense } from "react"
import SearchResults from "./SearchResults"

// Define the props type to allow searchParams to be a Promise or direct object
interface SearchPageProps {
    searchParams?:
        | { [key: string]: string | string[] | undefined }
        | Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    // Resolve searchParams if it's a Promise
    const resolvedSearchParams = await (searchParams ?? { q: "" })
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
