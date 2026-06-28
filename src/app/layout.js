import { Merriweather, Roboto } from "next/font/google";
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

export const metadata = {
  title: "Espectador Misiones",
  description: "Las últimas noticias de Misiones, al instante.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${roboto.variable} ${merriweather.variable}`}>
        <DolarHoyWidgets />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
