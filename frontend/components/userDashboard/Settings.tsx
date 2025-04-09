"use client"

import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { getProfile, updateProfile } from "@/lib/api"

interface ProfileFormData {
    firstName: string
    lastName: string
    email: string
}

interface ProfileResponse {
    name?: string
    firstName?: string
    first_name?: string
    lastName?: string
    last_name?: string
    email?: string
    userEmail?: string
    user_email?: string
    [key: string]: unknown
}

interface ProfileUpdatePayload {
    firstName: string
    lastName: string
    email: string
    name: string
}

export default function Settings() {
    const { token } = useAuth()
    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: "",
        lastName: "",
        email: "",
    })
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        if (token) {
            const fetchProfile = async () => {
                try {
                    const responseData = (await getProfile(
                        token
                    )) as unknown as ProfileResponse

                    setFormData({
                        firstName:
                            responseData.firstName ||
                            responseData.first_name ||
                            responseData.name?.split(" ")[0] ||
                            "",
                        lastName:
                            responseData.lastName ||
                            responseData.last_name ||
                            responseData.name?.split(" ")[1] ||
                            "",
                        email:
                            responseData.email ||
                            responseData.userEmail ||
                            responseData.user_email ||
                            "",
                    })
                } catch (error) {
                    console.error("Error fetching profile:", error)
                    setError("Failed to load profile data")
                }
            }
            fetchProfile()
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        try {
            const updatePayload: ProfileUpdatePayload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
            }

            const updatedData = (await updateProfile(
                token!,
                updatePayload as unknown as Record<string, unknown>
            )) as unknown as ProfileResponse

            setFormData({
                firstName:
                    updatedData.firstName ||
                    updatedData.first_name ||
                    updatedData.name?.split(" ")[0] ||
                    formData.firstName,
                lastName:
                    updatedData.lastName ||
                    updatedData.last_name ||
                    updatedData.name?.split(" ")[1] ||
                    formData.lastName,
                email:
                    updatedData.email ||
                    updatedData.userEmail ||
                    updatedData.user_email ||
                    formData.email,
            })

            setSuccess("Profile updated successfully!")
        } catch (error) {
            console.error("Error updating profile:", error)
            setError("Failed to update profile")
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className='w-full max-w-2xl mx-auto bg-deepGray p-4 sm:p-6 rounded-lg shadow-lg'>
            <h2 className='text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center text-warmBeige'>
                Account Settings
            </h2>
            <form
                onSubmit={handleSubmit}
                className='space-y-4 sm:space-y-6'>
                <div>
                    <label className='block text-mutedSand text-sm sm:text-base mb-1'>
                        First Name
                    </label>
                    <input
                        type='text'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        className='w-full sm:w-1/2 p-2 bg-slightlyLightGrey border border-darkMocha rounded text-warmBeige focus:outline-none focus:ring-2 focus:ring-burntAmber text-sm sm:text-base'
                        placeholder='Your First Name'
                    />
                </div>
                <div>
                    <label className='block text-mutedSand text-sm sm:text-base mb-1'>
                        Last Name
                    </label>
                    <input
                        type='text'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        className='w-full sm:w-1/2 p-2 bg-slightlyLightGrey border border-darkMocha rounded text-warmBeige focus:outline-none focus:ring-2 focus:ring-burntAmber text-sm sm:text-base'
                        placeholder='Your Last Name'
                    />
                </div>
                <div>
                    <label className='block text-mutedSand text-sm sm:text-base mb-1'>
                        Email
                    </label>
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        className='w-full sm:w-1/2 p-2 bg-slightlyLightGrey border border-darkMocha rounded text-warmBeige focus:outline-none focus:ring-2 focus:ring-burntAmber text-sm sm:text-base'
                        placeholder='Your Email'
                    />
                </div>
                {error && (
                    <p className='text-deepCopper text-sm sm:text-base'>
                        {error}
                    </p>
                )}
                {success && (
                    <p className='text-burntAmber text-sm sm:text-base'>
                        {success}
                    </p>
                )}
                <button
                    type='submit'
                    className='w-full sm:w-auto px-4 py-2 bg-burntAmber text-darkMutedTeal rounded hover:bg-deepCopper transition-colors text-sm sm:text-base font-semibold'>
                    Save Changes
                </button>
            </form>
        </div>
    )
}
