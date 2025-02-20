import Image from "next/image";
import starIcon from "@/public/icons/star-icon.svg";
import { Button } from "@/components/ui/button";

type BookProps = {
  title: string;
  author: string;
  rating: number;
  urlPath: string;
  price: number;
};

const BestSellerBookCard = ({
  title,
  author,
  rating,
  urlPath,
  price,
}: BookProps) => {
  return (
    <div
      className={
        "flex w-full bg-[#252525] rounded-xl p-4 md:p-6 lg:p-8 items-start gap-4 hover:scale-[1.03] transition duration-300 ease-in-out " +
        "shadow-[0px_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_6px_15px_rgba(0,0,0,0.3)]"
      }
    >
      {/* Left Section: Image */}
      <div className="w-[35%] flex-shrink-0">
        <Image
          src={urlPath || "/images/fallback.jpg"}
          alt={`${title} cover`}
          width={180}
          height={250}
          className="w-full h-auto rounded-[8px] object-cover object-center shadow-[0px_4px_12px_rgba(0,0,0,0.3)] hover:scale-[1.03] transition duration-300 ease-in-out"
        />
      </div>

      {/* Right Section: Content */}
      <div className="flex flex-col w-[65%] justify-between">
        {/* Title, Author, Price, Rating */}
        <div>
          {/* Title */}
          <h3 className="font-authorSans text-[#EAE0D5] font-bold text-[16px] md:text-[18px] lg:text-[20px] mb-2 md:mb-3">
            {title}
          </h3>

          {/* Author */}
          <div className="font-generalSans text-[#BFB6A8] text-[14px] md:text-[15px] lg:text-[16px] mb-2 md:mb-3">
            {author}
          </div>

          {/* Price */}
          <div className="font-generalSans font-semibold text-[#D68C45] text-[16px] md:text-[17px] lg:text-[18px] mb-3 md:mb-3">
            ${price.toFixed(2)}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4 md:mb-5">
            <Image
              src={starIcon}
              alt="Star Icon"
              height={15}
              width={15}
              className="h-3 w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 text-[#F4C430]"
              loading="lazy"
            />
            <span className="font-generalSans text-[#BFB6A8] text-[14px] md:text-[15px] lg:text-[16px]">
              {rating}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-auto">
          <Button
            className={
              "bg-[#D68C45] hover:bg-[#B36E30] text-[#252525] font-generalSans font-semibold text-[14px] md:text-[15px] lg:text-[16px] " +
              "w-full h-[40px] md:h-[45px] lg:h-[50px] rounded-[6px] py-2 px-4 transition duration-300 ease-in-out " +
              "shadow-[0px_2px_6px_rgba(0,0,0,0.2)] hover:shadow-[0px_4px_10px_rgba(0,0,0,0.3)]"
            }
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BestSellerBookCard;
