import { motion } from "framer-motion"
import { BookCopy } from "lucide-react"

interface BookDetailsProps {
    synopsis: string
    aboutAuthor: string
    publisher: string
    language: string
    pages_number: number
    isbn: string
}

const BookDetailsSectionProduct = ({
    synopsis,
    aboutAuthor,
    publisher,
    language,
    pages_number,
    isbn,
}: BookDetailsProps) => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }

    return (
        <motion.section
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeIn}
            className='bg-deepGray py-16'>
            <div className='container mx-auto px-4'>
                <h2 className='font-author text-warmBeige text-3xl mb-8'>
                    Book Details
                </h2>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    <div className='bg-charcoalGray bg-opacity-50 p-6 rounded-xl'>
                        <h3 className='text-warmBeige font-semibold mb-4 flex items-center gap-2'>
                            <BookCopy size={20} />
                            Synopsis
                        </h3>
                        <p className='text-mutedSand'>{synopsis}</p>
                    </div>
                    <div className='bg-charcoalGray bg-opacity-50 p-6 rounded-xl'>
                        <h3 className='text-warmBeige font-semibold mb-4'>
                            About the Author
                        </h3>
                        <p className='text-mutedSand'>{aboutAuthor}</p>
                    </div>
                    <div className='bg-charcoalGray bg-opacity-50 p-6 rounded-xl'>
                        <h3 className='text-warmBeige font-semibold mb-4'>
                            Publication Details
                        </h3>
                        <ul className='text-mutedSand space-y-2'>
                            <li>Publisher: {publisher}</li>
                            <li>Language: {language}</li>
                            <li>Paperback: {pages_number} pages</li>
                            <li>ISBN: {isbn}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

export default BookDetailsSectionProduct
