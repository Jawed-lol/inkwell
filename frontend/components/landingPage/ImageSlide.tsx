"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type ImageSliderProps = {
  imageSlider: string[];
};

const ImageSlide = ({ imageSlider }: ImageSliderProps) => {
  return (
    <motion.div
      className="flex gap-4 "
      animate={{ x: ["0%", "-100%"] }}
      transition={{
        repeat: Infinity,
        duration: 25,
        ease: "linear",
      }}
    >
      {imageSlider.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Book cover image ${index + 1}`}
          height={170}
          width={170}
          className="rounded-3xl shadow-[0px_4px_10px_rgba(0,0,0,0.3)]"
          loading={index === 0 ? "eager" : "lazy"}
        />
      ))}
    </motion.div>
  );
};

export default ImageSlide;
