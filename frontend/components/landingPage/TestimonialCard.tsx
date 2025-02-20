"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

type TestimonialProps = {
  content: string;
  name: string;
};

const useElementScroll = (ref: React.RefObject<HTMLElement | null>) => {
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>, // Ensure TypeScript accepts it
    offset: ["start end", "end start"],
  });

  return scrollYProgress;
};

const TestimonialCard = ({ content, name }: TestimonialProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useElementScroll(cardRef);

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1]);

  const smoothY = useSpring(y, { stiffness: 100, damping: 20 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 20 });

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, y: smoothY, scale: smoothScale }}
      className={
        "bg-[#252525] p-6 rounded-lg border border-[#3A2E2B] shadow-[0px_6px_18px_rgba(0,_0,_0,_0.25)] " +
        "transition-all duration-300 hover:shadow-[0px_8px_24px_rgba(0,_0,_0,_0.3)] " +
        "text-center md:text-left md:p-8 lg:p-10"
      }
    >
      {/* Name */}
      <p
        className={
          "font-authorSans text-[#D68C45] font-semibold text-[16px] md:text-[18px] lg:text-[20px] mb-2 md:mb-3"
        }
      >
        {name}
      </p>

      {/* Content */}
      <p
        className={
          "font-generalSans text-[#EAE0D5] text-[14px] leading-[1.8] md:text-[16px] lg:text-[18px] " +
          "mb-4 md:mb-6"
        }
      >
        &ldquo;{content}&rdquo;
      </p>
    </motion.div>
  );
};

export default TestimonialCard;
