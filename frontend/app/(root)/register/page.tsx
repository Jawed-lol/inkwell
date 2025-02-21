"use client"

import Image from "next/image"
import Link from "next/link"
import { registerUser } from "@/lib/api"
import { useState } from "react"

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
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
            const result = await registerUser(
                formData.name,
                formData.surname,
                formData.email,
                formData.password
            )
            console.log("Registration result:", result) // Log successful response
            setMessage(
                "Account created successfully! Redirecting to login page..."
            )
            // Optional: Redirect after a delay
            setTimeout(() => (window.location.href = "/login"), 2000)
        } catch (err) {
            console.error("Registration error:", err) // Log the error
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("An unknown error occurred")
            }
        }
    }

    return (
        <main className='bg-charcoalBlack py-20 lg:py-24 flex justify-center items-center'>
            <section className='p-6 max-w-[480px] bg-deepGray rounded-2xl md:p-8 lg:p-12 flex flex-col items-center justify-center shadow-lg'>
                <Image
                    src='/images/weblogo.png'
                    alt='Inkwell Logo'
                    height={50}
                    width={150}
                    className='mb-6'
                />
                <h1 className='text-center font-author font-bold text-xl text-warmBeige lg:text-2xl'>
                    Create Your Account
                </h1>
                <h3 className='font-generalSans text-center text-sm text-mutedSand lg:text-base mb-6'>
                    Join our community and start exploring your favorite books
                    today.
                </h3>

                <form
                    onSubmit={handleSubmit}
                    className='w-full flex flex-col'>
                    {/* Name & Surname */}
                    <div className='flex flex-col lg:flex-row lg:gap-2'>
                        <div className='flex flex-col w-full'>
                            <label
                                htmlFor='name'
                                className='text-warmBeige font-bold text-sm mb-2'>
                                Name
                            </label>
                            <input
                                id='name'
                                type='text'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                required
                                aria-label='Enter your first name'
                                className={
                                    "input-style bg-slightlyLightGrey border border-darkMocha rounded-[8px] font-generalSans text-mutedSand mb-4 text-[12px] md:text-[14px] lg:text-[16px] py-2 px-2.5 w-full md:py-2.5 lg:py-3 md:px-3 lg:px-4 " +
                                    "focus:border-burntAmber focus:outline-none"
                                }
                            />
                        </div>

                        <div className='flex flex-col w-full'>
                            <label
                                htmlFor='surname'
                                className='text-warmBeige font-bold text-sm mb-2'>
                                Surname
                            </label>
                            <input
                                id='surname'
                                type='text'
                                name='surname'
                                value={formData.surname}
                                onChange={handleChange}
                                required
                                aria-label='Enter your last name'
                                className={
                                    "input-style bg-slightlyLightGrey border border-darkMocha rounded-[8px] font-generalSans text-mutedSand mb-4 text-[12px] md:text-[14px] lg:text-[16px] py-2 px-2.5 w-full md:py-2.5 lg:py-3 md:px-3 lg:px-4 " +
                                    "focus:border-burntAmber focus:outline-none"
                                }
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <label
                        htmlFor='email'
                        className='text-warmBeige font-bold text-sm mb-2'>
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
                        className={
                            "input-style bg-slightlyLightGrey border border-darkMocha rounded-[8px] font-generalSans text-mutedSand mb-4 text-[12px] md:text-[14px] lg:text-[16px] py-2 px-2.5 w-full md:py-2.5 lg:py-3 md:px-3 lg:px-4 " +
                            "focus:border-burntAmber focus:outline-none"
                        }
                    />

                    {/* Password */}
                    <label
                        htmlFor='password'
                        className='text-warmBeige font-bold text-sm mb-2'>
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
                        className={
                            "input-style bg-slightlyLightGrey border border-darkMocha rounded-[8px] font-generalSans text-mutedSand mb-4 text-[12px] md:text-[14px] lg:text-[16px] py-2 px-2.5 w-full md:py-2.5 lg:py-3 md:px-3 lg:px-4 " +
                            "focus:border-burntAmber focus:outline-none"
                        }
                    />

                    <button
                        type='submit'
                        className={
                            "btn-primary font-author font-bold text-[14px] leading-4 bg-burntAmber rounded-[8px] py-2 px-4 w-full text-warmBeige mb-4 md:text-[16px] md:leading-5 md:py-2.5 md:px-5 lg:text-lg lg:leading-6 lg:py-3 lg:px-6 " +
                            "hover:bg-deepCopper active:scale-95 transform duration-100"
                        }>
                        Register
                    </button>
                </form>

                <p className='text-burntAmber text-sm text-center'>
                    Already have an account?{" "}
                    <Link
                        href='/login'
                        className='hover:text-deepCopper'>
                        Sign In
                    </Link>
                </p>
                {message && (
                    <p className='text-center mt-4 text-green-500'>{message}</p>
                )}
                {error && (
                    <p className='text-center mt-4 text-red-500'>{error}</p>
                )}
            </section>
        </main>
    )
}
