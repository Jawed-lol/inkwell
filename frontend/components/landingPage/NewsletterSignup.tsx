"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  }),
};

const NewsletterSignup = () => {
  return (
    <section
      className="w-full bg-charcoalBlack py-16 md:py-20 lg:py-24"
      aria-label="Newsletter Signup Section"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto p-6 bg-deepGray rounded-[8px] shadow-[0px_4px_16px_rgba(0,_0,_0,_0.2)] max-w-[600px] md:p-8 lg:p-12"
      >
        {/* Title */}
        <motion.h3
          variants={itemVariants}
          initial="hidden"
          whileInView={{ ...itemVariants.visible(0.2) }}
          className="text-center font-author text-warmBeige font-bold text-xl md:text-[24px] lg:text-[28px] leading-[1.2] mb-3 lg:mb-4"
        >
          Join Our Community
        </motion.h3>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          initial="hidden"
          whileInView={{ ...itemVariants.visible(0.4) }}
          className="font-generalSans text-mutedSand text-center text-[12px] md:text-[14px] lg:text-[16px] leading-[1.6] mb-4 md:mb-5 lg:mb-6"
        >
          Get exclusive updates, discounts, and reading recommendations straight
          to your inbox.
        </motion.p>

        {/* Form */}
        <form className="flex flex-col gap-4">
          {/* Input Field */}
          <motion.input
            variants={itemVariants}
            initial="hidden"
            whileInView={{ ...itemVariants.visible(0.6) }}
            type="email"
            placeholder="Enter your email address"
            className="bg-[#2E2E2E] border-darkMocha border-2 rounded py-2 px-4 w-full text-[12px] md:text-[14px] lg:text-[16px] placeholder-mutedSand text-mutedSand font-generalSans focus:border-burntAmber focus:shadow-[0px_0px_8px_rgba(214,_140,_69,_0.5)] hover:border-warmerMocha transition-colors duration-300 focus:outline-none"
          />

          {/* Subscribe Button */}
          <motion.button
            variants={itemVariants}
            initial="hidden"
            whileInView={{ ...itemVariants.visible(0.8) }}
            type="submit"
            className="font-author text-warmBeige bg-burntAmber border-2 border-burntAmber rounded py-2 px-4 w-full text-[14px] md:text-[16px] lg:text-[18px] leading-[1.2] hover:bg-deepCopper active:scale-95 transform duration-100"
          >
            Subscribe
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default NewsletterSignup;
