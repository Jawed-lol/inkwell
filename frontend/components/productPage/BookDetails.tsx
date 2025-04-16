import { motion, useReducedMotion } from "framer-motion"
import { BookCopy, User, Building, Globe, FileText, Hash } from "lucide-react"
import { useState, useEffect } from "react"

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
    const prefersReducedMotion = useReducedMotion()
    const [isMounted, setIsMounted] = useState(false)
    
    // Only enable animations after component is mounted on client
    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }

    return (
        <motion.section
            initial={!isMounted || prefersReducedMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="bg-deepGray py-16"
            aria-labelledby="book-details-heading">
            <div className="container mx-auto px-4">
                <h2 
                    id="book-details-heading"
                    className="font-author text-warmBeige text-3xl mb-8">
                    Book Details
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div 
                        className="bg-charcoalGray bg-opacity-50 p-6 rounded-xl"
                        aria-labelledby="synopsis-heading">
                        <h3 
                            id="synopsis-heading"
                            className="text-warmBeige font-semibold mb-4 flex items-center gap-2">
                            <BookCopy size={20} aria-hidden="true" />
                            Synopsis
                        </h3>
                        <p className="text-mutedSand">{synopsis}</p>
                    </div>
                    <div 
                        className="bg-charcoalGray bg-opacity-50 p-6 rounded-xl"
                        aria-labelledby="author-heading">
                        <h3 
                            id="author-heading"
                            className="text-warmBeige font-semibold mb-4 flex items-center gap-2">
                            <User size={20} aria-hidden="true" />
                            About the Author
                        </h3>
                        <p className="text-mutedSand">{aboutAuthor}</p>
                    </div>
                    <div 
                        className="bg-charcoalGray bg-opacity-50 p-6 rounded-xl"
                        aria-labelledby="publication-heading">
                        <h3 
                            id="publication-heading"
                            className="text-warmBeige font-semibold mb-4 flex items-center gap-2">
                            <FileText size={20} aria-hidden="true" />
                            Publication Details
                        </h3>
                        <dl className="text-mutedSand space-y-2">
                            <div className="flex items-start">
                                <dt className="flex items-center gap-2 min-w-[120px]">
                                    <Building size={16} aria-hidden="true" />
                                    <span>Publisher:</span>
                                </dt>
                                <dd>{publisher}</dd>
                            </div>
                            <div className="flex items-start">
                                <dt className="flex items-center gap-2 min-w-[120px]">
                                    <Globe size={16} aria-hidden="true" />
                                    <span>Language:</span>
                                </dt>
                                <dd>{language}</dd>
                            </div>
                            <div className="flex items-start">
                                <dt className="flex items-center gap-2 min-w-[120px]">
                                    <BookCopy size={16} aria-hidden="true" />
                                    <span>Pages:</span>
                                </dt>
                                <dd>{pages_number}</dd>
                            </div>
                            <div className="flex items-start">
                                <dt className="flex items-center gap-2 min-w-[120px]">
                                    <Hash size={16} aria-hidden="true" />
                                    <span>ISBN:</span>
                                </dt>
                                <dd>{isbn}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

export default BookDetailsSectionProduct
