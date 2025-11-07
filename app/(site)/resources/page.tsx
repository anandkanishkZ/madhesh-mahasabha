import { Footer } from '@/components/Footer';
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/LinkButton';
import { OpenLinkButton } from '@/components/OpenLinkButton';
import { JoinStrip } from '@/components/JoinStrip';
import { Download, FileText, Image } from 'lucide-react';
import { generateMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'संसाधन र डाउनलोडहरू',
  description: 'मधेश महासभाको प्रस्तावना, लोगो प्याक, ब्राण्ड गाइडलाइन्स र अन्य महत्वपूर्ण संसाधनहरू डाउनलोड गर्नुहोस्।',
  path: '/resources',
});

export default function Resources() {
  const downloads = [
    {
      title: 'प्रस्तावना (PDF)',
      description: 'पूर्ण प्रस्तावना PDF फारमेटमा डाउनलोड गर्नुहोस्',
      icon: FileText,
      href: '/manifesto',
      action: 'प्रिन्ट गर्नुहोस्',
      note: 'प्रिन्ट गर्न मेनुबाट "Print" छान्नुहोस्'
    },
    {
      title: 'Logo Pack (PNG/SVG)',
      description: 'विभिन्न साइजका लोगोहरू डाउनलोड गर्नुहोस्',
      icon: Image,
      href: '#',
      action: 'छिट्टै उपलब्ध',
      note: 'हाल तयारी चरणमा छ'
    },
  ];

  return (
    <>
      <main id="main-content">
        {/* Hero Section */}
        <Section background="pattern" className="py-16">
          <SectionHeader>
            <SectionTitle as="h1" className="text-4xl lg:text-5xl">
              संसाधन र डाउनलोडहरू
            </SectionTitle>
            <SectionDescription>
              मधेश महासभाका महत्वपूर्ण दस्तावेजहरू र ब्राण्ड संसाधनहरू
            </SectionDescription>
          </SectionHeader>
        </Section>

        {/* Downloads Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>डाउनलोड गर्नुहोस्</SectionTitle>
            <SectionDescription>
              आवश्यक दस्तावेजहरू र फाइलहरू
            </SectionDescription>
          </SectionHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {downloads.map((item) => (
              <Card key={item.title} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-mm-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-mm-primary" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <p className="text-sm text-gray-500 mb-4">{item.note}</p>
                  
                  {item.title.includes('PDF') ? (
                    <OpenLinkButton 
                      href="/manifesto"
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{item.action}</span>
                    </OpenLinkButton>
                  ) : (
                    <div 
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-nepali-heading font-semibold h-12 px-6 py-3 text-base border-2 border-gray-300 text-gray-400 pointer-events-none opacity-50 space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{item.action}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* Contact for Resources */}
        <Section background="muted">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="nepali-heading text-2xl font-bold text-mm-ink mb-4">
              अन्य संसाधनहरू चाहिन्छ?
            </h2>
            <p className="nepali-text text-gray-600 mb-6">
              यदि तपाईंलाई अन्य कुनै संसाधन वा जानकारी चाहिन्छ भने हामीलाई सम्पर्क गर्नुहोस्।
            </p>
            <LinkButton href="/contact">सम्पर्क गर्नुहोस्</LinkButton>
          </div>
        </Section>

        <JoinStrip />
      </main>

      <Footer />
    </>
  );
}