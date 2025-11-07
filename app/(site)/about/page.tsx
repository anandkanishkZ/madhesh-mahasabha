import { Footer } from '@/components/Footer';
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { JoinStrip } from '@/components/JoinStrip';
import { Target, Heart, Lightbulb, Users } from 'lucide-react';
import Link from 'next/link';
import { generateMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'हाम्रो परिचय',
  description: 'मधेश महासभाको स्थापना, उद्देश्य र दर्शनबारे जान्नुहोस्। हामी मधेशी समुदायको एकता र अधिकारका लागि काम गर्छौं।',
  path: '/about',
});

export default function About() {
  return (
    <>
      <main id="main-content">
        {/* Hero Section */}
        <Section background="pattern" className="py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-mm-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-mm-accent/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="inline-flex items-center space-x-2 bg-mm-primary/10 backdrop-blur-sm border border-mm-primary/20 rounded-full px-5 py-2 mb-8">
              <span className="text-sm font-nepali-body font-semibold text-mm-primary">
                हाम्रो परिचय
              </span>
            </div>
            
            <h1 className="nepali-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold text-mm-ink mb-8 leading-[1.2]">
              मधेश महासभाको परिचय
            </h1>
            <p className="nepali-text text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-4xl">
              मधेश र मधेशी समुदायको एकता, समानता र अधिकारका लागि गठित एक साझा मञ्च। 
              हामी सामाजिक न्याय, राजनीतिक सहभागिता र आर्थिक समृद्धिका लागि काम गर्छौं।
            </p>
          </div>
        </Section>

        {/* Mission & Vision */}
        <Section className="bg-white">
          <SectionHeader centered>
            <SectionTitle className="text-4xl lg:text-5xl font-extrabold">हाम्रो दर्शन र लक्ष्य</SectionTitle>
            <SectionDescription className="mx-auto text-lg lg:text-xl max-w-3xl">
              न्यायसंगत, समान र समृद्ध मधेशको निर्माण
            </SectionDescription>
          </SectionHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <Card className="lg:col-span-2 group relative overflow-hidden border-2 border-transparent hover:border-mm-primary/20 hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mm-primary to-mm-accent"></div>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-mm-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold nepali-heading">हाम्रो मिशन</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg lg:text-xl leading-relaxed text-gray-700 nepali-text">
                  मधेश महासभाको मिशन छ—मधेशी समुदायको एकता कायम गर्दै राष्ट्रिय मुख्यधारामा समानुपातिक सहभागिता सुनिश्चित गर्ने। 
                  हामी संविधानसम्मत अधिकारको पूर्ण कार्यान्वयन र सामाजिक न्यायका लागि संघर्ष गर्छौं।
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-transparent hover:border-mm-accent/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mm-accent to-mm-accent/50"></div>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-mm-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold nepali-heading">मूल्य र सिद्धान्त</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3 group/item">
                    <span className="w-2 h-2 bg-mm-accent rounded-full mt-2.5 flex-shrink-0 group-hover/item:scale-150 transition-transform"></span>
                    <span className="text-base lg:text-lg text-gray-700 nepali-text">एकता र सद्भावना</span>
                  </li>
                  <li className="flex items-start space-x-3 group/item">
                    <span className="w-2 h-2 bg-mm-accent rounded-full mt-2.5 flex-shrink-0 group-hover/item:scale-150 transition-transform"></span>
                    <span className="text-base lg:text-lg text-gray-700 nepali-text">पारदर्शिता र जवाफदेहिता</span>
                  </li>
                  <li className="flex items-start space-x-3 group/item">
                    <span className="w-2 h-2 bg-mm-accent rounded-full mt-2.5 flex-shrink-0 group-hover/item:scale-150 transition-transform"></span>
                    <span className="text-base lg:text-lg text-gray-700 nepali-text">सामाजिक न्याय</span>
                  </li>
                  <li className="flex items-start space-x-3 group/item">
                    <span className="w-2 h-2 bg-mm-accent rounded-full mt-2.5 flex-shrink-0 group-hover/item:scale-150 transition-transform"></span>
                    <span className="text-base lg:text-lg text-gray-700 nepali-text">लोकतान्त्रिक मूल्य</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-transparent hover:border-mm-warm/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mm-warm to-mm-warm/50"></div>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-mm-warm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold nepali-heading">दीर्घकालीन दर्शन</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base lg:text-lg leading-relaxed text-gray-700 nepali-text">
                  एक न्यायसंगत, समान र समृद्ध मधेशको निर्माण जहाँ हरेक व्यक्तिले आफ्नो क्षमता अनुसार विकास गर्न सक्छ। 
                  राष्ट्रिय एकतामा योगदान पुर्‍याउँदै मधेशी पहिचानको संरक्षण।
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Our Approach */}
        <Section background="muted">
          <SectionHeader>
            <SectionTitle>हाम्रो कार्यशैली</SectionTitle>
            <SectionDescription>
              व्यवस्थित र परिणाममुखी दृष्टिकोण
            </SectionDescription>
          </SectionHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { step: '१', title: 'अनुसन्धान', desc: 'समस्याको गहिरो अध्ययन' },
              { step: '२', title: 'संवाद', desc: 'सरोकारवालासँग छलफल' },
              { step: '३', title: 'नीति सिफारिस', desc: 'व्यावहारिक समाधान' },
              { step: '४', title: 'जनदबाब', desc: 'शान्तिपूर्ण आन्दोलन' },
              { step: '५', title: 'अनुगमन', desc: 'कार्यान्वयन निरीक्षण' },
            ].map((item) => (
              <Card key={item.step} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-mm-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold nepali-heading text-lg">{item.step}</span>
                  </div>
                  <CardTitle className="text-base sm:text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* Why Join Us */}
        <Section className="bg-mm-bg/30">
          <SectionHeader centered>
            <SectionTitle className="text-4xl lg:text-5xl font-extrabold">किन हामीसँग जुट्ने?</SectionTitle>
            <SectionDescription className="mx-auto text-lg lg:text-xl max-w-3xl">
              एकल प्रयासभन्दा सामूहिक शक्ति बलियो
            </SectionDescription>
          </SectionHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            <div className="group text-center bg-white rounded-2xl p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-mm-primary/20">
              <div className="w-20 h-20 bg-mm-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="nepali-heading text-2xl lg:text-3xl font-bold mb-4 text-mm-ink">सामूहिक शक्ति</h3>
              <p className="text-gray-600 leading-relaxed nepali-text text-base lg:text-lg">
                व्यक्तिगत प्रयासभन्दा सामूहिक आवाजले बढी प्रभाव पार्छ। हामीसँग जुटेर आफ्नो आवाजलाई शक्तिशाली बनाउनुहोस्।
              </p>
            </div>

            <div className="group text-center bg-white rounded-2xl p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-mm-accent/20">
              <div className="w-20 h-20 bg-mm-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="nepali-heading text-2xl lg:text-3xl font-bold mb-4 text-mm-ink">स्पष्ट लक्ष्य</h3>
              <p className="text-gray-600 leading-relaxed nepali-text text-base lg:text-lg">
                हाम्रा लक्ष्यहरू स्पष्ट र व्यावहारिक छन्। हामी कुनै अस्पष्ट सपनामा होइन, ठोस परिणामका लागि काम गर्छौं।
              </p>
            </div>

            <div className="group text-center bg-white rounded-2xl p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-mm-warm/20">
              <div className="w-20 h-20 bg-mm-warm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="nepali-heading text-2xl lg:text-3xl font-bold mb-4 text-mm-ink">निष्ठा र समर्पण</h3>
              <p className="text-gray-600 leading-relaxed nepali-text text-base lg:text-lg">
                हामी निष्ठावान् र समर्पित छौं। राजनीतिक स्वार्थभन्दा जनताको हित हाम्रो प्राथमिकता हो।
              </p>
            </div>
          </div>
        </Section>

        <JoinStrip />
      </main>

      <Footer />
    </>
  );
}