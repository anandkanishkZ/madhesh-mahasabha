import { Header } from '@/components/Header';
import { BackToTop } from '@/components/BackToTop';
import { Hero } from '@/components/Hero';
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/LinkButton';
import { QuoteBanner } from '@/components/QuoteBanner';
import { PostList } from '@/components/PostList';
import { JoinStrip } from '@/components/JoinStrip';
import { Footer } from '@/components/Footer';
import { Shield, Users, Scale, ArrowRight } from 'lucide-react';
import agendaData from '@/content/agenda.np.json';
import newsData from '@/content/news.json';
import { generateWebsiteSchema } from '@/lib/seo';

export default function Home() {
  const websiteSchema = generateWebsiteSchema('https://madheshmahasabha.com');

  // Get first few agenda items for display
  const keyAgenda = [
    ...agendaData['राज्यमा हिस्सेदारी'].slice(0, 2),
    ...agendaData['समावेशिता र नागरिकता'].slice(0, 2),
    ...agendaData['शिक्षा–रोजगारी–अर्थतन्त्र'].slice(0, 2),
  ];

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      
      <div className="min-h-screen w-full overflow-x-hidden page-enter">
        <main id="main-content">
          <Hero />

          {/* Why MSM Section */}
          <Section className="bg-mm-bg/30">
            <SectionHeader centered>
              <SectionTitle className="text-4xl lg:text-5xl font-extrabold">किन मधेश महासभा?</SectionTitle>
              <SectionDescription className="mx-auto text-lg lg:text-xl max-w-3xl">
                हामी एकता, समानता र अधिकारका लागि मिलेर काम गर्छौं
              </SectionDescription>
            </SectionHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <Card className="group relative overflow-hidden border-2 border-transparent hover:border-mm-primary/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mm-primary to-mm-primary/50"></div>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-mm-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold nepali-heading">अधिकारको रक्षा</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed nepali-text text-base">
                    मधेशी जनताका मौलिक अधिकार र न्यायसंगत प्रतिनिधित्वको सुनिश्चितता गर्दछौं
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-2 border-transparent hover:border-mm-accent/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mm-accent to-mm-accent/50"></div>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-mm-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold nepali-heading">एकता र भाइचारा</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed nepali-text text-base">
                    सबै मधेशी समुदायको एकजुटताले बलियो र समृद्ध मधेश निर्माण गर्छौं
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-2 border-transparent hover:border-mm-warm/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mm-warm to-mm-warm/50"></div>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-mm-warm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Scale className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold nepali-heading">न्याय र समानता</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed nepali-text text-base">
                    सामाजिक न्याय र आर्थिक समानताका आधारमा न्यायपूर्ण समाज निर्माण गर्छौं
                  </p>
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* Key Agenda Section */}
          <Section className="bg-white">
            <SectionHeader centered>
              <SectionTitle className="text-4xl lg:text-5xl font-extrabold">मुख्य कार्यसूची</SectionTitle>
              <SectionDescription className="mx-auto text-lg lg:text-xl max-w-3xl">
                मधेश र मधेशीका लागि हाम्रो प्राथमिकता
              </SectionDescription>
            </SectionHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {keyAgenda.map((item, index) => (
                <Card key={index} className="group relative overflow-hidden border-l-4 border-l-mm-primary hover:border-l-mm-accent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-mm-bg/20">
                  <CardContent className="p-6 lg:p-8">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-mm-primary/10 rounded-full flex items-center justify-center group-hover:bg-mm-primary group-hover:scale-110 transition-all duration-300">
                        <span className="text-base font-bold text-mm-primary group-hover:text-white transition-colors">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed nepali-text text-lg lg:text-xl group-hover:text-mm-ink transition-colors flex-1">
                        {item}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <LinkButton href="/agenda" variant="primary" size="lg" className="group shadow-lg hover:shadow-xl transition-all text-lg px-8 py-6">
                <span>पूर्ण कार्यसूची हेर्नुहोस्</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </LinkButton>
            </div>
          </Section>

          {/* Quote Banner */}
          <QuoteBanner 
            quote="जुन भूमिमा हाम्रो जन्म भएको छ, जुन माटोले हामीलाई हुर्काएको छ, त्यो मधेशको उन्नति र विकासमा हामी सधैं लागिपर्नेछौं।"
            attribution="मधेश महासभाको संकल्प"
          />

          {/* Latest Updates Section */}
          <Section>
            <SectionHeader>
              <SectionTitle>पछिल्ला अपडेटहरू</SectionTitle>
              <SectionDescription>
                मधेश महासभाका गतिविधि र समसामयिक घटनाक्रम
              </SectionDescription>
            </SectionHeader>

            <PostList posts={newsData.slice(0, 6)} />

            <div className="text-center mt-8">
              <LinkButton href="/news" variant="outline" size="lg" className="group">
                सबै समाचार हेर्नुहोस्
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </LinkButton>
            </div>
          </Section>

          {/* Join Call-to-Action */}
          <JoinStrip />
        </main>

        <Footer />
      </div>
      <BackToTop />
    </>
  );
}
