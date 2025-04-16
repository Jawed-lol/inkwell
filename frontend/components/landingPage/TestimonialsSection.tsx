"use client"

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from "framer-motion";

// Dynamically import TestimonialCard with no SSR
const TestimonialCard = dynamic(
  () => import("@/components/landingPage/TestimonialCard"),
  { ssr: false }
);

// Book-related testimonials
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Avid Reader",
    content:
      "Inkwell has completely transformed my reading experience. Their curated selection introduced me to authors I never would have discovered otherwise. The delivery is always prompt and the books arrive in perfect condition.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Book Club Organizer",
    content: "Our book club exclusively orders from Inkwell now. Their staff recommendations have sparked some of our most engaging discussions. The personalized service makes all the difference.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Literature Professor",
    content:
      "As someone who values quality editions, Inkwell exceeds my expectations. Their rare book collection is impressive, and their knowledge of literature is evident in every recommendation they provide.",
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Fantasy Genre Enthusiast",
    content:
      "I've been searching for a bookstore that truly understands the fantasy genre, and Inkwell delivers. Their themed collections and special editions have helped me complete series I've been hunting for years.",
  },
  {
    id: 5,
    name: "Olivia Parker",
    role: "Parent & Educator",
    content:
      "The children's book selection at Inkwell is thoughtfully curated with diverse stories and beautiful illustrations. My students are always excited when I bring in new books from their collection.",
  },
];

const TestimonialSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  
  // Only enable animations after component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  return (
    <section
      className="py-16 bg-[#1B1B1B] text-center"
      aria-labelledby="testimonials-heading"
    >
      {/* Section Heading */}
      <h2
        id="testimonials-heading"
        className={
          "font-authorSans text-[#EAE0D5] font-bold text-center text-[28px] md:text-[32px] lg:text-[36px] " +
          "leading-[1.2] tracking-wide mb-8 md:mb-10 lg:mb-12"
        }
      >
        What Our Readers Say
      </h2>

      {/* Testimonial Cards Grid */}
      <motion.div
        variants={sectionVariants}
        initial={isMounted && !prefersReducedMotion ? "hidden" : "visible"}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className={
          "container grid grid-cols-1 gap-8 px-4 mx-auto md:grid-cols-2 lg:grid-cols-3 " +
          "md:gap-10 md:px-8 lg:px-12"
        }
      >
        {testimonials.map((testimonial) => (
          <TestimonialCard 
            key={testimonial.id} 
            content={testimonial.content} 
            name={testimonial.name} 
            role={testimonial.role} 
          />
        ))}
      </motion.div>

      {/* Skip link target for accessibility */}
      <div id="main-content-after-testimonials" className="sr-only">End of testimonials section</div>
    </section>
  );
};

export default TestimonialSection;
