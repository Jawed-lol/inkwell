import HeroSection from "@/components/landingPage/HeroSection";
import FeaturedCategorySection from "@/components/landingPage/FeaturedCategorySection";
import BestSellerBooksSection from "@/components/landingPage/BestSellerBooksSection";
import Head from "next/head";
import TestimonialsSection from "@/components/landingPage/TestimonialsSection";
import NewsletterSignup from "@/components/landingPage/NewsletterSignup";

export default function Home() {
  return (
    <>
      <Head>
        <title>Inkwell Bookstore - Your Gateway to Stories</title>
        <meta
          name="description"
          content="Welcome to Inkwell Bookstore – where avid readers and book lovers
          come together. Explore quality books across all genres and discover your next favorite read."
        />
        <meta
          property="og:title"
          content="Inkwell Bookstore - Your Gateway to Stories"
        />
        <meta
          property="og:description"
          content="Dive into Inkwell's wide collection of books and discover the magic of reading. Browse, shop, and get inspired!"
        />
      </Head>

      <main>
        <HeroSection />
        <FeaturedCategorySection />
        <BestSellerBooksSection />
        <TestimonialsSection />
        <NewsletterSignup />
      </main>
    </>
  );
}
