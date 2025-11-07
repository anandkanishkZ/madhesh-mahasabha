import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_Devanagari, Baloo_Bhai_2, Mukta, Inter, Khand } from 'next/font/google';
import { generateOrganizationSchema } from '@/lib/seo';
import { BackToTop } from '@/components/BackToTop';
import { Header } from '@/components/Header';
import { LeftSliderProvider } from '@/contexts/LeftSliderContext';

const notoSansDevanagari = Noto_Sans_Devanagari({ 
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-devanagari'
});

const balooBhai2 = Baloo_Bhai_2({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-baloo-bhai-2'
});

const mukta = Mukta({ 
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-mukta'
});

const khand = Khand({ 
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-khand'
});

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: {
    default: 'मधेश महासभा - Madhesh Mahasabha',
    template: '%s | मधेश महासभा'
  },
  description: 'मधेश र मधेशीको एकता, समानता र अधिकारका लागि। समान हिस्सेदारी, सम्मान र समृद्धिका साझा अभियान।',
  keywords: ['मधेश', 'महासभा', 'madhesh', 'mahasabha', 'एकता', 'समानता', 'अधिकार', 'नेपाल'],
  authors: [{ name: 'मधेश महासभा' }],
  creator: 'मधेश महासभा',
  publisher: 'मधेश महासभा',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://madheshmahasabha.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'मधेश महासभा - Madhesh Mahasabha',
    description: 'मधेश र मधेशीको एकता, समानता र अधिकारका लागि',
    url: 'https://madheshmahasabha.com',
    siteName: 'मधेश महासभा',
    locale: 'ne_NP',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'मधेश महासभा'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'मधेश महासभा - Madhesh Mahasabha',
    description: 'मधेश र मधेशीको एकता, समानता र अधिकारका लागि',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'placeholder-google-verification',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="ne" dir="ltr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${notoSansDevanagari.variable} ${balooBhai2.variable} ${mukta.variable} ${khand.variable} ${inter.variable} antialiased overflow-x-hidden`}>
        <LeftSliderProvider>
          <a href="#main-content" className="skip-link">
            मुख्य सामग्रीमा जानुहोस्
          </a>
          <Header />
          <div className="min-h-screen w-full overflow-x-hidden page-enter">
            {children}
          </div>
          <BackToTop />
        </LeftSliderProvider>
      </body>
    </html>
  );
}