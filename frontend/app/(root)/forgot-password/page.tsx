"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push("/dashboard?tab=profile")
        }
    }, [user, router])

    useEffect(() => {
        // More descriptive title
        document.title = "Forgot Password - Reset Your Inkwell Account"
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        // Clear messages when user starts typing again
        if (error) setError(null)
        if (success) setSuccess(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setIsSubmitting(true)
    
        try {
            // Email validation
            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                throw new Error("Please enter a valid email address")
            }
            
            // Call the password reset API
            const response = await authService.requestPasswordReset(email)
            
            if (response.success) {
                setSuccess("Password reset instructions have been sent to your email")
            } else {
                throw new Error(response.message || "Failed to send reset instructions")
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

    // Enhanced SEO structured data with more specific information
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Forgot Password - Reset Your Inkwell Account",
        "description": "Reset your Inkwell account password securely. Enter your email address to receive password reset instructions.",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"}/forgot-password`
        },
        "publisher": {
            "@type": "Organization",
            "name": "Inkwell Bookstore",
            "url": process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app",
            "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"}/images/weblogo.png`
            }
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Forgot Password",
                    "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"}/forgot-password`
                }
            ]
        }
    }

    if (user) {
        return null
    }

    return (
        <>
            {/* Improved SEO section with more descriptive content */}
            <div className="sr-only" aria-hidden="true">
                <h1>Forgot Password - Reset Your Inkwell Account</h1>
                <p>Reset your Inkwell account password securely. Enter your email address to receive password reset instructions. We&apos;ll email you a secure link to create a new password.</p>
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                    }}
                />
                <link
                    rel='canonical'
                    href={`${process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"}/forgot-password`}
                />
                <meta name="description" content="Reset your Inkwell account password securely. Enter your email address to receive password reset instructions." />
                <meta name="robots" content="noindex, nofollow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#1A1A1A" />
            </div>

            <main className='bg-charcoalBlack flex items-center justify-center py-20 min-h-screen lg:py-24'>
                <section
                    className={
                        "p-6 max-w-[480px] bg-deepGray rounded-2xl md:p-8 lg:p-12 w-full " +
                        "shadow-[0px_8px_24px_rgba(0,_0,_0,_0.3)]"
                    }
                    aria-labelledby='forgot-password-heading'>
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
                            id='forgot-password-heading'
                            className={
                                "font-author mb-4 font-bold text-xl leading-6 text-warmBeige text-center " +
                                "md:text-2xl lg:text-[28px] md:leading-[30px] lg:leading-9"
                            }>
                            Forgot Your Password?
                        </h2>
                        <p
                            className={
                                "font-generalSans text-[12px] leading-4 text-mutedSand text-center mb-6 " +
                                "md:text-[14px] lg:text-[16px] md:leading-5 lg:leading-6"
                            }>
                            Enter your email address and we&apos;ll send you instructions to reset your password.
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
                        className='flex flex-col border-b border-charcoalBlack pb-4'
                        aria-label='Password reset request form'
                        noValidate>
                        <div className="mb-4">
                            <label
                                htmlFor='email'
                                className={
                                    "font-generalSans font-bold text-warmBeige text-[10px] text-left mb-2 block " +
                                    "md:text-[12px] lg:text-[14px]"
                                }>
                                Email Address
                            </label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                value={email}
                                onChange={handleChange}
                                required
                                autoComplete='email'
                                aria-required='true'
                                aria-invalid={error ? 'true' : 'false'}
                                aria-describedby={error ? 'email-error' : undefined}
                                placeholder="your-email@example.com"
                                className={
                                    "bg-slightlyLightGrey border border-darkMocha rounded-[8px] font-generalSans text-mutedSand " +
                                    "text-[12px] md:text-[14px] lg:text-[16px] py-2 px-2.5 w-full md:py-2.5 lg:py-3 md:px-3 lg:px-4 " +
                                    "focus:border-burntAmber focus:outline-none focus:ring-1 focus:ring-burntAmber"
                                }
                            />
                        </div>
                        
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                            className={
                                "font-author font-bold text-[14px] leading-4 bg-burntAmber rounded-[8px] py-2 px-4 w-full text-warmBeige mb-4 " +
                                "md:text-[16px] md:leading-5 md:py-2.5 md:px-5 lg:text-lg lg:leading-6 lg:py-3 lg:px-6 " +
                                "hover:bg-deepCopper active:scale-95 transform duration-100 focus:outline-none focus:ring-2 focus:ring-burntAmber " +
                                "disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                            }>
                            {isSubmitting ? "Sending..." : "Reset Password"}
                        </button>
                    </form>
                    
                    <div className='mt-4'>
                        <p
                            className={
                                "font-generalSans text-[10px] text-mutedSand text-center md:text-[12px] lg:text-[14px]"
                            }>
                            Remember your password?{" "}
                            <Link
                                href='/login'
                                className='text-burntAmber hover:text-deepCopper focus:outline-none focus:underline focus:ring-2 focus:ring-burntAmber rounded-sm px-1'>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </section>
            </main>
        </>
    )
}