"use client"

import { motion } from "framer-motion"

export default function TermsOfUsePage() {
    return (
        <motion.main
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto px-6 py-16 lg:py-24"
            aria-label="Terms of Use"
            tabIndex={-1}
        >
            <header>
                <h1 className="font-author text-3xl md:text-4xl mb-6 text-warmBeige" id="terms-heading">
                    Terms of Use
                </h1>
                <p className="mb-8 text-mutedSand text-lg" id="terms-summary">
                    Review the terms and conditions for using Inkwell Bookstore&apos;s website and services. Your use of our site constitutes acceptance of these terms.
                </p>
            </header>
            <section aria-labelledby="use-of-website-heading">
                <h2 id="use-of-website-heading" className="font-author text-2xl mt-8 mb-2 text-warmBeige">
                    Use of Website
                </h2>
                <ul className="list-disc ml-6 mb-4 text-mutedSand">
                    <li>You must be at least 13 years old to use our website.</li>
                    <li>You agree not to misuse the website or its content.</li>
                    <li>All content is for personal, non-commercial use unless otherwise stated.</li>
                </ul>
            </section>
            <section aria-labelledby="intellectual-property-heading">
                <h2 id="intellectual-property-heading" className="font-author text-2xl mt-8 mb-2 text-warmBeige">
                    Intellectual Property
                </h2>
                <p className="mb-4 text-mutedSand">
                    All content, trademarks, and logos are the property of Inkwell Bookstore or its licensors. You may not use them without permission.
                </p>
            </section>
            <section aria-labelledby="user-accounts-heading">
                <h2 id="user-accounts-heading" className="font-author text-2xl mt-8 mb-2 text-warmBeige">
                    User Accounts
                </h2>
                <ul className="list-disc ml-6 mb-4 text-mutedSand">
                    <li>You are responsible for maintaining the confidentiality of your account information.</li>
                    <li>Notify us immediately of any unauthorized use of your account.</li>
                </ul>
            </section>
            <section aria-labelledby="limitation-liability-heading">
                <h2 id="limitation-liability-heading" className="font-author text-2xl mt-8 mb-2 text-warmBeige">
                    Limitation of Liability
                </h2>
                <p className="mb-4 text-mutedSand">
                    Inkwell Bookstore is not liable for any damages arising from your use of the website or products purchased.
                </p>
            </section>
            <section aria-labelledby="changes-to-terms-heading">
                <h2 id="changes-to-terms-heading" className="font-author text-2xl mt-8 mb-2 text-warmBeige">
                    Changes to Terms
                </h2>
                <p className="mb-4 text-mutedSand">
                    We reserve the right to update these terms at any time. Continued use of the website constitutes acceptance of the new terms.
                </p>
            </section>
            <section aria-labelledby="contact-heading">
                <h2 id="contact-heading" className="font-author text-2xl mt-8 mb-2 text-warmBeige">
                    Contact
                </h2>
                <p className="text-mutedSand">
                    For questions about these Terms of Use, contact us at <a href="mailto:support@inkwellbookstore.com" className="underline text-burntAmber">support@inkwellbookstore.com</a>.
                </p>
            </section>
        </motion.main>
    )
}