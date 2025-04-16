import { motion } from "framer-motion"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface RelatedBookProps {
    id: string 
    title: string
    coverPath: string
    rating: number
    author: string
}

const RelatedBook = ({
    id,
    title,
    coverPath,
    rating,
    author,
}: RelatedBookProps) => {
    return (
        <Link href={`/book/${id}`}>
            <motion.div
                key={id}
                whileHover={{ y: -5 }}
                className='bg-charcoalGray bg-opacity-50 p-4 rounded-xl group cursor-pointer'>
                <div className='relative mb-4'>
                    <Image
                        src={coverPath || "/placeholder.svg"}
                        alt={title || "Book cover"}
                        width={200}
                        height={300}
                        className='w-full rounded-lg shadow-lg group-hover:shadow-[0_0_20px_rgba(217,119,6,0.2)] transition-all duration-300'
                    />
                    <div className='absolute top-2 right-2 bg-charcoalBlack bg-opacity-90 px-2 py-1 rounded-md flex items-center gap-1'>
                        <Star
                            size={14}
                            className='text-warmBeige'
                            fill='#D97706'
                        />
                        <span className='text-warmBeige text-sm'>
                            {rating.toFixed(1) || "N/A"}
                        </span>
                    </div>
                </div>
                <h3 className='text-warmBeige font-semibold mb-1 group-hover:text-opacity-80 transition-colors'>
                    {title || "Untitled"}
                </h3>
                <p className='text-mutedSand text-sm'>
                    {author || "Unknown Author"}
                </p>
            </motion.div>
        </Link>
    )
}

export default RelatedBook
