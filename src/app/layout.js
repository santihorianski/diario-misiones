import { Merriweather, Roboto } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-serif",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
});


import './globals.css';
import DolarHoyWidgets from '@/components/DolarHoyWidgets';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import TemasDeHoy from '@/components/TemasDeHoy';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata = {
  title: "Misiones Ya",
  description: "Las últimas noticias de Misiones, al instante.",
  openGraph: {
    title: "Misiones Ya | El portal de noticias",
    description: "Las últimas noticias de Misiones, al instante.",
    url: "https://misionesya.com",
    siteName: "Misiones Ya",
    images: [{ url: "https://placehold.co/1200x630/000b29/FFF?text=MISIONES+YA" }],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Misiones Ya",
    description: "Las últimas noticias de Misiones, al instante.",
    images: ["https://placehold.co/1200x630/000b29/FFF?text=MISIONES+YA"],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <body className={`${roboto.variable} ${merriweather.variable} bg-white dark:bg-[#111111] transition-colors duration-300 text-gray-900 dark:text-gray-100`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="bg-gray-100 dark:bg-gray-900 hidden md:block">
              <AdBanner type="horizontal" />
            </div>
            <TemasDeHoy />
            <Navbar />
            <DolarHoyWidgets />
            {children}
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
