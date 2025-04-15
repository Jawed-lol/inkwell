import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { reviewService } from "@/lib/api"

interface ReviewProps {
    id: string | number
    user: string
    date: string
    rating: number
    text: string
}

interface AddReviewProps {
    productId: string
    onReviewAdded: () => void
}

const ReviewProduct = ({ id, user, rating, date, text }: ReviewProps) => {
    const displayName = user || "Anonymous";
    
    return (
        <motion.div
            key={id}
            whileHover={{ y: -5 }}
            className='bg-deepGray p-6 rounded-xl'
            role="article"
            aria-labelledby={`review-${id}-author`}
        >
            <div className='flex justify-between items-start mb-4'>
                <div>
                    <h3 id={`review-${id}-author`} className='text-warmBeige font-semibold mb-1'>
                        {displayName}
                    </h3>
                    <time dateTime={new Date(date).toISOString()} className='text-mutedSand text-sm'>
                        {date}
                    </time>
                </div>
                <div className='flex gap-1' aria-label={`Rating: ${rating} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={16}
                            className='text-warmBeige'
                            fill={i < rating ? "#D97706" : "none"}
                            aria-hidden="true"
                        />
                    ))}
                </div>
            </div>
            <p className='text-mutedSand'>{text || "No comment provided."}</p>
        </motion.div>
    )
}

export const AddReview = ({ productId, onReviewAdded }: AddReviewProps) => {
    const { isAuthenticated } = useAuth()
    const [rating, setRating] = useState<number>(0)
    const [hoverRating, setHoverRating] = useState<number>(0)
    const [reviewText, setReviewText] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [success, setSuccess] = useState<boolean>(false)
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (rating === 0) {
            setError("Please select a rating");
            return;
        }
        
        if (!reviewText.trim()) {
            setError("Please enter your review");
            return;
        }
        
        setIsSubmitting(true);
        setError("");
        
        try {
            await reviewService.submitReview(productId, rating, reviewText);
            
            setSuccess(true);
            setReviewText("");
            setRating(0);
            onReviewAdded();
            
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-deepGray p-6 rounded-xl mt-6" role="alert">
                <p className="text-warmBeige text-center">
                    Please <a href="/login" className="text-burntAmber hover:text-deepCopper underline focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-2 focus:ring-offset-deepGray">log in</a> to leave a review.
                </p>
            </div>
        )
    }

    const renderStars = () => (
        <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none focus:ring-2 focus:ring-burntAmber p-1"
                    aria-label={`Rate ${i + 1} star${i !== 0 ? 's' : ''}`}
                    aria-pressed={rating === i + 1}
                >
                    <Star
                        size={24}
                        className="text-warmBeige transition-colors"
                        fill={(hoverRating || rating) > i ? "#D97706" : "none"}
                        aria-hidden="true"
                    />
                </button>
            ))}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-deepGray p-6 rounded-xl mt-6'
            role="form"
            aria-labelledby="review-form-title"
        >
            <h3 id="review-form-title" className='text-warmBeige font-semibold mb-4 text-lg'>Write a Review</h3>
            
            {success && (
                <div className="bg-green-800 bg-opacity-20 border border-green-700 text-green-300 p-3 rounded-lg mb-4" role="alert" aria-live="polite">
                    Your review has been submitted successfully!
                </div>
            )}
            
            {error && (
                <div className="bg-red-800 bg-opacity-20 border border-red-700 text-red-300 p-3 rounded-lg mb-4" role="alert" aria-live="assertive">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                    <fieldset>
                        <legend className="block text-warmBeige mb-2">Your Rating (required)</legend>
                        {renderStars()}
                    </fieldset>
                </div>
                
                <div className="mb-4">
                    <label htmlFor="reviewText" className="block text-warmBeige mb-2">
                        Your Review (required)
                    </label>
                    <textarea
                        id="reviewText"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full bg-charcoalBlack text-warmBeige border border-mutedSand rounded-lg p-3 min-h-[120px] focus:outline-none focus:border-burntAmber focus:ring-2 focus:ring-burntAmber"
                        placeholder="Share your thoughts about this book..."
                        aria-required="true"
                        aria-invalid={error && !reviewText.trim() ? "true" : "false"}
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-burntAmber text-darkMutedTeal font-bold py-2 px-6 rounded-lg hover:bg-deepCopper transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-offset-2 focus:ring-offset-deepGray"
                    aria-busy={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
            </form>
        </motion.div>
    )
}

export default ReviewProduct
