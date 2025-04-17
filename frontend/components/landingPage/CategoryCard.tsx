import { Image } from "@imagekit/next" 
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
}: CategoryProps) => {
    return (
        <article
            className="relative w-full h-full min-h-[260px] md:min-h-[320px] lg:min-h-[280px] rounded-xl lg:rounded-2xl overflow-hidden transition duration-300 ease-in-out hover:translate-y-[-5px] shadow-[0px_6px_18px_rgba(0,0,0,0.25)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.3)]"
            aria-labelledby={`category-${name.toLowerCase().replace(/\s+/g, '-')}`}
        >
            <div
                className='absolute inset-0 bg-black/40'
                aria-hidden='true'></div>

            {/* Responsive layout: column on mobile/tablet, row on desktop */}
            <div className="relative flex flex-col lg:flex-row h-full p-6 md:p-7 lg:p-8 items-center lg:items-start">
                {/* Image container - responsive sizing */}
                <div className='w-full lg:w-1/3 mb-4 md:mb-5 lg:mb-0 lg:mr-6 flex justify-center'>
                    <Image
                        urlEndpoint="https://ik.imagekit.io/25fqnetuz"
                        src={urlPath}
                        alt={`${name} category illustration`}
                        width={200}
                        height={0}
                        style={{ height: "auto" }}
                        className="bg-cover bg-center w-full max-w-[180px] md:max-w-[200px] lg:max-w-full rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.3)]"
                        sizes="(max-width: 768px) 180px, (max-width: 1024px) 200px, 250px"
                    />
                </div>

                {/* Text Section - responsive alignment and sizing */}
                <div className="w-full lg:w-2/3 text-center lg:text-left flex flex-col items-center lg:items-start">
                    {/* Category Name */}
                    <h3
                        id={`category-${name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="font-authorSans text-[#EAE0D5] font-bold text-[20px] md:text-[22px] lg:text-[24px] mb-2 md:mb-3"
                    >
                        {name}
                    </h3>

                    {/* Description */}
                    <p
                        className="font-generalSans text-[#BFB6A8] text-[14px] md:text-[15px] lg:text-[16px] leading-[1.6] mb-4 md:mb-5"
                    >
                        {description}
                    </p>

                    {/* Browse Button - responsive width */}
                    <Link 
                        href={`/shop?category=${encodeURIComponent(name)}`}
                        className="bg-[#D68C45] hover:bg-[#B36E30] text-[#252525] 
                        font-generalSans font-semibold text-[14px] md:text-[15px] lg:text-[16px] 
                        w-full max-w-[200px] lg:max-w-[180px] h-[40px] md:h-[45px] lg:h-[50px] 
                        rounded-[6px] md:rounded-[7px] lg:rounded-[8px] py-2 px-4 
                        transition duration-300 ease-in-out shadow-[0px_2px_6px_rgba(0,0,0,0.2)] 
                        hover:shadow-[0px_4px_10px_rgba(0,0,0,0.3)] text-center 
                        flex items-center justify-center focus:outline-none focus:ring-2 
                        focus:ring-[#D68C45] focus:ring-opacity-50"
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
