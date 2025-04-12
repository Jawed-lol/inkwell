"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { registerUser } from "@/lib/api"
import Head from "next/head"

interface FormData {
    first_name: string
    second_name: string
    email: string
    password: string
    confirm_password: string
}

export default function Register() {
    const [formData, setFormData] = useState<FormData>({
        first_name: "",
        second_name: "",
        email: "",
        password: "",
        confirm_password: "",
    })
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setMessage("")
        setIsSubmitting(true)

        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match")
            setIsSubmitting(false)
            return
        }

        try {
            const data = await registerUser(
                formData.first_name,
                formData.second_name,
                formData.email,
                formData.password
            )

            if (data?.token) {
                localStorage.setItem("token", data.token)
                setMessage(
                    "Account created successfully! Redirecting to login page..."
                )
                setTimeout(() => {
                    window.location.href = "/login"
                }, 2000)
            } else {
                throw new Error("Invalid response from server")
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "An unknown error occurred"
            console.error("Registration error:", errorMessage)
            setError(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev)
    const toggleConfirmPasswordVisibility = () =>
        setShowConfirmPassword((prev) => !prev)

    const pageTitle = "Create Your Account | Inkwell"
    const pageDescription =
        "Join the Inkwell community to explore, discover, and discuss your favorite books. Sign up today and start your literary journey."

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta
                    name='description'
                    content={pageDescription}
                />
                <meta
                    name='robots'
                    content='index, follow'
                />
                <meta
                    property='og:title'
                    content={pageTitle}
                />
                <meta
                    property='og:description'
                    content={pageDescription}
                />
                <meta
                    property='og:type'
                    content='website'
                />
                <link
                    rel='canonical'
                    href='/register'
                />
            </Head>

            <main
                className='flex min-h-screen items-center justify-center bg-charcoalBlack py-16 md:py-20 lg:py-24'
                aria-labelledby='registration-heading'>
                <section className='flex w-full max-w-md flex-col items-center justify-center rounded-2xl bg-deepGray p-4 shadow-lg md:p-6 lg:p-8'>
                    <Image
                        src='/images/weblogo.png'
                        alt='Inkwell - Your book community'
                        height={50}
                        width={150}
                        className='mb-6'
                        priority
                    />
                    <h1
                        id='registration-heading'
                        className='mb-2 text-center font-author text-lg font-bold text-warmBeige md:text-xl lg:text-2xl'>
                        Create Your Account
                    </h1>
                    <p className='mb-6 text-center font-generalSans text-xs text-mutedSand md:text-sm lg:text-base'>
                        Join our community and start exploring your favorite
                        books today.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className='flex w-full flex-col gap-4'
                        aria-label='Registration form'>
                        <div className='flex flex-col gap-4 md:flex-row md:gap-2'>
                            <div className='flex w-full flex-col'>
                                <label
                                    htmlFor='first_name'
                                    className='mb-1 text-sm font-bold text-warmBeige md:text-base'>
                                    First Name
                                </label>
                                <input
                                    id='first_name'
                                    type='text'
                                    name='first_name'
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    placeholder='Enter your first name'
                                    className='w-full rounded-lg border border-darkMocha bg-slightlyLightGrey px-3 py-2 text-xs text-mutedSand transition-colors duration-200 focus:border-burntAmber focus:outline-none md:text-sm lg:text-base'
                                />
                            </div>

                            <div className='flex w-full flex-col'>
                                <label
                                    htmlFor='second_name'
                                    className='mb-1 text-sm font-bold text-warmBeige md:text-base'>
                                    Last Name
                                </label>
                                <input
                                    id='second_name'
                                    type='text'
                                    name='second_name'
                                    value={formData.second_name}
                                    onChange={handleChange}
                                    required
                                    placeholder='Enter your last name'
                                    className='w-full rounded-lg border border-darkMocha bg-slightlyLightGrey px-3 py-2 text-xs text-mutedSand transition-colors duration-200 focus:border-burntAmber focus:outline-none md:text-sm lg:text-base'
                                />
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <label
                                htmlFor='email'
                                className='mb-1 text-sm font-bold text-warmBeige md:text-base'>
                                Email Address
                            </label>
                            <input
                                id='email'
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder='your.email@example.com'
                                className='w-full rounded-lg border border-darkMocha bg-slightlyLightGrey px-3 py-2 text-xs text-mutedSand transition-colors duration-200 focus:border-burntAmber focus:outline-none md:text-sm lg:text-base'
                            />
                        </div>

                        <div className='relative flex flex-col'>
                            <label
                                htmlFor='password'
                                className='mb-1 text-sm font-bold text-warmBeige md:text-base'>
                                Password
                            </label>
                            <input
                                id='password'
                                type={showPassword ? "text" : "password"}
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                placeholder='Create a secure password'
                                className='w-full rounded-lg border border-darkMocha bg-slightlyLightGrey px-3 py-2 text-xs text-mutedSand transition-colors duration-200 focus:border-burntAmber focus:outline-none md:text-sm lg:text-base'
                            />
                            <button
                                type='button'
                                onClick={togglePasswordVisibility}
                                className='absolute right-3 top-9 flex items-center justify-center text-mutedSand hover:text-burntAmber'
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }>
                                <svg
                                    className='h-6 w-6 md:h-7 md:w-7'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    {showPassword ? (
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21'
                                        />
                                    ) : (
                                        <>
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
                                        </>
                                    )}
                                </svg>
                            </button>
                            <p className='mt-1 text-xs text-mutedSand'>
                                Must be at least 8 characters
                            </p>
                        </div>

                        <div className='relative flex flex-col'>
                            <label
                                htmlFor='confirm_password'
                                className='mb-1 text-sm font-bold text-warmBeige md:text-base'>
                                Confirm Password
                            </label>
                            <input
                                id='confirm_password'
                                type={showConfirmPassword ? "text" : "password"}
                                name='confirm_password'
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                placeholder='Confirm your password'
                                className='w-full rounded-lg border border-darkMocha bg-slightlyLightGrey px-3 py-2 text-xs text-mutedSand transition-colors duration-200 focus:border-burntAmber focus:outline-none md:text-sm lg:text-base'
                            />
                            <button
                                type='button'
                                onClick={toggleConfirmPasswordVisibility}
                                className='absolute right-3 top-9 flex items-center justify-center text-mutedSand hover:text-burntAmber'
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }>
                                <svg
                                    className='h-6 w-6 md:h-7 md:w-7'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    {showConfirmPassword ? (
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21'
                                        />
                                    ) : (
                                        <>
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
                                        </>
                                    )}
                                </svg>
                            </button>
                        </div>

                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='w-full rounded-lg bg-burntAmber px-4 py-2 font-author text-sm font-bold text-warmBeige transition-all duration-200 hover:bg-deepCopper active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 md:text-base lg:text-lg'>
                            {isSubmitting ? "Creating Account..." : "Register"}
                        </button>
                    </form>

                    <p className='mt-4 text-center text-xs text-burntAmber md:text-sm'>
                        Already have an account?{" "}
                        <Link
                            href='/login'
                            className='transition-colors duration-200 hover:text-deepCopper'>
                            Sign In
                        </Link>
                    </p>

                    {message && (
                        <div
                            className='mt-4 rounded-lg border border-burntAmber bg-deepGray px-4 py-3 text-center font-generalSans text-xs text-burntAmber md:text-sm lg:text-base'
                            role='status'
                            aria-live='polite'>
                            {message}
                        </div>
                    )}
                    {error && (
                        <div
                            className='mt-4 rounded-lg border border-deepCopper bg-deepGray px-4 py-3 text-center font-generalSans text-xs text-deepCopper md:text-sm lg:text-base'
                            role='alert'>
                            {error}
                        </div>
                    )}
                </section>
            </main>
        </>
    )
}
