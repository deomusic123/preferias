import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alliance 2.0 | Convenios Internacionales de Comex",
  description:
    "Plataforma B2B para conectar productores e inversores con oportunidades internacionales de comercio exterior.",
  openGraph: {
    title: "Alliance 2.0",
    description:
      "Generación y calificación de oportunidades B2B para convenios internacionales de comex.",
    type: "website",
    locale: "es_CL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alliance 2.0",
    description:
      "Conectamos productores e inversores con oportunidades reales de comercio exterior.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
