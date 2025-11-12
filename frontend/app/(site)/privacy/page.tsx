import React from 'react';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { LegalSidebar } from '@/components/legal/LegalSidebar';
import { Shield, Eye, Lock, Database, Cookie, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Madhesh Mahasabha',
  description: 'मधेश महासभाको गोपनीयता नीति। हामी तपाईंको व्यक्तिगत जानकारीको सुरक्षा र गोपनीयतालाई कसरी सुरक्षित राख्छौं भन्ने बारे जान्नुहोस्।',
  keywords: 'गोपनीयता नीति, privacy policy, मधेश महासभा, madhesh mahasabha, data protection, व्यक्तिगत जानकारी',
  openGraph: {
    title: 'गोपनीयता नीति - मधेश महासभा',
    description: 'मधेश महासभाको गोपनीयता नीति र डाटा सुरक्षा नीतिहरू',
    type: 'website',
    locale: 'ne_NP',
  },
};

export default function PrivacyPolicy() {
  return (
    <>
      <main className="min-h-screen bg-gray-50">
        {/* Page Title */}
        <Section className="py-8 bg-gradient-to-r from-mm-primary/10 via-purple-50 to-indigo-50">
          <div className="text-center">
            <h1 className="nepali-heading text-4xl md:text-5xl font-bold text-mm-ink mb-4">
              गोपनीयता नीति
            </h1>
            <p className="nepali-text text-lg text-gray-600 max-w-2xl mx-auto">
              हामी तपाईंको व्यक्तिगत जानकारीको सुरक्षा र गोपनीयतालाई गम्भीरताका साथ लिन्छौं।
            </p>
          </div>
        </Section>

        {/* Breadcrumb */}
        <Section className="py-4 bg-white border-b border-gray-200">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-mm-primary hover:underline">
              गृहपृष्ठ
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900 font-medium">गोपनीयता नीति</span>
          </nav>
        </Section>

        <Section className="py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <LegalSidebar currentPage="privacy" />

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-mm-primary/10 rounded-lg">
                    <Shield className="w-6 h-6 text-mm-primary" />
                  </div>
                  <h1 className="nepali-heading text-2xl lg:text-3xl font-bold text-gray-900">
                    गोपनीयता नीति
                  </h1>
                </div>
                <p className="nepali-text text-gray-600">
                  अन्तिम अद्यावधिक: नोभेम्बर १२, २०२५
                </p>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none nepali-text space-y-8">
                {/* Introduction */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-mm-primary" />
                    परिचय
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    मधेश महासभामा, हामी तपाईंको गोपनीयताको सम्मान गर्छौं र तपाईंको व्यक्तिगत जानकारीको सुरक्षा गर्न प्रतिबद्ध छौं। 
                    यो गोपनीयता नीतिले वर्णन गर्छ कि हामी कसरी तपाईंको जानकारी सङ्कलन, प्रयोग र सुरक्षा गर्छौं जब तपाईं हाम्रो वेबसाइट 
                    प्रयोग गर्नुहुन्छ वा हाम्रा सेवाहरूमा सहभागी हुनुहुन्छ।
                  </p>
                </section>

                {/* Information We Collect */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-mm-primary" />
                    हामीले सङ्कलन गर्ने जानकारी
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="nepali-heading text-lg font-medium text-gray-800 mb-2">
                        व्यक्तिगत जानकारी
                      </h3>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700">
                        <li>नाम, इमेल ठेगाना, फोन नम्बर</li>
                        <li>ठेगाना र अन्य सम्पर्क विवरणहरू</li>
                        <li>सदस्यता आवेदन जानकारी</li>
                        <li>सामाजिक सञ्जाल प्रोफाइल जानकारी (यदि तपाईंले साझा गर्नुभएको छ)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="nepali-heading text-lg font-medium text-gray-800 mb-2">
                        प्राविधिक जानकारी
                      </h3>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700">
                        <li>IP ठेगाना र ब्राउजर जानकारी</li>
                        <li>कुकीज र ट्र्याकिङ डेटा</li>
                        <li>वेबसाइट उपयोग तथ्याङ्क</li>
                        <li>डिभाइस र अपरेटिङ सिस्टम जानकारी</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* How We Use Information */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-mm-primary" />
                    जानकारीको प्रयोग
                  </h2>
                  <div className="space-y-3">
                    <p className="text-gray-700">हामी तपाईंको जानकारी निम्नलिखित उद्देश्यका लागि प्रयोग गर्छौं:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>सदस्यता आवेदन प्रशोधन र व्यवस्थापन</li>
                      <li>संगठनका गतिविधि र कार्यक्रमहरूको जानकारी प्रदान</li>
                      <li>न्यूजलेटर र महत्वपूर्ण अद्यावधिकहरू पठाउन</li>
                      <li>वेबसाइट सुधार र प्राविधिक सहयोग</li>
                      <li>कानुनी आवश्यकताहरूको पालना</li>
                    </ul>
                  </div>
                </section>

                {/* Cookies */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Cookie className="w-5 h-5 text-mm-primary" />
                    कुकीजको प्रयोग
                  </h2>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      हाम्रो वेबसाइटले तपाईंको अनुभव सुधार गर्न कुकीजको प्रयोग गर्छ। कुकीजका प्रकारहरू:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li><strong>आवश्यक कुकीज:</strong> वेबसाइटको मूलभूत कार्यक्षमताका लागि</li>
                      <li><strong>विश्लेषणात्मक कुकीज:</strong> वेबसाइट उपयोग बुझ्नका लागि</li>
                      <li><strong>कार्यात्मक कुकीज:</strong> व्यक्तिगतकरण सुविधाहरूका लागि</li>
                    </ul>
                  </div>
                </section>

                {/* Data Protection */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4">
                    डेटा सुरक्षा
                  </h2>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      हामी तपाईंको व्यक्तिगत जानकारीको सुरक्षाका लागि उद्योग-मानक सुरक्षा उपायहरू प्रयोग गर्छौं:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>SSL एन्क्रिप्शन प्रविधि</li>
                      <li>सुरक्षित डेटा भण्डारण</li>
                      <li>सीमित पहुँच नियन्त्रण</li>
                      <li>नियमित सुरक्षा समीक्षा</li>
                    </ul>
                  </div>
                </section>

                {/* Your Rights */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4">
                    तपाईंका अधिकारहरू
                  </h2>
                  <div className="space-y-3">
                    <p className="text-gray-700">तपाईंको व्यक्तिगत जानकारीको सम्बन्धमा निम्नलिखित अधिकारहरू छन्:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>आफ्नो जानकारी हेर्ने र सम्पादन गर्ने अधिकार</li>
                      <li>डेटा मेटाउन अनुरोध गर्ने अधिकार</li>
                      <li>डेटा पोर्टेबिलिटीको अधिकार</li>
                      <li>मार्केटिङ सञ्चारबाट अप्ट-आउट गर्ने अधिकार</li>
                    </ul>
                  </div>
                </section>

                {/* Contact Information */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4">
                    सम्पर्क जानकारी
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 mb-4">
                      यदि तपाईंका यस गोपनीयता नीतिको बारेमा कुनै प्रश्न वा चिन्ता छ भने, कृपया हामीलाई सम्पर्क गर्नुहोस्:
                    </p>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-mm-primary" />
                        <span>mahasabhamadhesh@gmail.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-mm-primary" />
                        <span>+977-1-4567890</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}