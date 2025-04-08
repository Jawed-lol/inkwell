import { Button } from "@/components/ui/button"
import ImageSlide from "@/components/landingPage/ImageSlide"
import Link from "next/link"

const imageSlider = [
    "/images/hero-book-cover.jpg",
    "/images/hero-book-cover-1.jpg",
    "/images/hero-book-cover-2.jpg",
    "/images/hero-book-cover-3.jpg",
    "/images/hero-book-cover-4.jpg",
    "/images/hero-book-cover-5.jpg",
    "/images/hero-book-cover-6.jpg",
    "/images/hero-book-cover-7.jpg",
]

const HeroSection = () => {
    return (
        <section
            className='w-full bg-[#1B1B1B] py-16 lg:py-24 flex items-center justify-center'
            role='region'
            aria-label='Hero Section - Discover Your Next Book'>
            <div className='container flex flex-col-reverse lg:flex-row gap-8 items-center text-center lg:text-left'>
                {/* Hero Text */}
                <div className='p-3 lg:p-8 flex flex-col gap-6 w-full lg:w-1/2'>
                    <h1 className='font-authorSans text-[#EAE0D5] font-bold text-[28px] md:text-[36px] lg:text-[48px] leading-[1.2] tracking-wide'>
                        Find Your Next Favorite Book
                    </h1>

                    <p className='font-generalSans text-[#BFB6A8] text-[16px] md:text-[18px] lg:text-[20px] leading-[1.6] lg:w-3/4'>
                        Discover a world of captivating stories with carefully
                        curated books. Whether you are looking for timeless
                        classics or exciting new releases, we have something for
                        every reader.
                    </p>

                    <Button
                        className='bg-[#D68C45] hover:bg-[#B36E30] text-[#252525] font-generalSans font-semibold text-[16px] md:text-[18px] px-6 py-3 rounded-[6px] shadow-[0px_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_6px_15px_rgba(0,0,0,0.3)]'
                        aria-label='Browse our complete collection of books'>
                        <Link href='/shop'>Browse Collection</Link>
                    </Button>
                </div>

                {/* Hero Image Slides */}
                <div
                    className='lg:block lg:w-1/2 relative'
                    aria-hidden='true'>
                    <figure className='rounded-lg overflow-hidden shadow-[0px_8px_20px_rgba(0,0,0,0.3)]'>
                        <ImageSlide imageSlider={imageSlider} />
                    </figure>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
