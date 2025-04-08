import { ReactNode } from "react"
import "@/app/styles/globals.css"
import "@/app/styles/arthur.css"
import "@/app/styles/generalSans.css"
import Navbar from "@/components/navbar/Navbar"
import Head from "next/head"
import Footer from "@/components/footer/Footer"
import { CartProvider } from "@/context/CartContext"
import { AuthProvider } from "@/context/AuthContext"

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <html lang='en'>
            <Head>
                <title>Inkwell Bookstore</title>
                <meta
                    name='description'
                    content='Welcome to Inkwell, your favorite independent bookstore. Discover books, browse collections, and fuel your love for stories.'
                />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1.0'
                />
                <meta charSet='UTF-8' />
                <meta
                    property='og:type'
                    content='website'
                />
                <meta
                    property='og:title'
                    content='Inkwell'
                />
                <meta
                    property='og:description'
                    content='Dive into the world of books at Inkwell, the ultimate bookstore for book lovers.'
                />
                <meta
                    name='twitter:card'
                    content='summary_large_image'
                />
                <meta
                    name='twitter:title'
                    content='Inkwell'
                />
                <meta
                    name='twitter:description'
                    content='Find your next great read at Inkwell, the independent bookstore for every type of reader.'
                />
                <link
                    rel='icon'
                    href='/favicon.ico'
                />
            </Head>
            <body>
                <AuthProvider>
                    <CartProvider>
                        <header>
                            <Navbar />
                        </header>
                        {children}
                        <footer>
                            <Footer />
                        </footer>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    )
}

export default Layout
