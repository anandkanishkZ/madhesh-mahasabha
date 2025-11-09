import { generateMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'सदस्यता',
  description: 'मधेश महासभामा सामेल हुनुहोस्। मधेशी जनताको अधिकार, समानता र सम्मानका लागि हामीसँग मिलेर काम गर्नुहोस्। सदस्यता फारम भर्नुहोस्।',
  path: '/join',
});

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
