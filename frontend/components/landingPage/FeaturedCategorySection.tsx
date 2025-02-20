import CategoryCard from "@/components/landingPage/CategoryCard";

const featuredCategories = [
  {
    name: "Fiction",
    urlPath: "/images/category-image.jpg",
    description: "Explore a world of imagination with our fiction collection.",
  },
  {
    name: "Romance",
    urlPath: "/images/romance-cover-image.jpg",
    description: "Fall in love with our curated romance novels.",
  },
  {
    name: "Mystery",
    urlPath: "/images/mystery-thriller-cover-image.jpg",
    description: "Unravel intriguing plots with our mystery books.",
  },
  {
    name: "Fantasy",
    urlPath: "/images/fiction-cover-image.jpg",
    description: "Embark on magical adventures with our fantasy series.",
  },
];

const FeaturedCategorySection = () => {
  return (
    <section
      className="w-full bg-[#1B1B1B] py-16 md:py-20 lg:py-24"
      aria-label="Featured Categories Section"
    >
      {/* Section Heading */}
      <h2
        className={
          "font-authorSans text-[#EAE0D5] font-bold text-center text-[28px] md:text-[32px] lg:text-[36px] " +
          "leading-[1.2] tracking-wide mb-8 md:mb-10 lg:mb-12"
        }
      >
        Explore Our Collections
      </h2>

      {/* Category Cards Grid */}
      <div
        className={
          "container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-1 md:gap-10 lg:gap-12 " +
          "md:px-8 lg:px-12"
        }
      >
        {featuredCategories.map((category, index) => (
          <CategoryCard {...category} key={index} reverse={index % 2 !== 0} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategorySection;
