"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

// Updated comment to explain SEO handling in client components
// SEO metadata is handled via the hidden div and useEffect for title since this is a client component

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { login, user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push("/dashboard?tab=profile")
        }
    }, [user, router])

    useEffect(() => {
        document.title = "Login | Your Account | Inkwell"
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        // Clear error when user starts typing again
        if (error) setError(null)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)
    
        try {
            const response = await authService.login(formData.email, formData.password)
            
            if (!response.token) {
                throw new Error("Authentication failed: No token received")
            }
    
            login(response.token)
            router.push("/dashboard")
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

    // Enhanced SEO structured data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Login | Your Account | Inkwell",
        "description": "Sign in to your Inkwell account to access your dashboard, manage orders, view your wishlist, and enjoy a personalized shopping experience.",
        "publisher": {
            "@type": "Organization",
            "name": "Inkwell",
            "url": process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app",
            "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"}/images/weblogo.png`,
            "sameAs": [
                "https://facebook.com/inkwellbooks",
                "https://twitter.com/inkwellbooks",
                "https://instagram.com/inkwellbooks",
            ]
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
                    "name": "Login",
                    "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"}/login`
                }
            ]
        }
    }

    if (user) {
        return null
    }

    return (
        <>
            <div className="hidden">
                <h1>Login to Inkwell</h1>
                <p>Sign in to your Inkwell account to access your dashboard, manage orders, view your wishlist, and enjoy a personalized shopping experience.</p>
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                    }}
                />
                <link
                    rel='canonical'
                    href={`${process.env.NEXT_PUBLIC_SITE_URL || "https://v0-inkwell.vercel.app"}/login`}
                />
                {/* Added meta tags for better SEO */}
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
                    aria-labelledby='login-heading'>
                    <div className='flex flex-col justify-between items-center'>
                        <Link
                            href='/'
                            aria-label='Return to homepage'
                            className="focus:outline-none focus:ring-2 focus:ring-burntAmber rounded-lg">
                            <Image
                                src='/images/weblogo.png'
                                alt='Inkwell Bookstore'
                                height={50}
                                width={150}
                                className='mb-6'
                                priority
                            />
                        </Link>
                        <h2
                            id='login-heading'
                            className={
                                "font-author mb-4 font-bold text-xl leading-6 text-warmBeige text-center " +
                                "md:text-2xl lg:text-[28px] md:leading-[30px] lg:leading-9"
                            }>
                            Welcome Back!
                        </h2>
                        <p
                            className={
                                "font-generalSans text-[12px] leading-4 text-mutedSand text-center mb-6 " +
                                "md:text-[14px] lg:text-[16px] md:leading-5 lg:leading-6"
                            }>
                            Sign in to access your account and continue
                            exploring.
                        </p>
                    </div>
                    {error && (
                        <div 
                            className='bg-deepCopper/20 border border-deepCopper text-deepCopper p-3 rounded-lg mb-4'
                            role='alert'
                            aria-live='assertive'>
                            <p className="text-center text-sm">{error}</p>
                        </div>
                    )}
                    <form
                        onSubmit={handleSubmit}
                        className='flex flex-col border-b border-charcoalBlack'
                        aria-label='Login form'
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
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete='email'
                                aria-required='true'
                                className={
                                    "bg-slightlyLightGrey border border-darkMocha rounded-[8px] font-generalSans text-mutedSand " +
                                    "text-[12px] md:text-[14px] lg:text-[16px] py-2 px-2.5 w-full md:py-2.5 lg:py-3 md:px-3 lg:px-4 " +
                                    "focus:border-burntAmber focus:outline-none focus:ring-1 focus:ring-burntAmber"
                                }
                            />
                        </div>
                        <div className='relative mb-4'>
                            <label
                                htmlFor='password'
                                className={
                                    "font-generalSans font-bold text-warmBeige text-[10px] text-left mb-2 block " +
                                    "md:text-[12px] lg:text-[14px]"
                                }>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete='current-password'
                                    aria-required='true'
                                    className={
                                        "bg-slightlyLightGrey border border-darkMocha rounded-[8px] font-generalSans text-mutedSand " +
                                        "text-[12px] md:text-[14px] lg:text-[16px] py-2 px-2.5 w-full md:py-2.5 lg:py-3 md:px-3 lg:px-4 " +
                                        "focus:border-burntAmber focus:outline-none focus:ring-1 focus:ring-burntAmber"
                                    }
                                />
                                <button
                                    type='button'
                                    onClick={togglePasswordVisibility}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-mutedSand hover:text-burntAmber focus:text-burntAmber focus:outline-none transition-colors'
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }>
                                    {showPassword ? (
                                        <svg
                                            className='w-5 h-5 md:w-6 md:h-6'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                            aria-hidden="true">
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21'
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className='w-5 h-5 md:w-6 md:h-6'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                            aria-hidden="true">
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                            />
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className={
                                "font-author font-bold text-[14px] leading-4 bg-burntAmber rounded-[8px] py-2 px-4 w-full text-warmBeige mb-4 " +
                                "md:text-[16px] md:leading-5 md:py-2.5 md:px-5 lg:text-lg lg:leading-6 lg:py-3 lg:px-6 " +
                                "hover:bg-deepCopper active:scale-95 transform duration-100 focus:outline-none focus:ring-2 focus:ring-burntAmber " +
                                "disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                            }>
                            {isSubmitting ? "Signing In..." : "Sign In"}
                        </button>
                        <div className="text-right mb-6">
                            <Link
                                href='/forgot-password'
                                className={
                                    "font-generalSans text-burntAmber text-[10px] md:text-[12px] lg:text-[14px] " +
                                    "hover:text-deepCopper focus:outline-none focus:underline"
                                }>
                                Forgot Password?
                            </Link>
                        </div>
                    </form>
                    <div className='mt-4'>
                        <p
                            className={
                                "font-generalSans text-[10px] text-mutedSand text-center md:text-[12px] lg:text-[14px]"
                            }>
                            Don&quot;t have an account?{" "}
                            <Link
                                href='/register'
                                className='text-burntAmber hover:text-deepCopper focus:outline-none focus:underline'>
                                Sign up
                            </Link>
                        </p>
                    </div>
                </section>
            </main>
        </>
    )
}
