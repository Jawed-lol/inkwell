"use client"

import { motion } from "framer-motion"

const faqs = [
    {
        question: "How do I place an order?",
        answer: "Browse our collection, add books to your cart, and proceed to checkout. You’ll receive a confirmation email once your order is placed."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards, PayPal, and other secure payment options."
    },
    {
        question: "How long does shipping take?",
        answer: "Orders are processed within 1-2 business days. Delivery times vary by location, but most orders arrive within 3-7 business days."
    },
    {
        question: "Can I return or exchange a book?",
        answer: "Yes! Please see our Return Policy for details on returns and exchanges."
    },
    {
        question: "Do you offer gift cards?",
        answer: "Yes, digital gift cards are available for purchase on our website."
    },
    {
        question: "How can I contact customer support?",
        answer: "Email us at support@inkwellbookstore.com and we’ll be happy to help."
    }
]

export default function FAQPage() {
    return (
        <motion.main
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto px-6 py-16 lg:py-24"
            aria-label="Frequently Asked Questions"
            tabIndex={-1}
        >
            <header>
                <h1 className="font-author text-3xl md:text-4xl mb-6 text-warmBeige" id="faq-heading">
                    Frequently Asked Questions
                </h1>
                <p className="mb-8 text-mutedSand text-lg" id="faq-summary">
                    Find answers to common questions about ordering, shipping, returns, and more at Inkwell Bookstore.
                </p>
            </header>
            <section aria-labelledby="faq-heading">
                <dl className="space-y-6">
                    {faqs.map((faq, idx) => (
                        <div key={idx}>
                            <dt>
                                <h2 className="font-author text-xl text-warmBeige mb-2" id={`faq-q${idx}`}>
                                    {faq.question}
                                </h2>
                            </dt>
                            <dd>
                                <p className="text-mutedSand">
                                    {faq.question.includes("return") ? (
                                        <>
                                            Yes! Please see our <a href="/return-policy" className="underline text-burntAmber">Return Policy</a> for details on returns and exchanges.
                                        </>
                                    ) : faq.question.includes("contact") ? (
                                        <>
                                            Email us at <a href="mailto:support@inkwellbookstore.com" className="underline text-burntAmber">support@inkwellbookstore.com</a> and we’ll be happy to help.
                                        </>
                                    ) : (
                                        faq.answer
                                    )}
                                </p>
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>
        </motion.main>
    )
}