"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { XIcon } from "lucide-react"
import Link from "next/link"
import Searchbar from "@/components/navbar/searchbar"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"

const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Store", href: "/shop" },
]

const Drawer = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean
    onClose: () => void
}) => {
    const { user, logout, loading } = useAuth()
    const prefersReducedMotion = useReducedMotion()
    
    // Handle escape key press to close drawer
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (isOpen && event.key === 'Escape') {
                onClose()
            }
        }
        
        document.addEventListener('keydown', handleEscapeKey)
        
        // Lock body scroll when drawer is open
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscapeKey)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (loading) return null

    // Animation settings based on reduced motion preference
    const drawerAnimations = prefersReducedMotion
        ? {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 }
          }
        : {
            initial: { x: "100%" },
            animate: { x: 0 },
            exit: { x: "100%" },
            transition: { duration: 0.3, ease: "easeInOut" }
          }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                        aria-hidden="true"
                    />
                
                    {/* Drawer panel */}
                    <motion.div
                        {...drawerAnimations}
                        className="fixed top-0 right-0 bottom-0 w-[75%] max-w-[320px] bg-[#252525] text-[#EAE0D5] z-50 overflow-y-auto"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="drawer-title"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3A2E2B]">
                            <span id="drawer-title" className="text-xl font-author font-bold">
                                Menu
                            </span>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-[#3A2E2B] rounded-full transition duration-200"
                                aria-label="Close menu"
                            >
                                <XIcon className="w-6 h-6 text-[#EAE0D5]" />
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <Searchbar />
                        </div>

                        <nav className="px-6 py-4 space-y-4" aria-label="Mobile navigation">
                            {navigationLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={onClose}
                                    className="block text-lg font-author font-medium hover:text-[#D68C45] active:text-[#B36E30] transition-colors duration-200 focus:outline-none focus:text-[#D68C45] focus:underline"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            
                            {/* User account links */}
                            <div className="pt-2 border-t border-[#3A2E2B]">
                                {user ? (
                                    <>
                                        <Link
                                            href="/dashboard?tab=settings"
                                            onClick={onClose}
                                            className="block text-lg font-author font-medium hover:text-[#D68C45] active:text-[#B36E30] transition-colors duration-200 focus:outline-none focus:text-[#D68C45] focus:underline"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            onClick={onClose}
                                            className="block text-lg font-author font-medium hover:text-[#D68C45] active:text-[#B36E30] transition-colors duration-200 focus:outline-none focus:text-[#D68C45] focus:underline mt-4"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout()
                                                onClose()
                                            }}
                                            className="block w-full text-left text-lg font-author font-medium hover:text-[#D68C45] active:text-[#B36E30] transition-colors duration-200 focus:outline-none focus:text-[#D68C45] focus:underline mt-4"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={onClose}
                                        className="block text-lg font-author font-medium hover:text-[#D68C45] active:text-[#B36E30] transition-colors duration-200 focus:outline-none focus:text-[#D68C45] focus:underline"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Drawer
