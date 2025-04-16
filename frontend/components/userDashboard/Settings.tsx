"use client"

import { useAuth } from "@/context/AuthContext"
import { useState, useEffect, useId } from "react"
import { authService } from "@/lib/api"
import { Save, AlertCircle, CheckCircle } from "lucide-react"

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
    const [isLoading, setIsLoading] = useState(false)
    
    // Generate unique IDs for form elements
    const formId = useId()
    const firstNameId = useId()
    const lastNameId = useId()
    const emailId = useId()
    const statusId = useId()

    useEffect(() => {
        if (token) {
            const fetchProfile = async () => {
                setIsLoading(true)
                try {
                    const response = await authService.getProfile(token)
                    
                    // Check if response exists and has necessary data
                    if (!response || typeof response !== 'object') {
                        throw new Error("Failed to load profile")
                    }
                    
                    // Use response directly
                    const responseData = response as ProfileResponse

                    setFormData({
                        firstName:
                            responseData.firstName ||
                            responseData.first_name ||
                            (responseData.name && typeof responseData.name === 'string' ? responseData.name.split(" ")[0] : "") ||
                            "",
                        lastName:
                            responseData.lastName ||
                            responseData.last_name ||
                            (responseData.name && typeof responseData.name === 'string' ? responseData.name.split(" ")[1] : "") ||
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
                } finally {
                    setIsLoading(false)
                }
            }
            fetchProfile()
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setIsLoading(true)

        try {
            const updatePayload: ProfileUpdatePayload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
            }

            const response = await authService.updateProfile(token!, updatePayload)
            
            if (!response || response.success === false) {
                throw new Error("Failed to update profile")
            }
            
            // Update form data with response values or keep current values
            setFormData({
                firstName:  
                    (response.name ? response.name.split(" ")[0] : "") || 
                    formData.firstName,
                lastName:
                    (response.name ? response.name.split(" ")[1] : "") || 
                    formData.lastName,
                email:
                    response.email || 
                    formData.email,
            })

            setSuccess("Profile updated successfully!")
        } catch (error) {
            console.error("Error updating profile:", error)
            setError("Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <section 
            className="w-full max-w-2xl mx-auto bg-deepGray p-4 sm:p-6 rounded-lg shadow-lg"
            aria-labelledby="settings-heading">
            <h1 
                id="settings-heading"
                className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center text-warmBeige">
                Account Settings
            </h1>
            
            {isLoading && !formData.email && (
                <div 
                    className="text-center p-4" 
                    role="status" 
                    aria-live="polite">
                    <div className="animate-pulse">
                        Loading your profile information...
                    </div>
                </div>
            )}
            
            <form
                id={formId}
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-6"
                aria-describedby={error || success ? statusId : undefined}>
                <div className="grid gap-4 sm:gap-6">
                    <div>
                        <label 
                            htmlFor={firstNameId} 
                            className="block text-mutedSand text-sm sm:text-base mb-1">
                            First Name
                        </label>
                        <input
                            type="text"
                            id={firstNameId}
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full p-2 bg-slightlyLightGrey border border-darkMocha rounded text-warmBeige focus:outline-none focus:ring-2 focus:ring-burntAmber text-sm sm:text-base"
                            placeholder="Your First Name"
                            aria-required="true"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div>
                        <label 
                            htmlFor={lastNameId} 
                            className="block text-mutedSand text-sm sm:text-base mb-1">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id={lastNameId}
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full p-2 bg-slightlyLightGrey border border-darkMocha rounded text-warmBeige focus:outline-none focus:ring-2 focus:ring-burntAmber text-sm sm:text-base"
                            placeholder="Your Last Name"
                            aria-required="true"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div>
                        <label 
                            htmlFor={emailId} 
                            className="block text-mutedSand text-sm sm:text-base mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id={emailId}
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 bg-slightlyLightGrey border border-darkMocha rounded text-warmBeige focus:outline-none focus:ring-2 focus:ring-burntAmber text-sm sm:text-base"
                            placeholder="Your Email"
                            aria-required="true"
                            disabled={isLoading}
                        />
                    </div>
                </div>
                
                {(error || success) && (
                    <div 
                        id={statusId}
                        className={`p-3 rounded ${error ? 'bg-red-900 bg-opacity-20' : 'bg-green-900 bg-opacity-20'}`}
                        role={error ? "alert" : "status"}
                        aria-live="polite">
                        <div className="flex items-center gap-2">
                            {error ? (
                                <AlertCircle size={18} className="text-deepCopper" aria-hidden="true" />
                            ) : (
                                <CheckCircle size={18} className="text-burntAmber" aria-hidden="true" />
                            )}
                            <p className={`text-sm sm:text-base ${error ? 'text-deepCopper' : 'text-burntAmber'}`}>
                                {error || success}
                            </p>
                        </div>
                    </div>
                )}
                
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-burntAmber text-darkMutedTeal rounded hover:bg-deepCopper transition-colors text-sm sm:text-base font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-2 focus:ring-offset-deepGray disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}>
                        <Save size={18} aria-hidden="true" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </section>
    )
}
