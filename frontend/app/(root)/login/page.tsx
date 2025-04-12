"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import { loginUser } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const { login } = useAuth()
    const router = useRouter()

    useEffect(() => {
        document.title = "Login | Your Account | Bookstore Name"
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        try {
            const data = await loginUser(formData.email, formData.password)

            if (!data.token) {
                throw new Error("Authentication failed: No token received")
            }

            login(data.token)

            router.push("/dashboard")
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            )
        }
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Bookstore Name",
        url: "https://yourbookstore.com",
        logo: "https://yourbookstore.com/images/weblogo.png",
        sameAs: [
            "https://facebook.com/yourbookstore",
            "https://twitter.com/yourbookstore",
            "https://instagram.com/yourbookstore",
        ],
    }

    return (
        <>
            <Head>
                <title>Login | Your Account | Bookstore Name</title>
                <meta
                    name='description'
                    content='Sign in to your Bookstore Name account to access your dashboard, manage orders, view your wishlist, and enjoy a personalized shopping experience.'
                />
                <meta
                    name='robots'
                    content='noindex, nofollow'
                />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <link
                    rel='canonical'
                    href='https://yourbookstore.com/login'
                />
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                    }}
                />
            </Head>

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
                            aria-label='Return to homepage'>
                            <Image
                                src='/images/weblogo.png'
                                alt='Bookstore Name'
                                height={50}
                                width={150}
                                className='mb-6'
                                priority
                            />
                        </Link>
                        <h1
                            id='login-heading'
                            className={
                                "font-author mb-4 font-bold text-xl leading-6 text-warmBeige text-center " +
                                "md:text-2xl lg:text-[28px] md:leading-[30px] lg:leading-9"
                            }>
                            Welcome Back!
                        </h1>
                        <p
                            className={
                                "font-generalSans text-[12px] leading-4 text-mutedSand text-center mb-6 " +
                                "md:text-[14px] lg:text-[16px] md:leading-5 lg:leading-6"
                            }>
                            Sign in to access your account and continue
                            exploring.
                        </p>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className='flex flex-col border-b border-charcoalBlack'
                        aria-label='Login form'>
                        <label
                            htmlFor='email'
                            className={
                                "font-generalSans font-bold text-warmBeige text-[10px] text-left mb-2 " +
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
                                "bg-slightlyLightGrey border border-darkMocha rounded-[8px] font-generalSans text-mutedSand mb-4 " +
                                "text-[12px] md:text-[14px] lg:text-[16px] py-2 px-2.5 w-full md:py-2.5 lg:py-3 md:px-3 lg:px-4 " +
                                "focus:border-burntAmber focus:outline-none"
                            }
                        />
                        <div className='relative'>
                            <label
                                htmlFor='password'
                                className={
                                    "font-generalSans font-bold text-warmBeige text-[10px] text-left mb-2 " +
                                    "md:text-[12px] lg:text-[14px]"
                                }>
                                Password
                            </label>
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
                                    "bg-slightlyLightGrey border border-darkMocha rounded-[8px] font-generalSans text-mutedSand mb-4 " +
                                    "text-[12px] md:text-[14px] lg:text-[16px] py-2 px-2.5 w-full md:py-2.5 lg:py-3 md:px-3 lg:px-4 " +
                                    "focus:border-burntAmber focus:outline-none"
                                }
                            />
                            <button
                                type='button'
                                onClick={togglePasswordVisibility}
                                className='absolute right-3 top-1/2 -translate-y-1/3 text-mutedSand hover:text-burntAmber flex items-center justify-center'
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }>
                                {showPassword ? (
                                    <svg
                                        className='w-6 h-6 md:w-7 md:h-7'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21'
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className='w-6 h-6 md:w-7 md:h-7'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'>
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
                        <button
                            type='submit'
                            className={
                                "font-author font-bold text-[14px] leading-4 bg-burntAmber rounded-[8px] py-2 px-4 w-full text-warmBeige mb-4 " +
                                "md:text-[16px] md:leading-5 md:py-2.5 md:px-5 lg:text-lg lg:leading-6 lg:py-3 lg:px-6 " +
                                "hover:bg-deepCopper active:scale-95 transform duration-100"
                            }>
                            Sign In
                        </button>
                        <Link
                            href='/forgot-password'
                            className={
                                "font-generalSans text-burntAmber text-[10px] md:text-[12px] lg:text-[14px] mb-6 text-end " +
                                "hover:text-deepCopper"
                            }>
                            Forgot Password?
                        </Link>
                    </form>
                    <div className='mt-4'>
                        <p
                            className={
                                "font-generalSans text-[10px] text-mutedSand text-center md:text-[12px] lg:text-[14px]"
                            }>
                            Don‘t have an account?
                            <Link
                                href='/register'
                                className='text-burntAmber hover:text-deepCopper'>
                                Sign up
                            </Link>
                        </p>
                        {error && (
                            <p
                                className='text-deepCopper text-center mt-4'
                                role='alert'
                                aria-live='assertive'>
                                {error}
                            </p>
                        )}
                    </div>
                </section>
            </main>
        </>
    )
}
