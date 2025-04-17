"use client"

import { motion } from "framer-motion"

export default function ReturnPolicyPage() {
    return (
        <>
            <head>
                <title>Return Policy | Inkwell Bookstore</title>
                <meta
                    name="description"
                    content="Read Inkwell Bookstore's return, refund, and exchange policy. Learn how to return or exchange your books and get support for your order."
                />
            </head>
            <motion.main
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto px-6 py-16 lg:py-24"
                aria-label="Inkwell Bookstore Return Policy"
                aria-labelledby="return-policy-heading"
                tabIndex={-1}
            >
                <header>
                    <h1 id="return-policy-heading" className="font-author text-3xl md:text-4xl mb-6 text-warmBeige">
                        Return Policy
                    </h1>
                    <p className="mb-8 text-mutedSand text-lg" id="return-policy-summary">
                        Learn about Inkwell Bookstore&apos;s return, refund, and exchange policies. We strive to ensure your satisfaction with every purchase.
                    </p>
                </header>
            <section aria-labelledby="returns-heading">
                <h2 id="returns-heading" className="font-author text-2xl mt-8 mb-2 text-warmBeige">
                    Returns
                </h2>
                <ul className="list-disc ml-6 mb-4 text-mutedSand">
                    <li>Returns are accepted within 30 days of purchase with a valid receipt.</li>
                    <li>Books must be in original condition (unread and undamaged).</li>
                    <li>Sale items and gift cards are non-returnable.</li>
                </ul>
            </section>
            <section aria-labelledby="refunds-heading">
                <h2 id="refunds-heading" className="font-author text-2xl mt-8 mb-2 text-warmBeige">
                    Refunds
                </h2>
                <ul className="list-disc ml-6 mb-4 text-mutedSand">
                    <li>Refunds will be issued to the original payment method within 7 business days after we receive your return.</li>
                    <li>Shipping costs are non-refundable unless the return is due to our error.</li>
                </ul>
            </section>
            <section aria-labelledby="exchanges-heading">
                <h2 id="exchanges-heading" className="font-author text-2xl mt-8 mb-2 text-warmBeige">
                    Exchanges
                </h2>
                <p className="mb-4 text-mutedSand">
                    If you received a damaged or incorrect book, please contact us within 7 days of delivery for an exchange.
                </p>
            </section>
            <section aria-labelledby="contact-heading">
                <h2 id="contact-heading" className="font-author text-2xl mt-8 mb-2 text-warmBeige">
                    Contact
                </h2>
                <p className="text-mutedSand">
                    For return or exchange requests, email <a href="mailto:support@inkwellbookstore.com" className="underline text-burntAmber">support@inkwellbookstore.com</a> with your order details.
                </p>
            </section>
        </motion.main>
        </>
    )
}