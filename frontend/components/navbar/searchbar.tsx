"use client"

import { Search, X } from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"
import Image from "next/image"
import { bookService } from "@/lib/api"
import { motion, AnimatePresence, easeInOut, useReducedMotion } from "framer-motion"

interface Book {
    slug: string
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
    const [isLoading, setIsLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)
    const suggestionsRef = useRef<HTMLUListElement>(null)
    const prefersReducedMotion = useReducedMotion()
    
    // Move displayedSuggestions declaration up here
    const displayedSuggestions = suggestions.slice(0, 4)
    
    // Move callback functions before they're used
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
            router.push(`/book/${book.slug}`)
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
        inputRef.current?.focus()
    }, [])

    const handleBlur = useCallback(() => {
        // Delay to allow click events on suggestions
        setTimeout(() => setIsFocused(false), 200)
    }, [])

    const fetchSuggestions = useCallback(async () => {
        if (!debouncedQuery.trim()) {
            setSuggestions([])
            return
        }
        
        setIsLoading(true)
        try {
            const response = await bookService.search(debouncedQuery)
            setSuggestions(
                response.data.map((item: { 
                    slug: string;
                    title: string;
                    author: { name: string };
                    price: number;
                    urlPath: string;
                }) => ({
                    slug: item.slug,
                    title: item.title,
                    author: item.author.name,
                    price: item.price,
                    urlPath: item.urlPath,
                }))
            )
        } catch (error) {
            setSuggestions([])
            console.error("Search error:", error)
        } finally {
            setIsLoading(false)
        }
    }, [debouncedQuery])

    useEffect(() => {
        fetchSuggestions()
    }, [fetchSuggestions])

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isFocused || displayedSuggestions.length === 0) return

            // Arrow down
            if (e.key === "ArrowDown") {
                e.preventDefault()
                setSelectedIndex(prev => 
                    prev < displayedSuggestions.length + (suggestions.length > 4 ? 0 : -1) 
                        ? prev + 1 
                        : 0
                )
            }
            // Arrow up
            else if (e.key === "ArrowUp") {
                e.preventDefault()
                setSelectedIndex(prev => 
                    prev > 0 
                        ? prev - 1 
                        : displayedSuggestions.length + (suggestions.length > 4 ? 0 : -1)
                )
            }
            // Enter key
            else if (e.key === "Enter" && selectedIndex >= 0) {
                e.preventDefault()
                if (selectedIndex < displayedSuggestions.length) {
                    handleSuggestionClick(displayedSuggestions[selectedIndex])
                } else {
                    handleViewMore()
                }
            }
            // Escape key
            else if (e.key === "Escape") {
                inputRef.current?.blur()
                setIsFocused(false)
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [isFocused, displayedSuggestions, selectedIndex, suggestions.length, handleSuggestionClick, handleViewMore])

    // Reset selected index when suggestions change
    useEffect(() => {
        setSelectedIndex(-1)
    }, [suggestions])

    // Simplified animation variants if user prefers reduced motion
    const getAnimationVariants = () => {
        if (prefersReducedMotion) {
            return {
                searchBarVariants: {
                    initial: { scale: 1 },
                    focused: { scale: 1 },
                },
                searchIconVariants: {
                    initial: { opacity: 0.7 },
                    focused: { opacity: 1 },
                },
                resetButtonVariants: {
                    initial: { opacity: 0 },
                    focused: { opacity: 1 },
                    exit: { opacity: 0 },
                },
                dropdownVariants: {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                    exit: { opacity: 0 },
                },
                suggestionVariants: {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                }
            }
        }

        return {
            searchBarVariants: {
                initial: {
                    scale: 1,
                    y: 0,
                    transition: { duration: 0.3, ease: "easeInOut" },
                },
                focused: {
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeInOut" },
                },
            },
            searchIconVariants: {
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
            },
            resetButtonVariants: {
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
            },
            dropdownVariants: {
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
            },
            suggestionVariants: {
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 },
            }
        }
    }

    const {
        searchBarVariants,
        searchIconVariants,
        resetButtonVariants,
        dropdownVariants,
        suggestionVariants
    } = getAnimationVariants()

    return (
        <div className='relative w-full max-w-[600px] px-2 sm:px-4'>
            <motion.form
                onSubmit={handleSearch}
                variants={searchBarVariants}
                initial='initial'
                animate={isFocused ? "focused" : "initial"}
                role="search"
                aria-label="Search for books">
                <motion.div
                    variants={searchIconVariants}
                    initial='initial'
                    animate={isFocused ? "focused" : "initial"}
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-mutedSand sm:left-8'>
                    <Search
                        className='h-4 w-4 sm:h-6 sm:w-6'
                        aria-hidden='true'
                    />
                </motion.div>
                <motion.input
                    ref={inputRef}
                    type='text'
                    placeholder='Search books...'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleBlur}
                    className='w-full rounded-lg border border-[#3A2E2B] bg-[#2E2E2E] py-2 pl-10 pr-10 text-sm text-[#EAE0D5] placeholder-[#BFB6A8] transition duration-200 focus:border-[#D68C45] focus:outline-none focus:ring-1 focus:ring-[#D68C45] sm:py-3 sm:pl-12 sm:pr-12 sm:text-base font-generalSans'
                    aria-label='Search books'
                    aria-expanded={isFocused && displayedSuggestions.length > 0}
                    aria-autocomplete="list"
                    aria-controls={displayedSuggestions.length > 0 ? "search-suggestions" : undefined}
                    aria-activedescendant={selectedIndex >= 0 && selectedIndex < displayedSuggestions.length ? `suggestion-${displayedSuggestions[selectedIndex].slug}` : undefined}
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
            
            {/* Status for screen readers */}
            <div className="sr-only" aria-live="polite">
                {isLoading ? "Loading search results" : 
                 (isFocused && debouncedQuery.trim() && displayedSuggestions.length === 0) ? 
                 "No results found" : 
                 (displayedSuggestions.length > 0) ? 
                 `${displayedSuggestions.length} books found` : ""}
            </div>
            
            <AnimatePresence>
                {isFocused &&
                    debouncedQuery.trim() &&
                    !isLoading &&
                    displayedSuggestions.length === 0 && (
                        <motion.div
                            className='absolute z-50 mt-2 w-full max-w-[570px] rounded-lg bg-deepGray shadow-lg px-3 py-2 text-center text-sm text-warmBeige sm:px-4 sm:py-3 sm:text-base font-generalSans'
                            variants={dropdownVariants}
                            initial='hidden'
                            animate='visible'
                            exit='exit'
                            role="status">
                            No results found
                        </motion.div>
                    )}
                {isFocused && displayedSuggestions.length > 0 && (
                    <motion.ul
                        id="search-suggestions"
                        ref={suggestionsRef}
                        className='absolute z-50 mt-2 w-full max-w-[570px] max-h-80 overflow-auto rounded-lg bg-deepGray shadow-lg hide-scrollbar'
                        role='listbox'
                        aria-label="Search suggestions"
                        variants={dropdownVariants}
                        initial='hidden'
                        animate='visible'
                        exit='exit'>
                        {displayedSuggestions.map((book, index) => (
                            <motion.li
                                key={book.slug}
                                id={`suggestion-${book.slug}`}
                                onMouseDown={() => handleSuggestionClick(book)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`flex cursor-pointer rounded-lg items-center px-3 py-2 text-warmBeige hover:bg-burntAmber hover:text-darkMutedTeal sm:px-4 sm:py-3 ${
                                    selectedIndex === index ? 'bg-burntAmber text-darkMutedTeal' : ''
                                }`}
                                role='option'
                                aria-selected={selectedIndex === index}
                                variants={suggestionVariants}>
                                <div className='relative mr-2 h-12 w-8 flex-shrink-0 sm:mr-3 sm:h-16 sm:w-10'>
                                    <Image
                                        src={
                                            book.urlPath ||
                                            "/images/placeholder.png"
                                        }
                                        alt=""
                                        fill
                                        sizes='(max-width: 640px) 32px, 40px'
                                        className='rounded object-cover'
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
                                id="view-more-option"
                                onMouseDown={handleViewMore}
                                onMouseEnter={() => setSelectedIndex(displayedSuggestions.length)}
                                className={`cursor-pointer px-3 py-2 text-sm text-center text-warmBeige hover:bg-burntAmber hover:text-darkMutedTeal sm:px-4 sm:py-3 sm:text-base font-generalSans ${
                                    selectedIndex === displayedSuggestions.length ? 'bg-burntAmber text-darkMutedTeal' : ''
                                }`}
                                role='option'
                                aria-selected={selectedIndex === displayedSuggestions.length}
                                variants={suggestionVariants}>
                                View More Results
                            </motion.li>
                        )}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}
