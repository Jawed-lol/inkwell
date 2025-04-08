import { motion } from "framer-motion"
import { Star } from "lucide-react"

interface ReviewProps {
    id: string | number
    author: string
    date: string
    rating: number
    text: string
}

const ReviewProduct = ({ id, author, rating, date, text }: ReviewProps) => {
    return (
        <motion.div
            key={id}
            whileHover={{ y: -5 }}
            className='bg-deepGray p-6 rounded-xl'>
            <div className='flex justify-between items-start mb-4'>
                <div>
                    <h3 className='text-warmBeige font-semibold mb-1'>
                        {author || "Anonymous"}
                    </h3>
                    <span className='text-mutedSand text-sm'>{date}</span>
                </div>
                <div className='flex gap-1'>
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={16}
                            className='text-warmBeige'
                            fill={i < rating ? "#D97706" : "none"}
                        />
                    ))}
                </div>
            </div>
            <p className='text-mutedSand'>{text || "No comment provided."}</p>
        </motion.div>
    )
}

export default ReviewProduct
