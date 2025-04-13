import { Suspense } from "react"
import SearchResults from "./SearchResults"
interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
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
