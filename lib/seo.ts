import type { Metadata } from 'next';

export function generateMetadata({
  title,
  description,
  path = '',
  type = 'website',
  image,
}: {
  title: string;
  description: string;
  path?: string;
  type?: 'website' | 'article';
  image?: string;
}): Metadata {
  const url = `https://madheshmahasabha.com${path}`;
  const ogImage = image || '/og.png';

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'मधेश महासभा',
      locale: 'ne_NP',
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'मधेश महासभा',
    alternateName: 'Madhesh Mahasabha',
    url: 'https://madheshmahasabha.com',
    logo: 'https://madheshmahasabha.com/logo.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'mahasabhamadhesh@gmail.com',
      contactType: 'General Inquiry',
    },
    sameAs: [
      'https://facebook.com/madheshmahasabha',
      'https://youtube.com/@madheshmahasabha',
    ],
    foundingLocation: {
      '@type': 'Place',
      name: 'नेपाल',
    },
    description: 'मधेश र मधेशीको एकता, समानता र अधिकारका लागि',
  };
}

export function generateWebsiteSchema(url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'मधेश महासभा',
    alternateName: 'Madhesh Mahasabha',
    url,
    description: 'मधेश र मधेशीको एकता, समानता र अधिकारका लागि',
    inLanguage: 'ne',
    publisher: {
      '@type': 'Organization',
      name: 'मधेश महासभा',
      url: 'https://madheshmahasabha.com',
    },
  };
}

export function generateArticleSchema({
  title,
  description,
  url,
  publishedAt,
  modifiedAt,
  author = 'मधेश महासभा',
  image,
}: {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  modifiedAt?: string;
  author?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    author: {
      '@type': 'Organization',
      name: author,
      url: 'https://madheshmahasabha.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'मधेश महासभा',
      url: 'https://madheshmahasabha.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://madheshmahasabha.com/logo.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image,
        width: 1200,
        height: 630,
      },
    }),
    inLanguage: 'ne',
  };
}