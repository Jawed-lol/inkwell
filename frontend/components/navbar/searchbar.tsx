"use client"

import { Search, X } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"
import Image from "next/image"
import { fetchBooksBySearch } from "@/lib/api"
import { motion, AnimatePresence, easeInOut } from "framer-motion"

interface Book {
    _id: string
    title: string
    author: string
    price: number
    urlPath: string
}

export default function Searchbar() {
    const [query, setQuery] = useState("")
    const [suggestions, setSuggestions] = useState<Book[]>([])
    const [isFocused, setIsFocused] = useState(false)
    const [debouncedQuery] = useDebounce(query, 300)
    const router = useRouter()

    const fetchSuggestions = useCallback(async () => {
        if (!debouncedQuery.trim()) {
            setSuggestions([])
            return
        }
        try {
            const { data } = await fetchBooksBySearch(debouncedQuery)
            setSuggestions(
                data.map((item: Book) => ({
                    _id: item._id,
                    title: item.title,
                    author: item.author,
                    price: item.price,
                    urlPath: item.urlPath,
                }))
            )
        } catch {
            setSuggestions([])
        }
    }, [debouncedQuery])

    useEffect(() => {
        fetchSuggestions()
    }, [fetchSuggestions])

    const handleSearch = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault()
            if (!query.trim()) return
            router.push(`/search?q=${encodeURIComponent(query)}`)
            setQuery("")
            setIsFocused(false)
        },
        [query, router]
    )

    const handleSuggestionClick = useCallback(
        (book: Book) => {
            setQuery("")
            setIsFocused(false)
            router.push(`/book/${book._id}`)
        },
        [router]
    )

    const handleViewMore = useCallback(() => {
        if (!query.trim()) return
        setQuery("")
        setIsFocused(false)
        router.push(`/search?q=${encodeURIComponent(query)}`)
    }, [query, router])

    const handleClear = useCallback(() => {
        setQuery("")
    }, [])

    const displayedSuggestions = suggestions.slice(0, 4)

    // Framer Motion variants for the search bar
    const searchBarVariants = {
        initial: {
            scale: 1,
            y: 0,
            transition: { duration: 0.3, ease: "easeInOut" },
        },
        focused: {
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeInOut" },
        },
    }

    // Framer Motion variants for the search icon
    const searchIconVariants = {
        initial: {
            opacity: 0.7,
            scale: 0.9,
            transition: { duration: 0.3, ease: easeInOut },
        },
        focused: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, ease: easeInOut },
        },
    }

    // Framer Motion variants for the reset button
    const resetButtonVariants = {
        initial: { opacity: 0, scale: 0.9 },
        focused: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, ease: "easeInOut" },
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.3, ease: "easeInOut" },
        },
    }

    // Framer Motion variants for the suggestions dropdown
    const dropdownVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.2,
                ease: "easeOut",
                staggerChildren: 0.05,
            },
        },
        exit: { opacity: 0, y: 10, transition: { duration: 0.15 } },
    }

    // Variants for individual suggestion items
    const suggestionVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 },
    }

    return (
        <div className='relative w-full max-w-[600px] px-2 sm:px-4'>
            <motion.form
                onSubmit={handleSearch}
                variants={searchBarVariants}
                initial='initial'
                animate={isFocused ? "focused" : "initial"}>
                <motion.div
                    variants={searchIconVariants}
                    initial='initial'
                    animate={isFocused ? "focused" : "initial"}
                    className='absolute left-4 top-1/4 -translate-y-1/2 text-mutedSand sm:left-5'>
                    <Search
                        className='h-4 w-4 sm:h-6 sm:w-6'
                        aria-hidden='true'
                    />
                </motion.div>
                <motion.input
                    type='text'
                    placeholder='Search books...'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    className='w-full rounded-lg border border-[#3A2E2B] bg-[#2E2E2E] py-2 pl-10 pr-10 text-sm text-[#EAE0D5] placeholder-[#BFB6A8] transition duration-200 focus:border-[#D68C45] focus:outline-none focus:ring-1 focus:ring-[#D68C45] sm:py-3 sm:pl-12 sm:pr-12 sm:text-base font-generalSans'
                    aria-label='Search books'
                    animate={{
                        boxShadow: isFocused
                            ? "0 0 8px rgba(214, 140, 69, 0.3)"
                            : "none",
                    }}
                />
                <AnimatePresence>
                    {query && (
                        <motion.button
                            type='button'
                            onClick={handleClear}
                            variants={resetButtonVariants}
                            initial='initial'
                            animate={isFocused ? "focused" : "initial"}
                            exit='exit'
                            className='absolute right-3 top-[30%] -translate-y-1/2 text-mutedSand hover:text-burntAmber sm:right-4'
                            aria-label='Clear search'>
                            <X className='h-4 w-4 sm:h-5 sm:w-5' />
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.form>
            <AnimatePresence>
                {isFocused &&
                    debouncedQuery.trim() &&
                    displayedSuggestions.length === 0 && (
                        <motion.div
                            className='absolute z-50 mt-2 w-full max-w-[570px] rounded-lg bg-deepGray shadow-lg px-3 py-2 text-center text-sm text-warmBeige sm:px-4 sm:py-3 sm:text-base font-generalSans'
                            variants={dropdownVariants}
                            initial='hidden'
                            animate='visible'
                            exit='exit'>
                            No results found
                        </motion.div>
                    )}
                {isFocused && displayedSuggestions.length > 0 && (
                    <motion.ul
                        className='absolute z-50 mt-2 w-full max-w-[570px] max-h-80 overflow-auto rounded-lg bg-deepGray shadow-lg hide-scrollbar'
                        role='listbox'
                        variants={dropdownVariants}
                        initial='hidden'
                        animate='visible'
                        exit='exit'>
                        {displayedSuggestions.map((book) => (
                            <motion.li
                                key={book._id}
                                onMouseDown={() => handleSuggestionClick(book)}
                                className='flex cursor-pointer rounded-lg items-center px-3 py-2 text-warmBeige hover:bg-burntAmber hover:text-darkMutedTeal sm:px-4 sm:py-3'
                                role='option'
                                aria-selected='false'
                                variants={suggestionVariants}>
                                <div className='relative mr-2 h-12 w-8 flex-shrink-0 sm:mr-3 sm:h-16 sm:w-10'>
                                    <Image
                                        src={
                                            book.urlPath ||
                                            "/images/placeholder.png"
                                        }
                                        alt={`${book.title} cover`}
                                        fill
                                        sizes='(max-width: 640px) 32px, 40px'
                                        className='rounded object-cover'
                                        priority={false}
                                    />
                                </div>
                                <div className='min-w-0 flex-1'>
                                    <p className='truncate text-sm sm:text-base font-author'>
                                        {book.title}
                                    </p>
                                    <p className='truncate text-xs sm:text-sm text-mutedSand font-generalSans'>
                                        by {book.author}
                                    </p>
                                </div>
                            </motion.li>
                        ))}
                        {suggestions.length > 4 && (
                            <motion.li
                                onMouseDown={handleViewMore}
                                className='cursor-pointer px-3 py-2 text-sm text-center text-warmBeige hover:bg-burntAmber hover:text-darkMutedTeal sm:px-4 sm:py-3 sm:text-base font-generalSans'
                                role='option'
                                aria-selected='false'
                                variants={suggestionVariants}>
                                View More
                            </motion.li>
                        )}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}
