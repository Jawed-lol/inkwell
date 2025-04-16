//import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

type CategoryProps = {
    name: string
    urlPath: string
    description: string
    reverse?: boolean
}

const CategoryCard = ({
    name,
    urlPath,
    description,
    reverse = false,
}: CategoryProps) => {
    return (
        <article
            className={
                "relative w-full h-[260px] md:h-[280px] lg:h-[320px] rounded-xl lg:rounded-2xl overflow-hidden " +
                "flex items-center justify-center transition duration-300 ease-in-out hover:translate-y-[-5px] " +
                "shadow-[0px_6px_18px_rgba(0,0,0,0.25)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.3)]"
            }
            aria-labelledby={`category-${name.toLowerCase().replace(/\s+/g, '-')}`}
        >
            <div
                className='absolute inset-0 bg-black/40'
                aria-hidden='true'></div>

            <div
                className={
                    "relative flex flex-row items-center p-6 md:p-7 lg:p-8 " +
                    (reverse ? "flex-row-reverse" : "")
                }>
                <div className='w-[40%] h-full'>
                    <Image
                        src={urlPath}
                        alt={`${name} category illustration`}
                        width={800}
                        height={800}
                        className={
                            "bg-cover bg-center w-full h-auto rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.3)]"
                        }
                        sizes="(max-width: 768px) 40vw, (max-width: 1200px) 30vw, 320px"
                    />
                </div>

                {/* Text Section */}
                <div
                    className={
                        "w-[60%] pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8 "
                    }>
                    {/* Category Name */}
                    <h3
                        id={`category-${name.toLowerCase().replace(/\s+/g, '-')}`}
                        className={
                            "font-authorSans text-[#EAE0D5] font-bold text-[20px] md:text-[22px] lg:text-[24px] mb-2 md:mb-3"
                        }>
                        {name}
                    </h3>

                    {/* Description */}
                    <p
                        className={
                            "font-generalSans text-[#BFB6A8] text-[14px] md:text-[15px] lg:text-[16px] leading-[1.6] mb-4 md:mb-5"
                        }>
                        {description}
                    </p>

                    {/* Browse Button */}
                    <Link 
                        href={`/shop?category=${encodeURIComponent(name)}`}
                        className={
                            "inline-block bg-[#D68C45] hover:bg-[#B36E30] text-[#252525] font-generalSans font-semibold text-[14px] md:text-[15px] lg:text-[16px] " +
                            "w-full md:w-1/2 h-[40px] md:h-[45px] lg:h-[50px] rounded-[6px] md:rounded-[7px] lg:rounded-[8px] " +
                            "py-2 px-4 transition duration-300 ease-in-out shadow-[0px_2px_6px_rgba(0,0,0,0.2)] hover:shadow-[0px_4px_10px_rgba(0,0,0,0.3)] " +
                            "text-center flex items-center justify-center  focus:outline-none focus:ring-2 focus:ring-[#D68C45] focus:ring-opacity-50"
                        }
                        aria-label={`Browse ${name} collection`}
                    >
                        Browse Collection
                    </Link>
                </div>
            </div>
        </article>
    )
}

export default CategoryCard
