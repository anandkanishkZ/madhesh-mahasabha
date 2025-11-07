import { Footer } from '@/components/Footer';
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/LinkButton';
import { JoinStrip } from '@/components/JoinStrip';
import { CheckCircle, ArrowRight, Target } from 'lucide-react';
import Link from 'next/link';
import agendaData from '@/content/agenda.np.json';
import { generateMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'कार्यसूची',
  description: 'मधेश महासभाको विस्तृत कार्यसूची र योजनाहरू। राज्यमा हिस्सेदारी, समावेशिता, शिक्षा र संघीयता कार्यान्वयनका लागि हाम्रा नीतिहरू।',
  path: '/agenda',
});

export default function Agenda() {
  const workProcess = [
    { step: 'अनुसन्धान', desc: 'गहिरो अध्ययन र तथ्याङ्क संकलन' },
    { step: 'संवाद', desc: 'सरोकारवालासँग व्यापक छलफल' },
    { step: 'नीति सिफारिस', desc: 'व्यावहारिक समाधानको प्रस्ताव' },
    { step: 'जनदबाब', desc: 'शान्तिपूर्ण आन्दोलन र दबाब' },
    { step: 'अनुगमन', desc: 'कार्यान्वयनको नियमित निरीक्षण' },
  ];

  return (
    <>
      <main id="main-content">
        {/* Hero Section */}
        <Section background="pattern" className="py-24">
          <div className="max-w-4xl">
            <h1 className="nepali-heading text-4xl lg:text-5xl font-bold text-mm-ink mb-6">
              हाम्रो कार्यसूची
            </h1>
            <p className="nepali-text text-xl text-gray-700 leading-relaxed">
              मधेश र मधेशी समुदायको अधिकार र समानताका लागि हाम्रा मुख्य प्राथमिकताहरू र कार्ययोजना
            </p>
          </div>
        </Section>

        {/* Main Agenda Items */}
        <Section>
          <div className="space-y-8 lg:space-y-12">
            {Object.entries(agendaData).map(([category, items], index) => (
              <Card key={category} className="overflow-hidden">
                <CardHeader className="bg-mm-primary/10">
                  <div className="flex items-start sm:items-center space-x-3">
                    <div className="w-10 h-10 bg-mm-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold nepali-heading">
                        {index + 1}
                      </span>
                    </div>
                    <CardTitle className="text-xl sm:text-2xl leading-tight">
                      {category}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-mm-primary mt-0.5 flex-shrink-0" />
                        <p className="nepali-text text-gray-700 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* Work Process */}
        <Section background="muted">
          <SectionHeader centered>
            <SectionTitle>हामी कसरी काम गर्छौं</SectionTitle>
            <SectionDescription className="mx-auto">
              व्यवस्थित र परिणाममुखी कार्यशैली
            </SectionDescription>
          </SectionHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
            {workProcess.map((process, index) => (
              <div key={process.step} className="relative">
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-16 h-16 bg-mm-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-xl font-bold nepali-heading">
                        {index + 1}
                      </span>
                    </div>
                    <CardTitle className="text-base lg:text-lg mb-2">
                      {process.step}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{process.desc}</p>
                  </CardContent>
                </Card>
                
                {index < workProcess.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 xl:-right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-mm-primary/60" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Call to Action */}
        <Section>
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-mm-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-mm-primary" />
            </div>
            
            <h2 className="nepali-heading text-3xl lg:text-4xl font-bold text-mm-ink mb-6">
              यी लक्ष्यहरू पूरा गर्न हामीलाई तपाईंको साथ चाहिन्छ
            </h2>
            
            <p className="nepali-text text-lg text-gray-600 mb-8 leading-relaxed">
              मधेश महासभामा सामेल भएर मधेशी समुदायको अधिकार र समानताका लागि सक्रिय योगदान दिनुहोस्। 
              एकै व्यक्तिले सबै परिवर्तन ल्याउन सक्दैन, तर सबै मिलेर अवश्य ल्याउन सक्छौं।
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LinkButton size="lg" href="/join" className="flex items-center space-x-2">
                <span>सदस्यता ग्रहण गर्नुहोस्</span>
                <ArrowRight className="w-5 h-5" />
              </LinkButton>
              
              <LinkButton variant="outline" size="lg" href="/manifesto">
                पूर्ण प्रस्तावना पढ्नुहोस्
              </LinkButton>
            </div>
          </div>
        </Section>

        <JoinStrip />
      </main>

      <Footer />
    </>
  );
}