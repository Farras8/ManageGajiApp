import type React from "react"
import type { Metadata } from "next"

import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"

import localFont from "next/font/local"
import { Toaster } from "@/components/ui/toaster"

const geist = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist",
    display: "swap",
})
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    display: "swap",
})

export const metadata: Metadata = {
    title: "Keuangan - Catat Keuangan Pribadi",
    description: "Aplikasi pencatatan keuangan pribadi sederhana untuk melacak pemasukan dan pengeluaran",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body className={`font-sans ${geist.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
                <Suspense fallback={null}>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        {children}
                    </ThemeProvider>
                </Suspense>
                <Toaster />
            </body>
        </html>
    )
}
