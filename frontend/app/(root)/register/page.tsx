"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { registerUser } from "@/lib/api"

export default function Register() {
    const [formData, setFormData] = useState({
        first_name: "",
        second_name: "",
        email: "",
        password: "",
    })
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setMessage("")

        try {
            const data = await registerUser(
                formData.first_name,
                formData.second_name,
                formData.email,
                formData.password
            )
            localStorage.setItem("token", data.token)
            setMessage(
                "Account created successfully! Redirecting to login page..."
            )
            setTimeout(() => (window.location.href = "/login"), 2000)
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "An unknown error occurred"
            console.error("Registration error:", errorMessage)
            setError(errorMessage)
        }
    }

    return (
        <main className='bg-charcoalBlack py-16 min-h-screen flex justify-center items-center md:py-20 lg:py-24'>
            <section className='p-4 max-w-md w-full bg-deepGray rounded-2xl md:p-6 lg:p-8 flex flex-col items-center justify-center shadow-lg'>
                <Image
                    src='/images/weblogo.png'
                    alt='Inkwell Logo'
                    height={50}
                    width={150}
                    className='mb-6'
                    priority
                />
                <h1 className='text-center font-author font-bold text-lg text-warmBeige md:text-xl lg:text-2xl mb-2'>
                    Create Your Account
                </h1>
                <p className='font-generalSans text-center text-xs text-mutedSand md:text-sm lg:text-base mb-6'>
                    Join our community and start exploring your favorite books
                    today.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className='w-full flex flex-col gap-4'>
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
                                aria-label='Enter your first name'
                                className='bg-slightlyLightGrey border border-darkMocha rounded-lg font-generalSans text-mutedSand text-xs md:text-sm lg:text-base py-2 px-3 w-full focus:border-burntAmber focus:outline-none transition-colors duration-200'
                            />
                        </div>

                        <div className='flex flex-col w-full'>
                            <label
                                htmlFor='second_name'
                                className='text-warmBeige font-bold text-sm mb-1 md:text-base'>
                                Second Name
                            </label>
                            <input
                                id='second_name'
                                type='text'
                                name='second_name'
                                value={formData.second_name}
                                onChange={handleChange}
                                required
                                aria-label='Enter your last name'
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
                            aria-label='Enter your email address'
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
                            aria-label='Enter a secure password'
                            className='bg-slightlyLightGrey border border-darkMocha rounded-lg font-generalSans text-mutedSand text-xs md:text-sm lg:text-base py-2 px-3 w-full focus:border-burntAmber focus:outline-none transition-colors duration-200'
                        />
                    </div>

                    <button
                        type='submit'
                        className='font-author font-bold text-sm md:text-base lg:text-lg bg-burntAmber rounded-lg py-2 px-4 w-full text-warmBeige hover:bg-deepCopper active:scale-95 transition-all duration-200'>
                        Register
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
                    <p className='font-generalSans text-burntAmber text-xs md:text-sm lg:text-base text-center mt-2 md:mt-3 lg:mt-4 leading-5 md:leading-6 lg:leading-7 bg-deepGray border border-burntAmber rounded-lg py-2 px-3 md:py-2.5 md:px-4 lg:py-3 lg:px-5'>
                        {message}
                    </p>
                )}
                {error && (
                    <p className='font-generalSans text-deepCopper text-xs md:text-sm lg:text-base text-center mt-2 md:mt-3 lg:mt-4 leading-5 md:leading-6 lg:leading-7 bg-deepGray border border-deepCopper rounded-lg py-2 px-3 md:py-2.5 md:px-4 lg:py-3 lg:px-5'>
                        {error}
                    </p>
                )}
            </section>
        </main>
    )
}
