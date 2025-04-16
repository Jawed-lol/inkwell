"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";

type TestimonialProps = {
  content: string;
  name: string;
  role?: string;
};

const useElementScroll = (ref: React.RefObject<HTMLElement | null>) => {
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: ["start end", "end start"],
  });

  return scrollYProgress;
};

const TestimonialCard = ({ content, name, role }: TestimonialProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  
  // Only enable animations after component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Only use scroll-based animations after mounting
  const scrollYProgress = useElementScroll(cardRef);

  // Create different transform values based on reduced motion preference
  const opacityValue = useTransform(
    scrollYProgress, 
    prefersReducedMotion ? [0, 0, 1] : [0, 0.5, 1], 
    prefersReducedMotion ? [1, 1, 1] : [0, 1, 1]
  );
  
  const yValue = useTransform(
    scrollYProgress, 
    prefersReducedMotion ? [0, 0, 1] : [0, 0.5, 1], 
    prefersReducedMotion ? [0, 0, 0] : [100, 0, 0]
  );
  
  const scaleValue = useTransform(
    scrollYProgress, 
    prefersReducedMotion ? [0, 0, 1] : [0, 0.5, 1], 
    prefersReducedMotion ? [1, 1, 1] : [0.8, 1, 1]
  );

  // Now we can safely use useSpring with MotionValue<number>
  const smoothY = useSpring(yValue, { stiffness: 100, damping: 20 });
  const smoothScale = useSpring(scaleValue, { stiffness: 100, damping: 20 });

  return (
    <motion.article
      ref={cardRef}
      style={isMounted ? { 
        opacity: opacityValue, 
        y: smoothY, 
        scale: smoothScale 
      } : {
        opacity: 1,
        y: 0,
        scale: 1
      }}
      className={
        "bg-[#252525] p-6 rounded-lg border border-[#3A2E2B] shadow-[0px_6px_18px_rgba(0,_0,_0,_0.25)] " +
        "transition-all duration-300 hover:shadow-[0px_8px_24px_rgba(0,_0,_0,_0.3)] " +
        "text-center md:text-left md:p-8 lg:p-10"
      }
      tabIndex={0}
      role="article"
      aria-label={`Testimonial from ${name}${role ? `, ${role}` : ''}`}
    >
      {/* Quote content */}
      <blockquote>
        <p
          className={
            "font-generalSans text-[#EAE0D5] text-[14px] leading-[1.8] md:text-[16px] lg:text-[18px] " +
            "mb-4 md:mb-6"
          }
        >
          &ldquo;{content}&rdquo;
        </p>
        
        {/* Citation */}
        <footer>
          <cite
            className={
              "font-authorSans text-[#D68C45] font-semibold text-[16px] md:text-[18px] lg:text-[20px] not-italic"
            }
          >
            {name}
            {role && (
              <span className="block text-[#BFB6A8] text-[12px] md:text-[14px] lg:text-[16px] font-normal mt-1">
                {role}
              </span>
            )}
          </cite>
        </footer>
      </blockquote>
    </motion.article>
  );
};

export default TestimonialCard;
