"use client"

import CategoryCard from "@/components/landingPage/CategoryCard";
import { motion } from "framer-motion";

// Enhanced category data with more descriptive information
const featuredCategories = [
  {
    name: "Fiction",
    urlPath: "/Inkwell/category-image.jpg",
    description: "Explore a world of imagination with our fiction collection featuring bestselling novels and classic literature.",
  },
  {
    name: "Romance",
    urlPath: "/Inkwell/category-card-2.jpg",
    description: "Fall in love with our curated romance novels from contemporary to historical love stories.",
  },
  {
    name: "Mystery",
    urlPath: "/Inkwell/mystery-thriller-cover-image.jpg",
    description: "Unravel intriguing plots with our mystery books from cozy mysteries to thrilling detective stories.",
  },
  {
    name: "Fantasy",
    urlPath: "/Inkwell/fiction-cover-image.jpg",
    description: "Embark on magical adventures with our fantasy series featuring dragons, wizards, and mythical worlds.",
  },
];

const FeaturedCategorySection = () => {
  // Animation variants for consistent animations
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section
      className="w-full bg-[#1B1B1B] py-16 md:py-20 lg:py-24"
      aria-labelledby="collections-heading"
    >
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        
      >
                <h2
            id="collections-heading"
            className={
              "font-authorSans text-[#EAE0D5] font-bold text-center text-[28px] md:text-[32px] lg:text-[36px]" +
              "leading-[1.2] tracking-wide mb-8 md:mb-10 lg:mb-12"
            }
          >
            Explore Our Collections
          </h2>
          </motion.div>

      {/* Category Cards Grid with Animation */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className={
          "container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-1 md:gap-10 lg:gap-12 " +
          "md:px-8 lg:px-12"
        }
      >

        {featuredCategories.map((category, index) => (
          <motion.div 
            key={category.name} 
            variants={itemVariants}
            className="h-full"
          >
            <CategoryCard 
              {...category} 
              reverse={index % 2 !== 0} 
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Skip link target for accessibility */}
      <div id="main-content-after-categories" className="sr-only">End of categories section</div>
    </section>
  );
};

export default FeaturedCategorySection;
