import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'सम्पर्क गर्नुहोस्',
  description: 'मधेश महासभामा सम्पर्क गर्नुहोस्। हाम्रो टोलीसँग जोडिनुहोस् र आफ्नो सुझाव, प्रश्न वा सहयोगका लागि सम्पर्क राख्नुहोस्।',
};

export default function ContactLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return children;
}
