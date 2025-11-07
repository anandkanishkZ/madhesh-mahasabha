import { Footer } from '@/components/Footer';
import { generateMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Download, 
  FileText, 
  Image, 
  Palette,
  FileType,
  Share2,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Folder,
  BookOpen,
  Camera,
  Layout,
  Shield,
  Info
} from 'lucide-react';

export const metadata: Metadata = generateMetadata({
  title: 'संसाधन र डाउनलोडहरू',
  description: 'मधेश महासभाको प्रस्तावना, लोगो प्याक, ब्राण्ड गाइडलाइन्स र अन्य महत्वपूर्ण संसाधनहरू डाउनलोड गर्नुहोस्।',
  path: '/resources',
});

export default function Resources() {
  const brandColors = [
    { name: 'Primary Green', hex: '#135D3B', var: 'mm-primary', usage: 'मुख्य रङ' },
    { name: 'Accent Red', hex: '#C62828', var: 'mm-accent', usage: 'एक्सेन्ट रङ' },
    { name: 'Warm Yellow', hex: '#F4A300', var: 'mm-warm', usage: 'न्यानो रङ' },
  ];

  const documents = [
    {
      title: 'पूर्ण प्रस्तावना',
      description: 'मधेश महासभाको सम्पूर्ण प्रस्तावना दस्तावेज',
      icon: FileText,
      type: 'PDF',
      size: 'Print View',
      href: '/manifesto',
      available: true
    },
    {
      title: 'कार्यसूची दस्तावेज',
      description: 'प्राथमिकताहरू र कार्ययोजना',
      icon: BookOpen,
      type: 'PDF',
      size: 'Print View',
      href: '/agenda',
      available: true
    },
    {
      title: 'संगठन परिचय',
      description: 'मधेश महासभाको विस्तृत परिचय',
      icon: FileType,
      type: 'PDF',
      size: 'छिट्टै',
      href: '#',
      available: false
    }
  ];

  const brandAssets = [
    {
      title: 'लोगो प्याक',
      description: 'PNG, SVG, र विभिन्न साइजमा',
      icon: Image,
      items: ['PNG (High Res)', 'SVG (Vector)', 'Transparent BG'],
      available: false
    },
    {
      title: 'रङ प्यालेट',
      description: 'ब्राण्ड रङ कोडहरू',
      icon: Palette,
      items: ['HEX कोड', 'RGB मान', 'CSS Variables'],
      available: true
    },
    {
      title: 'टाइपोग्राफी',
      description: 'फन्ट र टेक्स्ट स्टाइल',
      icon: FileType,
      items: ['Noto Sans Devanagari', 'Mukta', 'Baloo Bhai 2'],
      available: true
    }
  ];

  const mediaKit = [
    {
      title: 'प्रेस किट',
      description: 'मिडियाका लागि आधिकारिक सामग्री',
      icon: Camera,
      available: false
    },
    {
      title: 'सोशल मिडिया टेम्प्लेट',
      description: 'Facebook, Twitter, Instagram का लागि',
      icon: Share2,
      available: false
    },
    {
      title: 'प्रजेन्टेसन टेम्प्लेट',
      description: 'PowerPoint र Google Slides',
      icon: Layout,
      available: false
    }
  ];

  return (
    <>
      <main id="main-content" className="bg-gray-50">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-mm-primary/5">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mm-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-mm-accent/5 rounded-full blur-3xl"></div>
          
          <div className="container-custom relative z-10 py-20">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-block mb-6">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
                  <Folder className="w-4 h-4 text-mm-primary" />
                  <span className="nepali-heading text-sm font-semibold text-mm-primary">
                    डाउनलोड सेन्टर
                  </span>
                </div>
              </div>
              
              <h1 className="nepali-heading text-5xl md:text-6xl lg:text-7xl font-bold text-mm-ink mb-6 leading-tight">
                संसाधन र <br />
                <span className="text-mm-primary">डाउनलोडहरू</span>
              </h1>
              
              <p className="nepali-text text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl">
                मधेश महासभाका आधिकारिक दस्तावेजहरू, ब्राण्ड संसाधनहरू र मिडिया किट डाउनलोड गर्नुहोस्
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-mm-primary rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-mm-ink">3</div>
                    <div className="nepali-text text-sm text-gray-600">दस्तावेजहरू</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-mm-accent rounded-lg flex items-center justify-center">
                    <Image className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-mm-ink">6+</div>
                    <div className="nepali-text text-sm text-gray-600">ब्राण्ड एसेट</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documents Section */}
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-mm-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-mm-primary" />
              </div>
              <div>
                <h2 className="nepali-heading text-3xl lg:text-4xl font-bold text-mm-ink">
                  दस्तावेजहरू
                </h2>
                <p className="nepali-text text-gray-600">महत्वपूर्ण दस्तावेज र फाइलहरू</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc, idx) => {
                const Icon = doc.icon;
                return (
                  <div 
                    key={idx}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all group"
                  >
                    <div className="w-16 h-16 bg-mm-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-mm-primary group-hover:scale-110 transition-all">
                      <Icon className="w-8 h-8 text-mm-primary group-hover:text-white transition-colors" />
                    </div>
                    
                    <h3 className="nepali-heading text-xl font-bold text-mm-ink mb-2">
                      {doc.title}
                    </h3>
                    
                    <p className="nepali-text text-gray-600 mb-4 text-sm">
                      {doc.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-gray-500">{doc.type}</span>
                      <span className="text-xs font-medium text-gray-500">{doc.size}</span>
                    </div>
                    
                    {doc.available ? (
                      <Link
                        href={doc.href}
                        target="_blank"
                        className="flex items-center justify-center gap-2 w-full bg-mm-primary text-white px-4 py-3 rounded-lg font-semibold hover:bg-mm-primary/90 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        <span className="nepali-heading">डाउनलोड गर्नुहोस्</span>
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-500 px-4 py-3 rounded-lg font-semibold cursor-not-allowed">
                        <span className="nepali-heading">छिट्टै उपलब्ध</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Brand Guidelines Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container-custom">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-mm-accent/10 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-mm-accent" />
              </div>
              <div>
                <h2 className="nepali-heading text-3xl lg:text-4xl font-bold text-mm-ink">
                  ब्राण्ड गाइडलाइन्स
                </h2>
                <p className="nepali-text text-gray-600">रङ, फन्ट र लोगो उपयोग</p>
              </div>
            </div>

            {/* Color Palette */}
            <div className="mb-12">
              <h3 className="nepali-heading text-2xl font-bold text-mm-ink mb-6">
                ब्राण्ड रङहरू
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {brandColors.map((color, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                    <div 
                      className="h-32 flex items-center justify-center"
                      style={{ backgroundColor: color.hex }}
                    >
                      <div className="text-white text-center">
                        <div className="font-bold text-2xl mb-1">{color.hex}</div>
                        <div className="text-sm opacity-90">--{color.var}</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-mm-ink mb-1">{color.name}</h4>
                      <p className="nepali-text text-sm text-gray-600">{color.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Assets */}
            <div className="mb-12">
              <h3 className="nepali-heading text-2xl font-bold text-mm-ink mb-6">
                ब्राण्ड एसेटहरू
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {brandAssets.map((asset, idx) => {
                  const Icon = asset.icon;
                  return (
                    <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                      <div className="w-14 h-14 bg-mm-warm/10 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="w-7 h-7 text-mm-warm" />
                      </div>
                      
                      <h4 className="nepali-heading text-lg font-bold text-mm-ink mb-2">
                        {asset.title}
                      </h4>
                      
                      <p className="nepali-text text-sm text-gray-600 mb-4">
                        {asset.description}
                      </p>
                      
                      <ul className="space-y-2">
                        {asset.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Media Kit Section */}
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h2 className="nepali-heading text-3xl lg:text-4xl font-bold text-mm-ink">
                  मिडिया किट
                </h2>
                <p className="nepali-text text-gray-600">सोशल मिडिया र प्रजेन्टेसनका लागि</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mediaKit.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 relative overflow-hidden">
                    {!item.available && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
                          छिट्टै
                        </span>
                      </div>
                    )}
                    
                    <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-purple-500" />
                    </div>
                    
                    <h3 className="nepali-heading text-xl font-bold text-mm-ink mb-2">
                      {item.title}
                    </h3>
                    
                    <p className="nepali-text text-gray-600 mb-6">
                      {item.description}
                    </p>
                    
                    <div className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                      item.available 
                        ? 'bg-mm-primary text-white hover:bg-mm-primary/90 cursor-pointer' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}>
                      <Download className="w-4 h-4" />
                      <span className="nepali-heading">
                        {item.available ? 'डाउनलोड गर्नुहोस्' : 'तयारी चरणमा'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container-custom max-w-4xl">
            <div className="bg-mm-primary/5 rounded-3xl p-8 lg:p-12 border-2 border-mm-primary/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-mm-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="nepali-heading text-2xl lg:text-3xl font-bold text-mm-ink mb-3">
                    उपयोग दिशानिर्देश
                  </h2>
                  <p className="nepali-text text-gray-700 leading-relaxed mb-6">
                    मधेश महासभाको ब्राण्ड एसेटहरू प्रयोग गर्दा निम्न दिशानिर्देशहरू पालना गर्नुहोस्:
                  </p>
                </div>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-mm-primary flex-shrink-0 mt-0.5" />
                  <span className="nepali-text text-gray-700">
                    लोगो र ब्राण्ड सामग्री परिवर्तन नगरी मूल रूपमा प्रयोग गर्नुहोस्
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-mm-primary flex-shrink-0 mt-0.5" />
                  <span className="nepali-text text-gray-700">
                    आधिकारिक रङ कोडहरू मात्र प्रयोग गर्नुहोस्
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-mm-primary flex-shrink-0 mt-0.5" />
                  <span className="nepali-text text-gray-700">
                    व्यावसायिक उद्देश्यका लागि लिखित अनुमति आवश्यक छ
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-mm-primary flex-shrink-0 mt-0.5" />
                  <span className="nepali-text text-gray-700">
                    गुणस्तर र स्पष्टता कायम राख्नुहोस्
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="bg-mm-primary rounded-3xl p-12 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Info className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="nepali-heading text-3xl lg:text-4xl font-bold mb-4">
                  अन्य संसाधन चाहिन्छ?
                </h2>
                
                <p className="nepali-text text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  यदि तपाईंलाई अन्य कुनै संसाधन वा जानकारी चाहिन्छ भने हामीलाई सम्पर्क गर्नुहोस्
                </p>
                
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-mm-primary px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all"
                >
                  <span className="nepali-heading">सम्पर्क गर्नुहोस्</span>
                  <ExternalLink className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}