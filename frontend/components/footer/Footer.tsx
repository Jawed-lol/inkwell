import Link from "next/link"
import {
    FaInstagram,
    FaTwitter,
    FaFacebook,
    FaPaypal,
    FaStripe,
    FaCcMastercard,
} from "react-icons/fa"
import { Image } from "@imagekit/next"

// Define links in a more structured way for better maintainability
const quickLinks = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms Of Service", href: "/terms-of-service" },
    { label: "Return Policy", href: "/return-policy" },
    { label: "FAQs", href: "/faqs" },
]

const socialLinks = [
    { platform: "Instagram", href: "https://instagram.com/inkwellbooks", icon: FaInstagram },
    { platform: "Twitter", href: "https://twitter.com/inkwellbooks", icon: FaTwitter },
    { platform: "Facebook", href: "https://facebook.com/inkwellbooks", icon: FaFacebook },
]

const paymentMethods = [
    { name: "PayPal", icon: FaPaypal },
    { name: "Stripe", icon: FaStripe },
    { name: "Mastercard", icon: FaCcMastercard },
]

const Footer = () => {
    const currentYear = new Date().getFullYear()
    
    return (
        <footer className='w-full bg-charcoalBlack' role="contentinfo" aria-label="Site footer">
            <div className='p-6 bg-deepGray md:p-8 lg:py-12 lg:px-16'>
                <div className='grid mx-auto container gap-6 md:grid-cols-2 md:gap-x-4 md:gap-y-6 lg:grid-cols-4 lg:gap-8 border-b border-charcoalBlack pb-2'>
                    {/* Column 1: Logo & Description */}
                    <div>
                        <Link href="/" aria-label="Go to Inkwell Bookstore homepage">
                            <Image
                                urlEndpoint="https://ik.imagekit.io/25fqnetuz"
                                src='/Inkwell/weblogo.png'
                                alt='Inkwell Bookstore'
                                height={48}
                                width={48}
                                className='w-8 h-auto mb-4 md:w-10 lg:w-12'
                                priority
                            />
                        </Link>
                        <p
                            className='font-generalSans text-[10px] leading-3 text-mutedSand md:text-[12px] md:leading-4 lg:text-[14px] lg:leading-5 w-[80%]'>
                            A place where stories come alive and every page is
                            an adventure.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h2
                            className='font-author font-bold text-[12px] text-warmBeige mb-2 md:text-[14px] lg:text-[16px]'
                            id='quick-links-title'>
                            Quick Links
                        </h2>
                        <nav
                            aria-labelledby='quick-links-title'
                            className='flex flex-col gap-2'>
                            {quickLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className='font-generalSans text-[10px] text-burntAmber md:text-[12px] lg:text-[14px] hover:text-deepCopper focus:outline-none focus-visible:ring-2 focus-visible:ring-deepCopper md:pl-4 lg:pl-8 transition-colors duration-200'>
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Column 3: Contact Information */}
                    <div>
                        <h2
                            className='font-author font-bold text-[12px] text-warmBeige mb-2 md:text-[14px] lg:text-[16px]'
                            id='contact-info-title'>
                            Contact Us
                        </h2>
                        <address
                            aria-labelledby='contact-info-title'
                            className='font-generalSans text-[10px] text-mutedSand leading-3 md:text-[12px] lg:text-[14px] md:leading-4 lg:leading-5 md:pl-4 lg:pl-8 not-italic'>
                            <p className="mb-1">123 Book Lane, Reading City, State ZIP</p>
                            <p className="mb-1">
                                <a href="tel:+11234567890" className="hover:text-burntAmber focus:outline-none focus-visible:ring-2 focus-visible:ring-deepCopper transition-colors duration-200">
                                    +1 (123) 456-7890
                                </a>
                            </p>
                            <p>
                                <a href="mailto:info@inkwell.com" className="hover:text-burntAmber focus:outline-none focus-visible:ring-2 focus-visible:ring-deepCopper transition-colors duration-200">
                                    info@inkwell.com
                                </a>
                            </p>
                        </address>
                    </div>

                    {/* Column 4: Social Media & Payment Methods */}
                    <div>
                        <h2 className="font-author font-bold text-[12px] text-warmBeige mb-2 md:text-[14px] lg:text-[16px] sr-only">
                            Connect With Us
                        </h2>
                        <div className='flex pb-4 gap-4'>
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={`Follow us on ${social.platform}`}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    className='text-burntAmber hover:text-deepCopper focus:outline-none focus-visible:ring-2 focus-visible:ring-deepCopper w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-colors duration-200'>
                                    <social.icon aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                        
                        <h2 className="font-author font-bold text-[12px] text-warmBeige mb-2 md:text-[14px] lg:text-[16px]">
                            We Accept
                        </h2>
                        <div className='flex gap-4'>
                            {paymentMethods.map((payment, index) => (
                                <span
                                    key={index}
                                    aria-label={`We accept ${payment.name}`}
                                    className='text-white w-6 h-6 md:w-9 md:h-9 lg:w-12 lg:h-12'>
                                    <payment.icon aria-hidden="true" />
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='py-1 rounded text-center justify-center items-center h-6 w-full flex md:h-8 lg:h-10 md:py-1.5 lg:py-2'>
                    <p
                        className='font-generalSans text-[8px] text-mutedSand md:text-[10px] lg:text-[12px]'>
                        © {currentYear} Inkwell Bookstore. All rights reserved.
                    </p>
                </div>
                <div className='flex justify-end'>
                    <span className='font-generalSans text-[8px] text-mutedSand md:text-[10px] lg:text-[12px] text-right'>
                        Created By <a href="https://github.com/Jawed-lol" className="hover:text-burntAmber focus:outline-none focus-visible:underline transition-colors duration-200">Jawed-lol</a>
                    </span>
                </div>
            </div>
            
            {/* Structured data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Inkwell Bookstore",
                        "url": "https://inkwell-bookstore.com",
                        "logo": "https://ik.imagekit.io/25fqnetuz/Inkwell/weblogo.png?updatedAt=1744854182442",
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "telephone": "+1-123-456-7890",
                            "contactType": "customer service",
                            "email": "info@inkwell.com"
                        },
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "123 Book Lane",
                            "addressLocality": "Reading City",
                            "addressRegion": "State",
                            "postalCode": "ZIP",
                            "addressCountry": "US"
                        },
                        "sameAs": [
                            "https://instagram.com/inkwellbooks",
                            "https://twitter.com/inkwellbooks",
                            "https://facebook.com/inkwellbooks"
                        ]
                    })
                }}
            />
        </footer>
    )
}

export default Footer
