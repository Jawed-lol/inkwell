"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { authService } from "@/lib/api"
import { useRouter } from "next/navigation"

interface FormData {
    first_name: string
    second_name: string
    email: string
    password: string
    confirm_password: string
}

export default function Register() {
    const router = useRouter()
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

    // Set page title for SEO
    useEffect(() => {
        document.title = "Create Your Account | Inkwell"
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
        // Clear error when user starts typing
        if (error) setError(null)
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
            const response = await authService.register(
                formData.first_name,
                formData.second_name,
                formData.email,
                formData.password
            )

            if (response.success && response.token) {
                localStorage.setItem("token", response.token)
                setMessage(
                    "Account created successfully! Redirecting to login page..."
                )
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            } else {
                throw new Error(response.message || "Invalid response from server")
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

    // Schema.org structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": pageTitle,
        "description": pageDescription,
        "publisher": {
            "@type": "Organization",
            "name": "Inkwell",
            "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://inkwell-bookstore.com"}/images/weblogo.png`
            }
        },
        "potentialAction": {
            "@type": "RegisterAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://inkwell-bookstore.com"}/register`,
                "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                ]
            },
            "result": {
                "@type": "UserAccount"
            }
        }
    }

    return (
        <>
            {/* Hidden SEO content */}
            <div className="hidden">
                <h1>Create Your Account | Inkwell Bookstore</h1>
                <p>Join the Inkwell community to explore, discover, and discuss your favorite books. Sign up today and start your literary journey.</p>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData)
                    }}
                />
                <link
                    rel="canonical"
                    href={`${process.env.NEXT_PUBLIC_SITE_URL || "https://inkwell-bookstore.com"}/register`}
                />
            </div>

            <main
                className="flex min-h-screen items-center justify-center bg-charcoalBlack py-16 md:py-20 lg:py-24"
                aria-labelledby="registration-heading">
                <section className="flex w-full max-w-md flex-col items-center justify-center rounded-2xl bg-deepGray p-4 shadow-lg md:p-6 lg:p-8">
                    <Link 
                        href="/"
                        className="mb-6 focus:outline-none focus:ring-2 focus:ring-burntAmber rounded-lg"
                        aria-label="Return to Inkwell homepage">
                        <Image
                            src="/images/weblogo.png"
                            alt="Inkwell - Your book community"
                            height={50}
                            width={150}
                            priority
                        />
                    </Link>
                    <h2
                        id="registration-heading"
                        className="mb-2 text-center font-author text-lg font-bold text-warmBeige md:text-xl lg:text-2xl">
                        Create Your Account
                    </h2>
                    <p className="mb-6 text-center font-generalSans text-xs text-mutedSand md:text-sm lg:text-base">
                        Join our community and start exploring your favorite
                        books today.
                    </p>

                    {error && (
                        <div
                            className="mb-4 w-full rounded-lg border border-deepCopper bg-deepCopper/10 px-4 py-3 text-center font-generalSans text-xs text-deepCopper md:text-sm lg:text-base"
                            role="alert"
                            aria-live="assertive">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div
                            className="mb-4 w-full rounded-lg border border-burntAmber bg-burntAmber/10 px-4 py-3 text-center font-generalSans text-xs text-burntAmber md:text-sm lg:text-base"
                            role="status"
                            aria-live="polite">
                            {message}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="flex w-full flex-col gap-4"
                        aria-label="Registration form"
                        noValidate>
                        <div className="flex flex-col gap-4 md:flex-row md:gap-2">
                            <div className="flex w-full flex-col">
                                <label
                                    htmlFor="first_name"
                                    className="mb-1 text-sm font-bold text-warmBeige md:text-base">
                                    First Name
                                </label>
                                <input
                                    id="first_name"
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    aria-required="true"
                                    placeholder="Enter your first name"
                                    className="w-full rounded-lg border border-darkMocha bg-slightlyLightGrey px-3 py-2 text-xs text-mutedSand transition-colors duration-200 focus:border-burntAmber focus:outline-none focus:ring-2 focus:ring-burntAmber md:text-sm lg:text-base"
                                />
                            </div>

                            <div className="flex w-full flex-col">
                                <label
                                    htmlFor="second_name"
                                    className="mb-1 text-sm font-bold text-warmBeige md:text-base">
                                    Last Name
                                </label>
                                <input
                                    id="second_name"
                                    type="text"
                                    name="second_name"
                                    value={formData.second_name}
                                    onChange={handleChange}
                                    required
                                    aria-required="true"
                                    placeholder="Enter your last name"
                                    className="w-full rounded-lg border border-darkMocha bg-slightlyLightGrey px-3 py-2 text-xs text-mutedSand transition-colors duration-200 focus:border-burntAmber focus:outline-none focus:ring-2 focus:ring-burntAmber md:text-sm lg:text-base"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label
                                htmlFor="email"
                                className="mb-1 text-sm font-bold text-warmBeige md:text-base">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                aria-required="true"
                                autoComplete="email"
                                placeholder="your.email@example.com"
                                className="w-full rounded-lg border border-darkMocha bg-slightlyLightGrey px-3 py-2 text-xs text-mutedSand transition-colors duration-200 focus:border-burntAmber focus:outline-none focus:ring-2 focus:ring-burntAmber md:text-sm lg:text-base"
                            />
                        </div>

                        <div className="relative flex flex-col">
                            <label
                                htmlFor="password"
                                className="mb-1 text-sm font-bold text-warmBeige md:text-base">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    aria-required="true"
                                    autoComplete="new-password"
                                    minLength={8}
                                    placeholder="Create a secure password"
                                    className="w-full rounded-lg border border-darkMocha bg-slightlyLightGrey px-3 py-2 text-xs text-mutedSand transition-colors duration-200 focus:border-burntAmber focus:outline-none focus:ring-2 focus:ring-burntAmber md:text-sm lg:text-base"
                                    aria-describedby="password-requirements"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-mutedSand hover:text-burntAmber focus:outline-none focus:text-burntAmber"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }>
                                    <svg
                                        className="h-5 w-5 md:h-6 md:w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true">
                                        {showPassword ? (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21"
                                            />
                                        ) : (
                                            <>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </>
                                        )}
                                    </svg>
                                </button>
                            </div>
                            <p 
                                id="password-requirements"
                                className="mt-1 text-xs text-mutedSand">
                                Must be at least 8 characters
                            </p>
                        </div>

                        <div className="relative flex flex-col">
                            <label
                                htmlFor="confirm_password"
                                className="mb-1 text-sm font-bold text-warmBeige md:text-base">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirm_password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    required
                                    aria-required="true"
                                    autoComplete="new-password"
                                    minLength={8}
                                    placeholder="Confirm your password"
                                    className="w-full rounded-lg border border-darkMocha bg-slightlyLightGrey px-3 py-2 text-xs text-mutedSand transition-colors duration-200 focus:border-burntAmber focus:outline-none focus:ring-2 focus:ring-burntAmber md:text-sm lg:text-base"
                                    aria-describedby="confirm-password-hint"
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-mutedSand hover:text-burntAmber focus:outline-none focus:text-burntAmber"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }>
                                    <svg
                                        className="h-5 w-5 md:h-6 md:w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true">
                                        {showConfirmPassword ? (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21"
                                            />
                                        ) : (
                                            <>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </>
                                        )}
                                    </svg>
                                </button>
                            </div>
                            <p 
                                id="confirm-password-hint"
                                className="mt-1 text-xs text-mutedSand">
                                Must match your password
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-burntAmber px-4 py-2 font-author text-sm font-bold text-warmBeige transition-all duration-200 hover:bg-deepCopper active:scale-95 focus:outline-none focus:ring-2 focus:ring-burntAmber disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100 md:text-base lg:text-lg">
                            {isSubmitting ? "Creating Account..." : "Register"}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-xs text-mutedSand md:text-sm">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-burntAmber transition-colors duration-200 hover:text-deepCopper focus:outline-none focus:underline">
                            Sign In
                        </Link>
                    </p>
                </section>
            </main>
        </>
    )
}
