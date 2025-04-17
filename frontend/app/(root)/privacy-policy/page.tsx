"use client"

import { motion } from "framer-motion"

export default function PrivacyPolicyPage() {
    return (
        <motion.main
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto px-6 py-16 lg:py-24"
        >
            <h1 className="font-author text-3xl md:text-4xl mb-6 text-warmBeige">Privacy Policy</h1>
            <p className="mb-4 text-mutedSand">
                At Inkwell Bookstore, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website.
            </p>
            <h2 className="font-author text-2xl mt-8 mb-2 text-warmBeige">Information We Collect</h2>
            <ul className="list-disc ml-6 mb-4 text-mutedSand">
                <li>Personal information you provide (such as name, email, address, and payment details)</li>
                <li>Information collected automatically (such as IP address, browser type, and usage data)</li>
            </ul>
            <h2 className="font-author text-2xl mt-8 mb-2 text-warmBeige">How We Use Your Information</h2>
            <ul className="list-disc ml-6 mb-4 text-mutedSand">
                <li>To process orders and provide customer support</li>
                <li>To improve our website and services</li>
                <li>To send updates, promotions, or newsletters (you may opt out at any time)</li>
            </ul>
            <h2 className="font-author text-2xl mt-8 mb-2 text-warmBeige">Data Security</h2>
            <p className="mb-4 text-mutedSand">
                We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
            </p>
            <h2 className="font-author text-2xl mt-8 mb-2 text-warmBeige">Third-Party Services</h2>
            <p className="mb-4 text-mutedSand">
                We may use third-party services for payment processing and analytics. These providers have their own privacy policies.
            </p>
            <h2 className="font-author text-2xl mt-8 mb-2 text-warmBeige">Your Rights</h2>
            <p className="mb-4 text-mutedSand">
                You may request access to, correction of, or deletion of your personal information by contacting us.
            </p>
            <h2 className="font-author text-2xl mt-8 mb-2 text-warmBeige">Contact</h2>
            <p className="text-mutedSand">
                If you have any questions about this Privacy Policy, please contact us at support@inkwellbookstore.com.
            </p>
        </motion.main>
    )
}