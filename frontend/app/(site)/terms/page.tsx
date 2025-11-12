import React from 'react';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { LegalSidebar } from '@/components/legal/LegalSidebar';
import { FileText, Eye, Users, Lock, AlertTriangle, Gavel, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Madhesh Mahasabha',
  description: 'मधेश महासभाको वेबसाइट र सेवाहरूको प्रयोगसँग सम्बन्धित नियम र शर्तहरू। हाम्रा सेवाहरू प्रयोग गर्नुअघि कृपया यी नियमहरू पढ्नुहोस्।',
  keywords: 'नियम र शर्तहरू, terms and conditions, मधेश महासभा, madhesh mahasabha, legal terms, वैधानिक नियम',
  openGraph: {
    title: 'नियम र शर्तहरू - मधेश महासभा',
    description: 'मधेश महासभाको सेवा प्रयोगका नियम र शर्तहरू',
    type: 'website',
    locale: 'ne_NP',
  },
};

export default function TermsAndConditions() {
  return (
    <>
      <main className="min-h-screen bg-gray-50">
        {/* Page Title */}
        <Section className="py-8 bg-gradient-to-r from-mm-primary/10 via-purple-50 to-indigo-50">
          <div className="text-center">
            <h1 className="nepali-heading text-4xl md:text-5xl font-bold text-mm-ink mb-4">
              नियम र शर्तहरू
            </h1>
            <p className="nepali-text text-lg text-gray-600 max-w-2xl mx-auto">
              हाम्रो वेबसाइट र सेवाहरूको प्रयोगसँग सम्बन्धित नियम र शर्तहरू।
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
            <span className="text-gray-900 font-medium">सर्तहरू र शर्तहरू</span>
          </nav>
        </Section>

        <Section className="py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <LegalSidebar currentPage="terms" />

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-mm-primary/10 rounded-lg">
                    <FileText className="w-6 h-6 text-mm-primary" />
                  </div>
                  <h1 className="nepali-heading text-2xl lg:text-3xl font-bold text-gray-900">
                    सर्तहरू र शर्तहरू
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
                    मधेश महासभाको वेबसाइट र सेवाहरूको प्रयोग गर्नु अघि कृपया यी सर्तहरू र शर्तहरूलाई ध्यानपूर्वक पढ्नुहोस्। 
                    यो वेबसाइट प्रयोग गरेर, तपाईं यी सबै सर्तहरूमा सहमत हुनुहुन्छ। यदि तपाईं यी सर्तहरूमा सहमत हुनुहुन्न भने, 
                    कृपया यो वेबसाइट प्रयोग नगर्नुहोस्।
                  </p>
                </section>

                {/* Website Usage */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-mm-primary" />
                    वेबसाइट प्रयोग
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      यो वेबसाइट मधेश महासभाको आधिकारिक वेबसाइट हो। तपाईं यो वेबसाइट निम्नलिखित सर्तहरूमा प्रयोग गर्न सक्नुहुन्छ:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>व्यक्तिगत, गैर-व्यावसायिक उद्देश्यका लागि मात्र</li>
                      <li>कानुनी र नैतिक तरिकामा मात्र</li>
                      <li>अरूको अधिकारको हनन नगरी</li>
                      <li>वेबसाइटको सुरक्षामा बाधा नपुर्याई</li>
                    </ul>
                  </div>
                </section>

                {/* Membership Terms */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-mm-primary" />
                    सदस्यता सर्तहरू
                  </h2>
                  <div className="space-y-4">
                    <h3 className="nepali-heading text-lg font-medium text-gray-800">
                      सदस्यता आवेदन
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>सदस्यता आवेदनमा सत्य र पूर्ण जानकारी प्रदान गर्नुपर्छ</li>
                      <li>आवेदन स्वीकृति संगठनको विवेकमा निर्भर गर्छ</li>
                      <li>झूठा जानकारी प्रदान गरेमा सदस्यता रद्द हुन सक्छ</li>
                      <li>सदस्यता नवीकरण आवश्यक हुन सक्छ</li>
                    </ul>
                    
                    <h3 className="nepali-heading text-lg font-medium text-gray-800 mt-6">
                      सदस्यका दायित्वहरू
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>संगठनको उद्देश्य र सिद्धान्तहरूको पालना</li>
                      <li>नियमित गतिविधिहरूमा सहभागिता</li>
                      <li>अन्य सदस्यहरूसँग सम्मानजनक व्यवहार</li>
                      <li>संगठनको प्रतिष्ठामा आँच नआउने गतिविधि</li>
                    </ul>
                  </div>
                </section>

                {/* Intellectual Property */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-mm-primary" />
                    बौद्धिक सम्पत्ति अधिकार
                  </h2>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      यस वेबसाइटमा उपलब्ध सबै सामग्री, लोगो, डिजाइन, पाठ, छविहरू र अन्य सामग्रीहरू मधेश महासभाको 
                      बौद्धिक सम्पत्ति हुन्:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>कुनै पनि सामग्री बिना अनुमति प्रतिलिपि गर्न मनाही</li>
                      <li>व्यावसायिक प्रयोगका लागि पूर्व स्वीकृति आवश्यक</li>
                      <li>लोगो र ट्रेडमार्कको अनधिकृत प्रयोग निषेध</li>
                      <li>सामग्री परिमार्जन वा वितरण निषेध</li>
                    </ul>
                  </div>
                </section>

                {/* Prohibited Activities */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    निषेधित गतिविधिहरू
                  </h2>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-gray-700 mb-4">
                      निम्नलिखित गतिविधिहरू कडाइका साथ निषेध गरिएका छन्:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>भ्रामक वा झूठा जानकारी प्रदान गर्ने</li>
                      <li>अन्य प्रयोगकर्ताहरूलाई हानि पुर्याउने</li>
                      <li>स्प्याम वा अवांछित सन्देशहरू पठाउने</li>
                      <li>वेबसाइटको सुरक्षामा बाधा पुर्याउने</li>
                      <li>कानुन विपरीतका गतिविधिहरू</li>
                      <li>अश्लील वा आपत्तिजनक सामग्री पोष्ट गर्ने</li>
                    </ul>
                  </div>
                </section>

                {/* Disclaimer */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-mm-primary" />
                    अस्वीकरण
                  </h2>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      यो वेबसाइट र यसका सेवाहरू "जस्तो छ" को आधारमा प्रदान गरिएको छ। हामी निम्नलिखित कुराहरूको 
                      ग्यारेन्टी गर्दैनौं:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>वेबसाइटको निरन्तर उपलब्धता</li>
                      <li>सबै जानकारीको शुद्धता</li>
                      <li>तेस्रो पक्षका लिङ्कहरूको सुरक्षा</li>
                      <li>सेवामा कुनै बाधा नआउने</li>
                    </ul>
                  </div>
                </section>

                {/* Limitation of Liability */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4">
                    दायित्वको सीमा
                  </h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <p className="text-gray-700">
                      कुनै पनि अवस्थामा मधेश महासभा वा यसका पदाधिकारीहरू निम्नलिखित कुराहरूका लागि जिम्मेवार हुनेछैनन्:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
                      <li>प्रत्यक्ष, अप्रत्यक्ष, विशेष वा परिणामी हानि</li>
                      <li>डेटा हानि वा व्यावसायिक नोकसान</li>
                      <li>तेस्रो पक्षका कार्यहरूबाट हुने हानि</li>
                      <li>वेबसाइट प्रयोगबाट हुने कुनै पनि समस्या</li>
                    </ul>
                  </div>
                </section>

                {/* Governing Law */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4">
                    शासक कानून
                  </h2>
                  <p className="text-gray-700">
                    यी सर्तहरू र शर्तहरू नेपालको कानून अनुसार शासित हुनेछन्। कुनै पनि विवाद काठमाडौंका अदालतहरूको 
                    क्षेत्राधिकारमा समाधान गरिनेछ।
                  </p>
                </section>

                {/* Amendments */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4">
                    परिमार्जन
                  </h2>
                  <p className="text-gray-700">
                    मधेश महासभाले यी सर्तहरू र शर्तहरूलाई कुनै पनि समयमा परिमार्जन गर्ने अधिकार राख्छ। 
                    महत्वपूर्ण परिवर्तनहरू वेबसाइटमा सूचना मार्फत जानकारी गराइनेछ।
                  </p>
                </section>

                {/* Contact Information */}
                <section>
                  <h2 className="nepali-heading text-xl font-semibold text-gray-900 mb-4">
                    सम्पर्क जानकारी
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 mb-4">
                      यदि तपाईंका यी सर्तहरू र शर्तहरूको बारेमा कुनै प्रश्न छ भने, कृपया हामीलाई सम्पर्क गर्नुहोस्:
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