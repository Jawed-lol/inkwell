"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";

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
  const prefersReducedMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Only enable animations after component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setFormStatus({
        type: "error",
        message: "Please enter a valid email address",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual newsletter signup API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormStatus({
        type: "success",
        message: "Thank you for subscribing to our newsletter!",
      });
      setEmail("");
    } catch  {
      setFormStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="w-full bg-charcoalBlack py-16 md:py-20 lg:py-24"
      aria-labelledby="newsletter-heading"
    >
      <motion.div
        variants={containerVariants}
        initial={!isMounted || prefersReducedMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto p-6 bg-deepGray rounded-[8px] shadow-[0px_4px_16px_rgba(0,_0,_0,_0.2)] max-w-[600px] md:p-8 lg:p-12"
      >
        {/* Title */}
        <motion.h2
          id="newsletter-heading"
          variants={itemVariants}
          initial={!isMounted || prefersReducedMotion ? "visible" : "hidden"}
          whileInView={!isMounted || prefersReducedMotion ? {} : { ...itemVariants.visible(0.2) }}
          className="text-center font-author text-warmBeige font-bold text-xl md:text-[24px] lg:text-[28px] leading-[1.2] mb-3 lg:mb-4"
        >
          Join Our Community
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          initial={!isMounted || prefersReducedMotion ? "visible" : "hidden"}
          whileInView={!isMounted || prefersReducedMotion ? {} : { ...itemVariants.visible(0.4) }}
          className="font-generalSans text-mutedSand text-center text-[12px] md:text-[14px] lg:text-[16px] leading-[1.6] mb-4 md:mb-5 lg:mb-6"
        >
          Get exclusive updates, discounts, and reading recommendations straight
          to your inbox.
        </motion.p>

        {/* Form */}
        <form 
          className="flex flex-col gap-4" 
          onSubmit={handleSubmit}
          aria-describedby={formStatus.message ? "form-status" : undefined}
        >
          <div className="relative">
            {/* Label for screen readers */}
            <label htmlFor="email-input" className="sr-only">
              Email address
            </label>
            
            {/* Input Field */}
            <motion.input
              id="email-input"
              variants={itemVariants}
              initial={!isMounted || prefersReducedMotion ? "visible" : "hidden"}
              whileInView={!isMounted || prefersReducedMotion ? {} : { ...itemVariants.visible(0.6) }}
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              aria-required="true"
              className="bg-[#2E2E2E] border-darkMocha border-2 rounded py-2 px-4 w-full text-[12px] md:text-[14px] lg:text-[16px] placeholder-mutedSand text-mutedSand font-generalSans focus:border-burntAmber focus:shadow-[0px_0px_8px_rgba(214,_140,_69,_0.5)] hover:border-warmerMocha transition-colors duration-300 focus:outline-none"
              aria-invalid={formStatus.type === "error"}
            />
          </div>

          {/* Status message */}
          {formStatus.message && (
            <div 
              id="form-status" 
              className={`text-center text-[12px] md:text-[14px] ${
                formStatus.type === "success" ? "text-green-400" : "text-red-400"
              }`}
              role="status"
              aria-live="polite"
            >
              {formStatus.message}
            </div>
          )}

          {/* Subscribe Button */}
          <motion.button
            variants={itemVariants}
            initial={!isMounted || prefersReducedMotion ? "visible" : "hidden"}
            whileInView={!isMounted || prefersReducedMotion ? {} : { ...itemVariants.visible(0.8) }}
            type="submit"
            disabled={isSubmitting}
            className="font-author text-warmBeige bg-burntAmber border-2 border-burntAmber rounded py-2 px-4 w-full text-[14px] md:text-[16px] lg:text-[18px] leading-[1.2] hover:bg-deepCopper active:scale-95 transform duration-100 focus:outline-none focus:ring-2 focus:ring-burntAmber focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </motion.button>
          
          <p className="text-[10px] md:text-[12px] text-mutedSand text-center mt-2">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </motion.div>
    </section>
  );
};

export default NewsletterSignup;
