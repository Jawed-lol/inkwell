"use client"

import dynamic from 'next/dynamic'
import Link from "next/link"
import { motion } from "framer-motion"

// Dynamically import ImageSlide with no SSR to prevent hydration errors
const ImageSlide = dynamic(
  () => import("@/components/landingPage/ImageSlide"),
  { ssr: false }
)

// Add descriptive alt text for each image
const imageSlider = [
    {
        src: "/images/hero-book-cover.jpg",
        alt: "Featured book: The Silent Echo by Sarah Johnson"
    },
    {
        src: "/images/hero-book-cover-1.jpg",
        alt: "Featured book: Midnight Dreams by Michael Roberts"
    },
    {
        src: "/images/hero-book-cover-2.jpg",
        alt: "Featured book: The Lost Garden by Emily Chen"
    },
    {
        src: "/images/hero-book-cover-3.jpg",
        alt: "Featured book: Beyond the Horizon by David Wilson"
    },
    {
        src: "/images/hero-book-cover-4.jpg",
        alt: "Featured book: Whispers in the Dark by Sophia Martinez"
    },
    {
        src: "/images/hero-book-cover-5.jpg",
        alt: "Featured book: The Last Journey by James Thompson"
    },
    {
        src: "/images/hero-book-cover-6.jpg",
        alt: "Featured book: Eternal Flames by Rebecca Anderson"
    },
    {
        src: "/images/hero-book-cover-7.jpg",
        alt: "Featured book: The Hidden Truth by Thomas Parker"
    },
]

const HeroSection = () => {
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    }

    return (
        <section
            className='w-full bg-[#1B1B1B] py-16 lg:py-24 flex items-center justify-center'
            aria-labelledby='hero-heading'>
            <div className='container flex flex-col-reverse lg:flex-row gap-8 items-center text-center lg:text-left'>
                {/* Hero Text */}
                <motion.div 
                    className='p-3 lg:p-8 flex flex-col gap-6 w-full lg:w-1/2'
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <h1 
                        id='hero-heading'
                        className='font-authorSans text-[#EAE0D5] font-bold text-[28px] md:text-[36px] lg:text-[48px] leading-[1.2] tracking-wide'
                    >
                        Find Your Next Favorite Book
                    </h1>

                    <p className='font-generalSans text-[#BFB6A8] text-[16px] md:text-[18px] lg:text-[20px] leading-[1.6] lg:w-3/4'>
                        Discover a world of captivating stories with carefully
                        curated books. Whether you are looking for timeless
                        classics or exciting new releases, we have something for
                        every reader.
                    </p>

                    <Link 
                        href='/shop'
                        className='bg-[#D68C45] hover:bg-[#B36E30] text-[#252525] font-generalSans font-semibold text-[16px] md:text-[18px] px-6 py-3 rounded-[6px] shadow-[0px_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_6px_15px_rgba(0,0,0,0.3)] inline-flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D68C45] focus:ring-opacity-50 w-full sm:w-auto'
                        aria-label='Browse our complete collection of books'
                    >
                        Browse Collection
                    </Link>
                </motion.div>

                {/* Hero Image Slides */}
                <motion.div
                    className='lg:block lg:w-1/2 relative'
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <figure 
                        className='rounded-lg overflow-hidden shadow-[0px_8px_20px_rgba(0,0,0,0.3)]'
                        aria-label='Featured book covers slideshow'
                    >
                        <ImageSlide imageSlider={imageSlider} />
                    </figure>
                </motion.div>
            </div>
        </section>
    )
}

export default HeroSection
