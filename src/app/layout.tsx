import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wnetrzeai.pl"),
  title: "WnetrzeAI — AI Virtual Staging dla Agentów Nieruchomości",
  description:
    "Puste mieszkanie urządzone w 30 sekund. AI dodaje meble i dekoracje do zdjęć nieruchomości. Jedyne polskojęzyczne narzędzie do virtual stagingu.",
  keywords: [
    "virtual staging",
    "AI staging",
    "home staging",
    "staging nieruchomości",
    "wirtualny staging",
    "AI meble",
    "zdjęcia nieruchomości",
    "agent nieruchomości",
    "staging Polska",
  ],
  openGraph: {
    title: "WnetrzeAI — AI Virtual Staging dla Agentów Nieruchomości",
    description:
      "Puste mieszkanie urządzone w 30 sekund. Jedyne polskojęzyczne narzędzie AI do virtual stagingu.",
    type: "website",
    locale: "pl_PL",
    url: "https://wnetrzeai.pl",
    siteName: "WnetrzeAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "WnetrzeAI — AI Virtual Staging",
    description: "Puste mieszkanie urządzone w 30 sekund. AI dodaje meble do zdjęć nieruchomości.",
  },
  alternates: {
    canonical: "https://wnetrzeai.pl",
  },
  other: {
    "theme-color": "#0a0a0f",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "WnetrzeAI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI Virtual Staging — jedyne polskojęzyczne narzędzie do virtual stagingu dla agentów nieruchomości. Dodaj meble do zdjęć pustych wnętrz w 30 sekund.",
  url: "https://wnetrzeai.pl",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "PLN",
    description: "Darmowy plan — 3 rendery miesięcznie",
  },
  inLanguage: "pl",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0a0a0f] text-[#fafafa] antialiased font-['Plus_Jakarta_Sans',system-ui,sans-serif]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
