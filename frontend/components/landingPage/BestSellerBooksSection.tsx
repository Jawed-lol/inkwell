"use client";

import { motion } from "framer-motion";
import BestSellerBookCard from "@/components/landingPage/BestSellerBookCard";

const popularBooks = [
  {
    title: "Soul",
    author: "Olivia Wilson",
    rating: 4.5,
    urlPath: "/images/hero-book-cover.jpg",
    price: 10,
  },
  {
    title: "The Hobbit",
    author: "Korrina Villanueva",
    rating: 4.5,
    urlPath: "/images/hero-book-cover-2.jpg",
    price: 10,
  },
  {
    title: "The Hobbit",
    author: "Korrina Villanueva",
    rating: 4.5,
    urlPath: "/images/hero-book-cover-3.jpg",
    price: 10,
  },
  {
    title: "The Hobbit",
    author: "Korrina Villanueva",
    rating: 4.5,
    urlPath: "/images/hero-book-cover-4.jpg",
    price: 10,
  },
];

const BestSellerBooksSection = () => {
  return (
    <section className="w-full bg-[#1B1B1B]">
      {/* Section Heading */}
      <div className="flex items-center justify-center">
        <h2
          className={
            "font-authorSans text-[#EAE0D5] font-bold text-center text-[28px] md:text-[32px] lg:text-[36px] " +
            "pt-[60px] md:pt-[70px] lg:pt-[80px] pb-[30px] lg:pb-[40px]"
          }
        >
          Our Best Sellers
        </h2>
      </div>

      {/* Book Cards Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }}
        className={
          "container  grid grid-cols-1 gap-8 px-4 py-4 mx-auto md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 " +
          "md:gap-10 md:px-8 md:py-6 lg:px-12 lg:py-8"
        }
      >
        {popularBooks.map((book, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <BestSellerBookCard {...book} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default BestSellerBooksSection;
