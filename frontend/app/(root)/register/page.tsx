"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { registerUser } from "@/lib/api"
import Head from "next/head"

export default function Register() {
    const [formData, setFormData] = useState({
        first_name: "",
        second_name: "",
        email: "",
        password: "",
    })
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setMessage("")
        setIsSubmitting(true)

        try {
            const data = await registerUser(
                formData.first_name || "",
                formData.second_name || "",
                formData.email || "",
                formData.password || ""
            )

            if (data && data.token) {
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
                className='bg-charcoalBlack py-16 min-h-screen flex justify-center items-center md:py-20 lg:py-24'
                aria-labelledby='registration-heading'>
                <section className='p-4 max-w-md w-full bg-deepGray rounded-2xl md:p-6 lg:p-8 flex flex-col items-center justify-center shadow-lg'>
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
                        className='text-center font-author font-bold text-lg text-warmBeige md:text-xl lg:text-2xl mb-2'>
                        Create Your Account
                    </h1>
                    <p className='font-generalSans text-center text-xs text-mutedSand md:text-sm lg:text-base mb-6'>
                        Join our community and start exploring your favorite
                        books today.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className='w-full flex flex-col gap-4'
                        aria-label='Registration form'>
                        <div className='flex flex-col gap-4 md:flex-row md:gap-2'>
                            <div className='flex flex-col w-full'>
                                <label
                                    htmlFor='first_name'
                                    className='text-warmBeige font-bold text-sm mb-1 md:text-base'>
                                    First Name
                                </label>
                                <input
                                    id='first_name'
                                    type='text'
                                    name='first_name'
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    aria-required='true'
                                    placeholder='Enter your first name'
                                    className='bg-slightlyLightGrey border border-darkMocha rounded-lg font-generalSans text-mutedSand text-xs md:text-sm lg:text-base py-2 px-3 w-full focus:border-burntAmber focus:outline-none transition-colors duration-200'
                                />
                            </div>

                            <div className='flex flex-col w-full'>
                                <label
                                    htmlFor='second_name'
                                    className='text-warmBeige font-bold text-sm mb-1 md:text-base'>
                                    Last Name
                                </label>
                                <input
                                    id='second_name'
                                    type='text'
                                    name='second_name'
                                    value={formData.second_name}
                                    onChange={handleChange}
                                    required
                                    aria-required='true'
                                    placeholder='Enter your last name'
                                    className='bg-slightlyLightGrey border border-darkMocha rounded-lg font-generalSans text-mutedSand text-xs md:text-sm lg:text-base py-2 px-3 w-full focus:border-burntAmber focus:outline-none transition-colors duration-200'
                                />
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <label
                                htmlFor='email'
                                className='text-warmBeige font-bold text-sm mb-1 md:text-base'>
                                Email Address
                            </label>
                            <input
                                id='email'
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                                aria-required='true'
                                placeholder='your.email@example.com'
                                className='bg-slightlyLightGrey border border-darkMocha rounded-lg font-generalSans text-mutedSand text-xs md:text-sm lg:text-base py-2 px-3 w-full focus:border-burntAmber focus:outline-none transition-colors duration-200'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label
                                htmlFor='password'
                                className='text-warmBeige font-bold text-sm mb-1 md:text-base'>
                                Password
                            </label>
                            <input
                                id='password'
                                type='password'
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                required
                                aria-required='true'
                                minLength={8}
                                placeholder='Create a secure password'
                                className='bg-slightlyLightGrey border border-darkMocha rounded-lg font-generalSans text-mutedSand text-xs md:text-sm lg:text-base py-2 px-3 w-full focus:border-burntAmber focus:outline-none transition-colors duration-200'
                            />
                            <p className='text-mutedSand text-xs mt-1'>
                                Must be at least 8 characters
                            </p>
                        </div>

                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='font-author font-bold text-sm md:text-base lg:text-lg bg-burntAmber rounded-lg py-2 px-4 w-full text-warmBeige hover:bg-deepCopper active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed'>
                            {isSubmitting ? "Creating Account..." : "Register"}
                        </button>
                    </form>

                    <p className='text-burntAmber text-xs md:text-sm text-center mt-4'>
                        Already have an account?{" "}
                        <Link
                            href='/login'
                            className='hover:text-deepCopper transition-colors duration-200'>
                            Sign In
                        </Link>
                    </p>

                    {message && (
                        <div
                            className='font-generalSans text-burntAmber text-xs md:text-sm lg:text-base text-center mt-2 md:mt-3 lg:mt-4 leading-5 md:leading-6 lg:leading-7 bg-deepGray border border-burntAmber rounded-lg py-2 px-3 md:py-2.5 md:px-4 lg:py-3 lg:px-5'
                            role='status'
                            aria-live='polite'>
                            {message}
                        </div>
                    )}
                    {error && (
                        <div
                            className='font-generalSans text-deepCopper text-xs md:text-sm lg:text-base text-center mt-2 md:mt-3 lg:mt-4 leading-5 md:leading-6 lg:leading-7 bg-deepGray border border-deepCopper rounded-lg py-2 px-3 md:py-2.5 md:px-4 lg:py-3 lg:px-5'
                            role='alert'>
                            {error}
                        </div>
                    )}
                </section>
            </main>
        </>
    )
}
