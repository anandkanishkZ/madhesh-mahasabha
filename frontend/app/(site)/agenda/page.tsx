import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/LinkButton';
import { JoinStrip } from '@/components/JoinStrip';
import { 
  CheckCircle, 
  ArrowRight, 
  Target, 
  Users, 
  Scale, 
  GraduationCap, 
  Building2, 
  Vote,
  ListChecks,
  TrendingUp,
  Award,
  Globe
} from 'lucide-react';
import agendaData from '@/content/agenda.np.json';
import { generateMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'कार्यसूची',
  description: 'मधेश महासभाको विस्तृत कार्यसूची र योजनाहरू। राज्यमा हिस्सेदारी, समावेशिता, शिक्षा र संघीयता कार्यान्वयनका लागि हाम्रा नीतिहरू।',
  path: '/agenda',
});

export default function Agenda() {
  const categoryIcons: Record<string, any> = {
    'राज्यमा हिस्सेदारी': Users,
    'समावेशिता र नागरिकता': Scale,
    'शिक्षा–रोजगारी–अर्थतन्त्र': GraduationCap,
    'संघीयता कार्यान्वयन': Building2,
    'जवाफदेह राजनीतिक संस्कृति': Vote,
  };

  const workProcess = [
    { step: 'अनुसन्धान', desc: 'गहिरो अध्ययन र तथ्याङ्क संकलन', icon: ListChecks },
    { step: 'संवाद', desc: 'सरोकारवालासँग व्यापक छलफल', icon: Users },
    { step: 'नीति सिफारिस', desc: 'व्यावहारिक समाधानको प्रस्ताव', icon: Target },
    { step: 'जनदबाब', desc: 'शान्तिपूर्ण आन्दोलन र दबाब', icon: TrendingUp },
    { step: 'अनुगमन', desc: 'कार्यान्वयनको नियमित निरीक्षण', icon: Award },
  ];

  const stats = [
    { number: '5', label: 'मुख्य प्राथमिकता क्षेत्र' },
    { number: '25+', label: 'कार्ययोजना बुँदाहरू' },
    { number: '100%', label: 'पारदर्शी कार्यान्वयन' },
  ];

  return (
    <>
      <main id="main-content" className="bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <Section className="py-16 lg:py-24 bg-gradient-to-br from-mm-primary/5 via-white to-mm-accent/5 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-mm-primary/5 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-mm-accent/5 rounded-full blur-3xl -z-0"></div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
                <Globe className="w-5 h-5 text-mm-primary" />
                <span className="nepali-heading text-sm font-semibold text-mm-primary">
                  हाम्रो कार्यसूची
                </span>
              </div>
            </div>
            
            <h1 className="nepali-heading text-5xl md:text-6xl lg:text-7xl font-bold text-mm-ink mb-6 leading-tight">
              परिवर्तनको
              <span className="text-mm-primary"> रोडम्याप</span>
            </h1>
            
            <p className="nepali-text text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-12">
              मधेश र मधेशी समुदायको अधिकार, समानता र समृद्धिका लागि हाम्रा ठोस कार्ययोजनाहरू
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {stats.map((stat, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="nepali-heading text-3xl lg:text-4xl font-bold text-mm-primary mb-1">
                    {stat.number}
                  </div>
                  <div className="nepali-text text-xs lg:text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Main Agenda Items */}
        <Section className="py-12 lg:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="nepali-heading text-3xl lg:text-4xl font-bold text-mm-ink mb-4">
                हाम्रा प्राथमिकता क्षेत्रहरू
              </h2>
              <p className="nepali-text text-lg text-gray-600 max-w-2xl mx-auto">
                पाँच मुख्य क्षेत्रमा केन्द्रित व्यापक कार्ययोजना
              </p>
            </div>

            <div className="space-y-8">
              {Object.entries(agendaData).map(([category, items], index) => {
                const IconComponent = categoryIcons[category] || Target;
                const colors = [
                  'from-blue-500/10 to-blue-500/5 border-blue-500',
                  'from-green-500/10 to-green-500/5 border-green-500',
                  'from-purple-500/10 to-purple-500/5 border-purple-500',
                  'from-orange-500/10 to-orange-500/5 border-orange-500',
                  'from-red-500/10 to-red-500/5 border-red-500',
                ];
                const iconColors = [
                  'bg-blue-500',
                  'bg-green-500',
                  'bg-purple-500',
                  'bg-orange-500',
                  'bg-red-500',
                ];
                
                return (
                  <div 
                    key={category} 
                    className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  >
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${colors[index % 5]} p-6 lg:p-8 border-l-4`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 lg:w-16 lg:h-16 ${iconColors[index % 5]} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="nepali-heading text-sm font-semibold text-gray-500">
                              प्राथमिकता {index + 1}
                            </span>
                          </div>
                          <h3 className="nepali-heading text-2xl lg:text-3xl font-bold text-mm-ink">
                            {category}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 lg:p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {items.map((item, itemIndex) => (
                          <div 
                            key={itemIndex} 
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group/item"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-6 h-6 bg-mm-primary/10 rounded-full flex items-center justify-center group-hover/item:bg-mm-primary group-hover/item:scale-110 transition-all">
                                <CheckCircle className="w-4 h-4 text-mm-primary group-hover/item:text-white" />
                              </div>
                            </div>
                            <p className="nepali-text text-base lg:text-lg text-gray-700 leading-relaxed">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* Work Process */}
        <Section className="py-12 lg:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="nepali-heading text-3xl lg:text-4xl font-bold text-mm-ink mb-4">
                हामी कसरी काम गर्छौं
              </h2>
              <p className="nepali-text text-lg text-gray-600">
                व्यवस्थित र परिणाममुखी कार्यशैली
              </p>
            </div>

            {/* Desktop Timeline */}
            <div className="hidden lg:block relative">
              {/* Connection Line */}
              <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-mm-primary via-mm-accent to-mm-primary"></div>
              
              <div className="grid grid-cols-5 gap-6">
                {workProcess.map((process, index) => {
                  const IconComponent = process.icon;
                  return (
                    <div key={process.step} className="relative">
                      {/* Number Badge */}
                      <div className="w-20 h-20 bg-mm-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10 ring-4 ring-white">
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
                        <h3 className="nepali-heading text-xl font-bold text-mm-ink mb-2 text-center">
                          {process.step}
                        </h3>
                        <p className="nepali-text text-sm text-gray-600 text-center">
                          {process.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Vertical Timeline */}
            <div className="lg:hidden space-y-4">
              {workProcess.map((process, index) => {
                const IconComponent = process.icon;
                return (
                  <div key={process.step} className="relative">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 bg-mm-primary rounded-full flex items-center justify-center shadow-lg">
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        {index < workProcess.length - 1 && (
                          <div className="w-1 h-16 bg-mm-primary/20 mt-2"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <h3 className="nepali-heading text-lg font-bold text-mm-ink mb-2">
                          {index + 1}. {process.step}
                        </h3>
                        <p className="nepali-text text-sm text-gray-600">
                          {process.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* Call to Action */}
        <Section className="py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-mm-primary rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-white/10 rounded-full"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <Target className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="nepali-heading text-3xl lg:text-4xl font-bold mb-4">
                  यी लक्ष्यहरू पूरा गर्न हामीलाई तपाईंको साथ चाहिन्छ
                </h2>
                
                <p className="nepali-text text-lg lg:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
                  मधेश महासभामा सामेल भएर मधेशी समुदायको अधिकार र समानताका लागि सक्रिय योगदान दिनुहोस्। 
                  एकै व्यक्तिले सबै परिवर्तन ल्याउन सक्दैन, तर सबै मिलेर अवश्य ल्याउन सक्छौं।
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <LinkButton 
                    href="/join" 
                    className="bg-white text-mm-primary hover:bg-gray-50 flex items-center justify-center gap-2 text-base lg:text-lg px-8 py-4"
                  >
                    <span>सदस्यता ग्रहण गर्नुहोस्</span>
                    <ArrowRight className="w-5 h-5" />
                  </LinkButton>
                  
                  <LinkButton 
                    href="/manifesto"
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-base lg:text-lg px-8 py-4"
                  >
                    पूर्ण प्रस्तावना पढ्नुहोस्
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <JoinStrip />
      </main>

      <Footer />
    </>
  );
}