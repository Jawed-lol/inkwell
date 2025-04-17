"use client"

import { motion } from "framer-motion"
import Head from "next/head"
import Link from "next/link"
import { Image } from "@imagekit/next"

// Animation variants for sections
const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
}

export default function AboutPage() {
    return (
        <>
            <Head>
                <title>
                    About Inkwell Bookstore | Our Story, Mission & Team
                </title>
                <meta
                    name='description'
                    content="Learn about Inkwell Bookstore's history, mission, and the passionate team behind our community-focused bookstore. Discover our journey from a small local shop to a beloved literary hub."
                />
                <meta
                    name='keywords'
                    content='Inkwell Bookstore, about us, bookstore history, mission, team, book lovers, independent bookstore, literary community'
                />
                <meta
                    property='og:title'
                    content='About Inkwell Bookstore | Our Story, Mission & Team'
                />
                <meta
                    property='og:description'
                    content='Discover the story behind Inkwell Bookstore, our mission, and meet the team that makes it all happen. Join our community of book lovers today!'
                />
                <meta
                    property='og:type'
                    content='website'
                />
                <meta
                    property='og:url'
                    content='https://www.inkwellbookstore.com/about'
                />
                <meta
                    property='og:image'
                    content='/images/bookstore-hero.jpg'
                />
                <meta
                    property='og:site_name'
                    content='Inkwell Bookstore'
                />
                <meta
                    name='twitter:card'
                    content='summary_large_image'
                />
                <meta
                    name='twitter:title'
                    content='About Inkwell Bookstore | Our Story, Mission & Team'
                />
                <meta
                    name='twitter:description'
                    content='Discover the story behind Inkwell Bookstore, our mission, and meet the team that makes it all happen.'
                />
                <meta
                    name='twitter:image'
                    content='/images/bookstore-hero.jpg'
                />
                <link
                    rel='canonical'
                    href='https://www.inkwellbookstore.com/about'
                />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Inkwell Bookstore",
                        "url": "https://www.inkwellbookstore.com",
                        "logo": "https://www.inkwellbookstore.com/images/logo.png",
                        "description": "Inkwell Bookstore is a community-focused independent bookstore founded in 2010, offering a diverse selection of books and hosting literary events.",
                        "foundingDate": "2010",
                        "founders": [
                            {
                                "@type": "Person",
                                "name": "Eleanor Page"
                            }
                        ],
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "123 Book Lane",
                            "addressLocality": "Bookville",
                            "addressRegion": "BK",
                            "postalCode": "12345",
                            "addressCountry": "US"
                        }
                    })}
                </script>
            </Head>
            <main className='pt-[120px] bg-gradient-to-b from-charcoalBlack to-deepGray min-h-screen'>
                <div className='max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 py-8'>
                    <HeroSection />
                    <OurStorySection />
                    <OurMissionSection />
                    <MeetTheTeamSection />
                    <CallToAction />
                </div>
            </main>
        </>
    )
}

// Hero Section
function HeroSection() {
    return (
        <motion.section
            initial='hidden'
            animate='visible'
            variants={sectionVariants}
            className='text-center mb-12'
            aria-labelledby="about-heading">
            <h1 id="about-heading" className='font-author text-warmBeige text-4xl md:text-5xl mb-4'>
                About Inkwell Bookstore
            </h1>
            <p className='font-generalSans text-mutedSand text-lg md:text-xl'>
                Discover the story behind our passion for books and community.
            </p>
        </motion.section>
    )
}

// Our Story Section
function OurStorySection() {
    return (
        <motion.section
            initial='hidden'
            animate='visible'
            variants={sectionVariants}
            className='mb-12'
            aria-labelledby="story-heading">
            <h2 id="story-heading" className='font-author text-warmBeige text-3xl md:text-4xl mb-4'>
                Our Story
            </h2>
            <p className='font-generalSans text-mutedSand text-base md:text-lg'>
                Inkwell Bookstore was founded in 2010 by a group of book lovers
                who wanted to create a space where people could discover new
                stories and connect with fellow readers. Over the years, we&apos;ve
                grown from a small local shop to a beloved community hub,
                hosting author events, book clubs, and more.
            </p>
        </motion.section>
    )
}

