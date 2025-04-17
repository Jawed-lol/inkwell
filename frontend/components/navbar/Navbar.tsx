"use client"

import { Image } from "@imagekit/next"  
import { Button } from "@/components/ui/button"
import { MenuIcon, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import Searchbar from "@/components/navbar/searchbar"
import { useState, useEffect, useRef } from "react"
import Drawer from "@/components/navbar/Drawer"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Store", href: "/shop" },
    { label: "About", href: "/about" },
]

const Navbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const { cart } = useCart()
    const { user, logout, loading } = useAuth()
    const dropdownRef = useRef<HTMLDivElement>(null)
    const userButtonRef = useRef<HTMLButtonElement>(null)
    const prefersReducedMotion = useReducedMotion()

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                userButtonRef.current &&
                !userButtonRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // Close dropdown with escape key
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsDropdownOpen(false)
            }
        }

        if (isDropdownOpen) {
            document.addEventListener("keydown", handleEscKey)
        }
        
        return () => {
            document.removeEventListener("keydown", handleEscKey)
        }
    }, [isDropdownOpen])

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    }

    const cartItemCount = cart.length
    const cartLabel = `Cart with ${cartItemCount} ${cartItemCount === 1 ? 'item' : 'items'}`

    if (loading) {
        return (
            <nav className='bg-charcoalBlack w-full fixed top-0 left-0 right-0 z-40 border-b border-darkMocha shadow-md' aria-label='Main Navigation'>
                <div className='container mx-auto py-4 px-6 lg:px-8'>
                    <span className="sr-only">Loading navigation</span>
                </div>
            </nav>
        )
    }

    return (
        <>
            <nav
                className='bg-charcoalBlack text-warmBeige w-full fixed top-0 z-40 border-b border-darkMocha shadow-md flex justify-center items-center'
                aria-label='Main Navigation'>
                <div className='container flex items-center justify-between py-4 px-6 lg:px-8 gap-4 lg:gap-6'>
                    {/* Left Section: Logo & Navigation */}
                    <div className='flex items-center gap-4 md:gap-8'>
                        <Link
                            href='/'
                            className='flex items-center'
                            aria-label='Inkwell Home'>
                            <Image
                                urlEndpoint="https://ik.imagekit.io/25fqnetuz"
                                src='/Inkwell/weblogo.png'
                                alt='Inkwell Logo'
                                width={90}
                                height={90}
                                className='hover:scale-105 transition-transform duration-200'
                                priority
                            />
                        </Link>
                        <div className='hidden md:flex items-center gap-6 text-base font-generalSans font-medium' role="navigation" aria-label="Main menu">
                            {navigationLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className='hover:text-burntAmber active:text-deepCopper transition-colors duration-200 focus:outline-none focus:underline focus:text-burntAmber'>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Center Section: Search Bar */}
                    <div className='hidden md:flex flex-1 justify-center'>
                        <Searchbar />
                    </div>

                    {/* Right Section: Actions */}
                    <div className='flex items-center gap-4 lg:gap-6'>
                        <Link
                            href='/cart'
                            className='relative'
                            aria-label={cartLabel}>
                            <Button
                                variant='link'
                                className='p-0 text-mutedSand hover:text-burntAmber focus:outline-none focus:text-burntAmber'
                                aria-hidden="true">
                                <ShoppingCart className='w-6 h-6' />
                                {cartItemCount > 0 && (
                                    <span className='absolute -top-1 -right-1 bg-burntAmber text-darkMutedTeal text-xs rounded-full w-4 h-4 flex items-center justify-center' aria-hidden="true">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        <div className='relative hidden md:block'>
                            {user ? (
                                <>
                                    <Button
                                        ref={userButtonRef}
                                        variant='link'
                                        className='p-0 text-mutedSand hover:text-burntAmber focus:outline-none focus:text-burntAmber'
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        aria-expanded={isDropdownOpen}
                                        aria-controls="user-dropdown"
                                        aria-label='User menu'>
                                        <User className='w-6 h-6' />
                                    </Button>
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                ref={dropdownRef}
                                                id="user-dropdown"
                                                initial={prefersReducedMotion ? "visible" : "hidden"}
                                                animate="visible"
                                                exit="hidden"
                                                variants={dropdownVariants}
                                                className='absolute right-0 mt-2 w-48 bg-deepGray rounded-lg shadow-lg py-2 text-warmBeige z-50'
                                                role="menu"
                                                aria-orientation="vertical"
                                                aria-labelledby="user-menu-button">
                                                <Link
                                                    href='/dashboard?tab=profile'
                                                    className='block px-4 py-2 hover:bg-burntAmber hover:text-darkMutedTeal rounded-lg text-center focus:outline-none focus:bg-burntAmber focus:text-darkMutedTeal'
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    role="menuitem">
                                                    Profile
                                                </Link>
                                                <Link
                                                    href='/dashboard?tab=orders'
                                                    className='block px-4 py-2 hover:bg-burntAmber hover:text-darkMutedTeal rounded-lg text-center focus:outline-none focus:bg-burntAmber focus:text-darkMutedTeal'
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    role="menuitem">
                                                    Orders
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        logout()
                                                        setIsDropdownOpen(false)
                                                    }}
                                                    className='w-full px-4 py-2 hover:bg-burntAmber hover:text-darkMutedTeal rounded-lg text-center flex justify-center focus:outline-none focus:bg-burntAmber focus:text-darkMutedTeal'
                                                    role="menuitem">
                                                    Sign Out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            ) : (
                                <Link href='/login'>
                                    <Button
                                        className='rounded-full bg-burntAmber text-darkMutedTeal font-generalSans font-bold px-4 py-2 text-sm hover:bg-deepCopper transition-colors focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-2 focus:ring-offset-charcoalBlack'
                                        aria-label='Sign in to your account'>
                                        Sign In
                                    </Button>
                                </Link>
                            )}
                        </div>

                        <Button
                            variant='link'
                            className='p-0 text-mutedSand hover:text-burntAmber active:text-deepCopper md:hidden focus:outline-none focus:text-burntAmber'
                            onClick={() => setIsDrawerOpen(true)}
                            aria-label='Open Menu'
                            aria-expanded={isDrawerOpen}
                            aria-controls="mobile-menu">
                            <MenuIcon className='w-6 h-6' />
                        </Button>
                    </div>
                </div>
            </nav>
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
            <div id="skip-to-content" className="sr-only">
                <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
            </div>
        </>
    )
}

export default Navbar
