"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MenuIcon, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import Searchbar from "@/components/navbar/searchbar"
import { useState } from "react"
import Drawer from "@/components/navbar/Drawer"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"

const itemsLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Store", href: "/shop" },
]

const Navbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const { cart } = useCart()
    const { user, logout, loading } = useAuth()

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    }

    if (loading) {
        return (
            <nav className='bg-[#1B1B1B] w-full fixed top-0 left-0 right-0 z-40 border-b-[1px] border-b-[#3A2E2B] shadow-[0px_2px_10px_rgba(0,0,0,0.2)]'>
                <div className='container mx-auto py-4 px-6 lg:px-8'></div>
            </nav>
        ) // Minimal placeholder during loading
    }

    return (
        <>
            <nav
                className='bg-[#1B1B1B] text-[#EAE0D5] w-full fixed top-0 left-0 right-0 z-40 border-b-[1px] border-b-[#3A2E2B] shadow-[0px_2px_10px_rgba(0,0,0,0.2)]'
                aria-label='Main Navigation'>
                <div className='container flex items-center lg:gap-5 mx-auto justify-between py-4 px-6 lg:px-8'>
                    {/* Left Section: Logo & Navigation */}
                    <div className='flex items-center gap-3 md:gap-8'>
                        <Link
                            href='/'
                            className='flex items-center'>
                            <Image
                                src='/images/weblogo.png'
                                alt='Inkwell Logo'
                                width={90}
                                height={90}
                                className='hover:scale-[1.05] transition duration-200 ease-in-out'
                            />
                        </Link>
                        <div className='hidden md:flex items-center justify-end gap-6 text-[16px] font-[Author Sans] font-medium'>
                            {itemsLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className='hover:text-[#D68C45] active:text-[#B36E30] transition-colors duration-200'>
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
                    <div className='flex items-center gap-3 lg:gap-4'>
                        {/* Cart Icon */}
                        <Link
                            href='/cart'
                            className='relative'>
                            <Button
                                variant='link'
                                className='p-0 [&_svg]:w-6 [&_svg]:h-6 text-mutedSand hover:text-burntAmber'
                                aria-label={`Cart with ${cart.length} items`}>
                                <ShoppingCart />
                                {cart.length > 0 && (
                                    <span className='absolute -top-1 -right-1 bg-burntAmber text-darkMutedTeal text-xs rounded-full w-4 h-4 flex items-center justify-center'>
                                        {cart.length}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        {/* User Icon or Connect Button */}
                        <div className='relative hidden md:block'>
                            {user ? (
                                <>
                                    <Button
                                        variant='link'
                                        className='p-0 [&_svg]:w-6 [&_svg]:h-6 text-mutedSand hover:text-burntAmber'
                                        onClick={() =>
                                            setIsDropdownOpen(!isDropdownOpen)
                                        }
                                        aria-label='User menu'>
                                        <User />
                                    </Button>
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial='hidden'
                                                animate='visible'
                                                exit='hidden'
                                                variants={dropdownVariants}
                                                className='absolute right-0 mt-2 w-48 bg-deepGray rounded-lg shadow-lg py-2 text-warmBeige z-50'>
                                                <Link
                                                    href='/profile'
                                                    className='block px-4 py-2 hover:bg-burntAmber hover:text-darkMutedTeal w-5/6 rounded-lg text-center mx-auto'
                                                    onClick={() =>
                                                        setIsDropdownOpen(false)
                                                    }>
                                                    Profile
                                                </Link>
                                                <Link
                                                    href='/dashboard'
                                                    className='block px-4 py-2 hover:bg-burntAmber hover:text-darkMutedTeal w-5/6 rounded-lg text-center mx-auto'
                                                    onClick={() =>
                                                        setIsDropdownOpen(false)
                                                    }>
                                                    Dashboard
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        logout()
                                                        setIsDropdownOpen(false)
                                                    }}
                                                    className='py-2 hover:bg-burntAmber hover:text-darkMutedTeal w-5/6 rounded-lg text-center mx-auto justify-center flex'>
                                                    Disconnect
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            ) : (
                                <Link href='/login'>
                                    <Button
                                        className='rounded-full bg-[#D68C45] text-darkMutedTeal font-generalSans font-bold px-4 py-2 text-sm hover:bg-[#B36E30] transition duration-200'
                                        aria-label='Connect to Your Account'>
                                        Connect
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Icon */}
                        <Button
                            variant='link'
                            className='p-0 [&_svg]:w-6 [&_svg]:h-6 md:hidden text-mutedSand hover:text-burntAmber active:text-deepCopper'
                            onClick={() => setIsDrawerOpen(true)}
                            aria-label='Open Menu'>
                            <MenuIcon />
                        </Button>
                    </div>
                </div>
            </nav>
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </>
    )
}

export default Navbar
