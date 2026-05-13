import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://ceapargentina.com";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Camara Argentina de Empresarios | CEAP Argentina",
    template: "%s | CEAP Argentina",
  },
  description:
    "Camara Argentina de Empresarios (CEAP): conectamos productores e inversores para convenios internacionales, expansion comercial y oportunidades reales de comercio exterior.",
  keywords: [
    "camara argentina",
    "camara de empresarios",
    "camara argentina de empresarios",
    "ceap argentina",
    "convenios internacionales",
    "comercio exterior argentina",
    "productores e inversores",
    "corredor bioceanico",
  ],
  alternates: {
    canonical: "/",
  },
  category: "business",
  applicationName: "CEAP Argentina",
  openGraph: {
    title: "Camara Argentina de Empresarios | CEAP Argentina",
    description:
      "Plataforma B2B de la Camara Argentina de Empresarios para conectar productores e inversores con oportunidades de comercio exterior.",
    url: SITE_URL,
    siteName: "CEAP Argentina",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: "/ceap.png",
        width: 1200,
        height: 630,
        alt: "Camara Argentina de Empresarios - CEAP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Camara Argentina de Empresarios | CEAP Argentina",
    description:
      "CEAP Argentina conecta productores e inversores con oportunidades reales de comercio exterior.",
    images: ["/ceap.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
      <body suppressHydrationWarning className="min-h-full">
        <div className="app-page">
          <div aria-hidden="true" className="app-background" />
          <div className="app-content">{children}</div>
        </div>
      </body>
    </html>
  );
}
