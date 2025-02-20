import TestimonialCard from "@/components/landingPage/TestimonialCard";

const testimonials = [
  {
    id: 1,
    name: "Alice Johnson",
    content:
      "This product has revolutionized our workflow. Highly recommended!",
  },
  {
    id: 2,
    name: "Bob Smith",
    content: "The customer support is outstanding. They go above and beyond.",
  },
  {
    id: 3,
    name: "Carol Williams",
    content:
      "I've tried many similar products, but this one stands out for its ease of use.",
  },
  {
    id: 4,
    name: "David Brown",
    content:
      "The integration capabilities are impressive. It's saved us countless hours.",
  },
  {
    id: 5,
    name: "Eva Martinez",
    content:
      "User-friendly and powerful. It's become an essential tool for our team.",
  },
];

const TestimonialSection = () => {
  return (
    <section
      className="py-16 bg-[#1B1B1B] text-center"
      aria-label="Customer Testimonials Section"
    >
      {/* Section Heading */}
      <h2
        className={
          "font-authorSans text-[#EAE0D5] font-bold text-center text-[28px] md:text-[32px] lg:text-[36px] " +
          "leading-[1.2] tracking-wide mb-8 md:mb-10 lg:mb-12"
        }
      >
        What Our Readers Say
      </h2>

      {/* Testimonial Cards Grid */}
      <div
        className={
          "container grid grid-cols-1 gap-8 px-4 mx-auto md:grid-cols-2 lg:grid-cols-3 " +
          "md:gap-10 md:px-8 lg:px-12"
        }
      >
        {testimonials.map((testimonial) => (
          <TestimonialCard {...testimonial} key={testimonial.id} />
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
