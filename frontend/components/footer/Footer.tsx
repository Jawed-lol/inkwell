import Link from "next/link"
import {
    FaInstagram,
    FaTwitter,
    FaFacebook,
    FaPaypal,
    FaStripe,
    FaCcMastercard,
} from "react-icons/fa"
import Image from "next/image"

const quickLinks = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms Of Service", href: "/terms-of-service" },
    { label: "Return Policy", href: "/return-policy" },
    { label: "FAQs", href: "/faqs" },
]

const Footer = () => {
    return (
        <footer className='w-full bg-charcoalBlack'>
            <div className='p-6 bg-deepGray md:p-8 lg:py-12 lg:px-16'>
                <div className='grid mx-auto container gap-6 md:grid-cols-2 md:gap-x-4 md:gap-y-6 lg:grid-cols-4 lg:gap-8 border-b border-charcoalBlack pb-2'>
                    {/* Column 1: Logo & Description */}
                    <div>
                        <Image
                            src='/images/weblogo.png'
                            alt='Inkwell Bookstore Logo'
                            height={24}
                            width={24}
                            aria-label='Inkwell Bookstore Logo'
                            className='w-8 h-auto mb-4 md:w-10  lg:w-12 '
                        />
                        <p
                            className='font-generalSans text-[10px] leading-3 text-mutedSand md:text-[12px] md:leading-4 lg:text-[14px] lg:leading-5 w-[80%]'
                            aria-label='Inkwell Bookstore Description'>
                            A place where stories come alive and every page is
                            an adventure.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h5
                            className='font-author font-bold text-[12px] text-warmBeige mb-2 md:text-[14px] lg:text-[16px]'
                            id='quick-links-title'>
                            Quick Links
                        </h5>
                        <nav
                            aria-labelledby='quick-links-title'
                            className='flex flex-col gap-2'>
                            {quickLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className='font-generalSans text-[10px] text-burntAmber md:text-[12px] lg:text-[14px] hover:text-deepCopper focus:outline-none focus-visible:ring-2 focus-visible:ring-deepCopper md:pl-4 lg:pl-8'>
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Column 3: Contact Information */}
                    <div>
                        <h5
                            className='font-author font-bold text-[12px] text-warmBeige mb-2 md:text-[14px] lg:text-[16px]'
                            id='contact-info-title'>
                            Contact Us
                        </h5>
                        <address
                            aria-labelledby='contact-info-title'
                            className='font-generalSans text-[10px] text-mutedSand leading-3 md:text-[12px] lg:text-[14px] md:leading-4 lg:leading-5 md:pl-4 lg:pl-8'>
                            <p>123 Book Lane, Reading City, State ZIP</p>
                            <p>+1 (123) 456-7890</p>
                            <p>info@inkwell.com</p>
                        </address>
                    </div>

                    {/* Column 4: Social Media & Payment Methods */}
                    <div>
                        <div className='flex pb-4 gap-4'>
                            <a
                                href='#'
                                aria-label='Follow us on Instagram'
                                className='text-burntAmber hover:text-deepCopper focus:outline-none focus-visible:ring-2 focus-visible:ring-deepCopper w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6'>
                                <FaInstagram />
                            </a>
                            <a
                                href='#'
                                aria-label='Follow us on Twitter'
                                className='text-burntAmber hover:text-deepCopper focus:outline-none focus-visible:ring-2 focus-visible:ring-deepCopper w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6'>
                                <FaTwitter />
                            </a>
                            <a
                                href='#'
                                aria-label='Follow us on Facebook'
                                className='text-burntAmber hover:text-deepCopper focus:outline-none focus-visible:ring-2 focus-visible:ring-deepCopper w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6'>
                                <FaFacebook />
                            </a>
                        </div>
                        <div className='flex gap-4'>
                            <span
                                aria-label='We accept PayPal'
                                className='text-white w-6 h-6 md:w-9 md:h-9 lg:w-12 lg:h-12'>
                                <FaPaypal />
                            </span>
                            <span
                                aria-label='We accept Stripe'
                                className='text-white w-6 h-6 md:w-9 md:h-9 lg:w-12 lg:h-12'>
                                <FaStripe />
                            </span>
                            <span
                                aria-label='We accept Mastercard'
                                className='text-white w-6 h-6 md:w-9 md:h-9 lg:w-12 lg:h-12'>
                                <FaCcMastercard />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='py-1 rounded text-center justify-center items-center h-6 w-full flex md:h-8 lg:h-10 md:py-1.5 lg:py-2'>
                    <p
                        className='font-generalSans text-[8px] text-mutedSand md:text-[10px] lg:text-[12px]'
                        aria-label='Copyright Notice'>
                        © 2024 Inkwell Bookstore. All rights reserved.
                    </p>
                </div>
                <div className='flex justify-end'>
                    <span className='font-generalSans text-[8px] text-mutedSand md:text-[10px] lg:text-[12px] text-right'>
                        Created By Jawed-lol
                    </span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
