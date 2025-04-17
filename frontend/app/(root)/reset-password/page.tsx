"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authService } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { motion, useReducedMotion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"

export default function ResetPassword() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [token, setToken] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const { user } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        setIsMounted(true)
        if (user) {
            router.push("/dashboard?tab=profile")
        }
    }, [user, router])

    useEffect(() => {
        // More descriptive title
        document.title = "Reset Password - Create a New Password for Your Inkwell Account"
        const tokenParam = searchParams.get("token")
        if (tokenParam) {
            setToken(tokenParam)
        } else {
            setError("No reset token provided. Please use the link from your email.")
        }
    }, [searchParams])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === "password") setPassword(value)
        if (name === "confirmPassword") setConfirmPassword(value)
        
        // Clear messages when user starts typing again
        if (error) setError(null)
        if (success) setSuccess(null)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        
        // Validate inputs
        if (!token) {
            setError("Reset token is missing. Please use the link from your email.")
            return
        }
        
        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters long")
            return
        }
        
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }
        
        setIsSubmitting(true)
    
        try {
            const response = await authService.resetPassword(token, password)
            
            if (response.success) {
                setSuccess("Your password has been reset successfully. You can now log in with your new password.")
                // Clear form
                setPassword("")
                setConfirmPassword("")
                
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push("/login")
                }, 3000)
            } else {
                throw new Error(response.message || "Failed to reset password")
            }
        } catch (err) {
            setError(
                err instanceof Error 
                    ? err.message 
                    : "An unknown error occurred. Please try again."
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }

    // Enhanced structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Reset Password - Create a New Password for Your Inkwell Account",
        "description": "Create a new secure password for your Inkwell account. Complete the password reset process to regain access to your account.",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"}/reset-password`
        },
        "publisher": {
            "@type": "Organization",
            "name": "Inkwell Bookstore",
            "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"}/images/weblogo.png`
            }
        }
    }

    if (user) {
        return null
    }

    return (
        <>
            {/* SEO content - hidden from view but available to screen readers and search engines */}
            <div className="sr-only" aria-hidden="true">
                <h1>Reset Password - Create a New Password for Your Inkwell Account</h1>
                <p>Create a new secure password for your Inkwell account. Complete the password reset process to regain access to your account and continue enjoying your favorite books.</p>
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                    }}
                />
                <link
                    rel='canonical'
                    href={`${process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"}/reset-password`}
                />
                <meta name="description" content="Create a new secure password for your Inkwell account. Complete the password reset process to regain access to your account." />
                <meta name="robots" content="noindex, nofollow" />
            </div>

            <main className='bg-charcoalBlack flex items-center justify-center py-20 min-h-screen lg:py-24'>
                <motion.section
                    initial={!isMounted || prefersReducedMotion ? "visible" : "hidden"}
                    animate="visible"
                    variants={fadeIn}
                    className={
                        "p-6 max-w-[480px] bg-deepGray rounded-2xl md:p-8 lg:p-12 w-full " +
                        "shadow-[0px_8px_24px_rgba(0,_0,_0,_0.3)]"
                    }
                    aria-labelledby='reset-password-heading'>
                    <div className='flex flex-col justify-between items-center'>
                        <Link
                            href='/'
                            aria-label='Return to Inkwell homepage'
                            className="focus:outline-none focus:ring-2 focus:ring-burntAmber rounded-lg p-1">
                            <Image
                                src='/images/weblogo.png'
                                alt='Inkwell Bookstore Logo'
                                height={50}
                                width={150}
                                className='mb-6'
                                priority
                            />
                        </Link>
                        <h2
                            id='reset-password-heading'
                            className={
                                "font-author mb-4 font-bold text-xl leading-6 text-warmBeige text-center " +
                                "md:text-2xl lg:text-[28px] md:leading-[30px] lg:leading-9"
                            }>
                            Reset Your Password
                        </h2>
                        <p
                            className={
                                "font-generalSans text-[12px] leading-4 text-mutedSand text-center mb-6 " +
                                "md:text-[14px] lg:text-[16px] md:leading-5 lg:leading-6"
                            }>
                            Enter your new password below to complete the password reset process.
                        </p>
                    </div>
                    
                    {/* Improved error message with better accessibility */}
                    {error && (
                        <div 
                            className='bg-deepCopper/20 border border-deepCopper text-deepCopper p-3 rounded-lg mb-4'
                            role='alert'
                            aria-live='assertive'>
                            <p className="text-center text-sm font-medium">{error}</p>
                        </div>
                    )}
                    
                    {/* Improved success message with better accessibility */}
                    {success && (
                        <div 
                            className='bg-green-800/20 border border-green-700 text-green-500 p-3 rounded-lg mb-4'
                            role='status'
                            aria-live='polite'>
                            <p className="text-center text-sm font-medium">{success}</p>
                        </div>
                    )}
                    
                    <form
                        onSubmit={handleSubmit}
                        className='flex flex-col border-b border-charcoalBlack pb-6'
                        aria-label='Password reset form'
                        noValidate>
                        <div className="mb-4">
                            <label
                                htmlFor='password'
                                className={
                                    "font-generalSans font-bold text-warmBeige text-[10px] text-left mb-2 block " +
                                    "md:text-[12px] lg:text-[14px]"
                                }>
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    name='password'
                                    value={password}
                                    onChange={handleChange}
                                    required
                                    autoComplete='new-password'
                                    aria-required='true'
                                    aria-invalid={error && (password.length < 6 || !password) ? 'true' : 'false'}
                                    aria-describedby="password-requirements"
                                    className={
                                        "bg-slightlyLightGrey border border-darkMocha rounded-[8px] font-generalSans text-mutedSand " +
                                        "text-[12px] md:text-[14px] lg:text-[16px] py-2 px-2.5 w-full md:py-2.5 lg:py-3 md:px-3 lg:px-4 " +
                                        "focus:border-burntAmber focus:outline-none focus:ring-1 focus:ring-burntAmber pr-10"
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-mutedSand hover:text-warmBeige focus:outline-none focus:ring-2 focus:ring-burntAmber rounded-md"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} aria-hidden="true" />
                                    ) : (
                                        <Eye size={18} aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                            <p id="password-requirements" className="text-[10px] text-mutedSand mt-1 md:text-[12px]">
                                Password must be at least 6 characters long
                            </p>
                        </div>
                        
                        <div className="mb-6">
                            <label
                                htmlFor='confirmPassword'
                                className={
                                    "font-generalSans font-bold text-warmBeige text-[10px] text-left mb-2 block " +
                                    "md:text-[12px] lg:text-[14px]"
                                }>
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id='confirmPassword'
                                    name='confirmPassword'
                                    value={confirmPassword}
                                    onChange={handleChange}
                                    required
                                    autoComplete='new-password'
                                    aria-required='true'
                                    aria-invalid={error && (password !== confirmPassword) ? 'true' : 'false'}
                                    aria-describedby="confirm-password-requirements"
                                    className={
                                        "bg-slightlyLightGrey border border-darkMocha rounded-[8px] font-generalSans text-mutedSand " +
                                        "text-[12px] md:text-[14px] lg:text-[16px] py-2 px-2.5 w-full md:py-2.5 lg:py-3 md:px-3 lg:px-4 " +
                                        "focus:border-burntAmber focus:outline-none focus:ring-1 focus:ring-burntAmber pr-10"
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-mutedSand hover:text-warmBeige focus:outline-none focus:ring-2 focus:ring-burntAmber rounded-md"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} aria-hidden="true" />
                                    ) : (
                                        <Eye size={18} aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                            <p id="confirm-password-requirements" className="text-[10px] text-mutedSand mt-1 md:text-[12px]">
                                Both passwords must match exactly
                            </p>
                        </div>
                        
                        <motion.button
                            type='submit'
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                            className={
                                "font-author font-bold text-[14px] leading-4 bg-burntAmber rounded-[8px] py-2 px-4 w-full text-warmBeige " +
                                "md:text-[16px] md:leading-5 md:py-2.5 md:px-5 lg:text-lg lg:leading-6 lg:py-3 lg:px-6 " +
                                "hover:bg-deepCopper transition-colors focus:outline-none focus:ring-2 focus:ring-burntAmber " +
                                "disabled:opacity-70 disabled:cursor-not-allowed"
                            }>
                            {isSubmitting ? "Resetting..." : "Reset Password"}
                        </motion.button>
                    </form>
                    
                    <div className='mt-4'>
                        <p
                            className={
                                "font-generalSans text-[10px] text-mutedSand text-center md:text-[12px] lg:text-[14px]"
                            }>
                            Remember your password?{" "}
                            <Link
                                href='/login'
                                className='text-burntAmber hover:text-deepCopper focus:outline-none focus:ring-2 focus:ring-burntAmber rounded-sm px-1'>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.section>
            </main>
        </>
    )
}