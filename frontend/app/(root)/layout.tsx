import { CartProvider } from "@/context/CartContext"
import { AuthProvider } from "@/context/AuthContext"
import Navbar from "@/components/navbar/Navbar"
import Footer from "@/components/footer/Footer"
import "@/app/styles/globals.css"
import "@/app/styles/arthur.css"
import "@/app/styles/generalSans.css"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en'>
            <body className='bg-charcoalBlack text-warmBeige'>
                <AuthProvider>
                    <CartProvider>
                        <Navbar />
                        <main className='min-h-screen'>{children}</main>
                        <Footer />
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
