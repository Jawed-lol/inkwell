import HeroSection from "@/components/landingPage/HeroSection";
import FeaturedCategorySection from "@/components/landingPage/FeaturedCategorySection";
import BestSellerBooksSection from "@/components/landingPage/BestSellerBooksSection";
import TestimonialsSection from "@/components/landingPage/TestimonialsSection";
import NewsletterSignup from "@/components/landingPage/NewsletterSignup";
import { Metadata } from "next";

// Define metadata for better SEO
export const metadata: Metadata = {
  title: "Inkwell Bookstore - Your Gateway to Stories",
  description: "Welcome to Inkwell Bookstore – where avid readers and book lovers come together. Explore quality books across all genres and discover your next favorite read.",
  openGraph: {
    title: "Inkwell Bookstore - Your Gateway to Stories",
    description: "Dive into Inkwell's wide collection of books and discover the magic of reading. Browse, shop, and get inspired!",
    type: "website",
    url: "https://v0-inkwell.vercel.app",
    images: [
      {
        url: "/frontend/app/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Inkwell Bookstore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inkwell Bookstore - Your Gateway to Stories",
    description: "Dive into Inkwell's wide collection of books and discover the magic of reading. Browse, shop, and get inspired!",
    images: ["/images/twitter-image.jpg"],
  },
  keywords: "books, bookstore, reading, literature, fiction, non-fiction, online bookstore, book shop",
  alternates: {
    canonical: "https://v0-inkwell.vercel.app",
  },
};

export default function Home() {
  // JSON-LD structured data for rich search results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Inkwell Bookstore",
    "url": "https://inkwell-bookstore.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://inkwell-bookstore.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://facebook.com/inkwellbooks",
      "https://twitter.com/inkwellbooks",
      "https://instagram.com/inkwellbooks"
    ]
  };

  return (
    <>
      {/* Add structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main>
        {/* Skip to content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-burntAmber focus:text-warmBeige"
        >
          Skip to main content
        </a>
        
        <div id="main-content">
          <HeroSection />
          <FeaturedCategorySection />
          <BestSellerBooksSection />
          <TestimonialsSection />
          <NewsletterSignup />
        </div>
      </main>
    </>
  );
}