// Our Mission Section
function OurMissionSection() {
    return (
        <motion.section
            initial='hidden'
            animate='visible'
            variants={sectionVariants}
            className='mb-12'
            aria-labelledby="mission-heading">
            <h2 id="mission-heading" className='font-author text-warmBeige text-3xl md:text-4xl mb-4'>
                Our Mission
            </h2>
            <p className='font-generalSans text-mutedSand text-base md:text-lg'>
                At Inkwell Bookstore, our mission is to foster a love of reading
                and provide a welcoming space for book enthusiasts of all ages.
                We believe in the power of stories to inspire, educate, and
                bring people together. We&apos;re committed to offering a diverse
                selection of books and supporting local authors.
            </p>
        </motion.section>
    )
}

// Meet the Team Section
function MeetTheTeamSection() {
    const teamMembers = [
        {
            name: "Eleanor Page",
            role: "Founder & CEO",
            image: "/Inkwell/person-2.png",
            bio: "Eleanor started Inkwell in 2010 with a dream of bringing people together through stories. With a background in literature and a passion for community building, she's the heart of our bookstore, always ready to chat about her latest favorite novel or plan the next big event.",
            alt: "Eleanor Page, Founder of Inkwell Bookstore, smiling with glasses in front of bookshelves with warm lighting",
        },
        {
            name: "Marcus Reed",
            role: "Lead Bookseller",
            image: "/Inkwell/person-1.png",
            bio: "Marcus is our go-to guy for book recommendations. With over ten years in the book industry, he's got an uncanny ability to match readers with their perfect read. When he's not shelving books, you'll find him sharing fun facts about classic literature.",
            alt: "Marcus Reed, Lead Bookseller at Inkwell Bookstore, cheerfully holding a stack of books while talking to a customer",
        },
        {
            name: "Lily Harper",
            role: "Events Coordinator",
            image: "/Inkwell/person-3.png",
            bio: "Lily keeps Inkwell buzzing with excitement. From organizing book clubs to hosting author signings, she brings creativity and energy to every event. Her love for storytelling and connecting with people makes every gathering unforgettable.",
            alt: "Lily Harper, Events Coordinator at Inkwell Bookstore, arranging a colorful display table for a book club",
        },
    ]

    return (
        <motion.section
            initial='hidden'
            animate='visible'
            variants={sectionVariants}
            className='mb-12'
            aria-labelledby="team-heading">
            <h2 id="team-heading" className='font-author text-warmBeige text-3xl md:text-4xl mb-6 text-center'>
                Meet the Team
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
                {teamMembers.map((member, index) => (
                    <motion.article
                        key={member.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        className='bg-slightlyLightGrey p-6 rounded-lg shadow-md'
                        aria-labelledby={`team-member-${index}`}>
                        <Image
                            urlEndpoint="https://ik.imagekit.io/25fqnetuz"
                            src={member.image}
                            alt={member.alt}
                            width={150}
                            height={150}
                            className='rounded-full mx-auto mb-4 h-[150px] w-auto'
                            priority={index < 2}
                        />
                        <h3 id={`team-member-${index}`} className='font-author text-xl text-warmBeige text-center'>
                            {member.name}
                        </h3>
                        <p className='font-generalSans text-sm text-mutedSand text-center mb-2'>
                            {member.role}
                        </p>
                        <p className='font-generalSans text-sm text-mutedSand text-center'>
                            {member.bio}
                        </p>
                    </motion.article>
                ))}
            </div>
        </motion.section>
    )
}

// Call to Action
function CallToAction() {
    return (
        <motion.section
            initial='hidden'
            animate='visible'
            variants={sectionVariants}
            className='text-center'>
            <Link href='/shop' passHref>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='font-author font-bold text-lg bg-burntAmber text-darkMutedTeal py-3 px-8 rounded-lg hover:bg-deepCopper transition duration-200'
                    aria-label="Explore our book collection">
                    Explore Our Books
                </motion.button>
            </Link>
        </motion.section>
    )
}
