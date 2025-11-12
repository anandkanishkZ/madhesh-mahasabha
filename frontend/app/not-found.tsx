import Link from 'next/link';
import { Home, ArrowLeft, Search, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'पृष्ठ फेला परेन - मधेश महासभा',
  description: 'तपाईंले खोजेको पृष्ठ फेला परेन। कृपया फिर्ता गएर अन्य पृष्ठहरू हेर्नुहोस्।',
  robots: 'noindex, nofollow',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-mm-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">म</span>
              </div>
              <span className="nepali-heading text-xl font-bold text-mm-ink">
                मधेश महासभा
              </span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-mm-primary transition-colors">
                गृहपृष्ठ
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-mm-primary transition-colors">
                हाम्रो बारेमा
              </Link>
              <Link href="/news" className="text-gray-700 hover:text-mm-primary transition-colors">
                समाचार
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-mm-primary transition-colors">
                सम्पर्क
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <h1 className="text-9xl sm:text-[12rem] font-bold text-gray-200 select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-mm-primary/10 rounded-full p-6">
                  <Search className="w-16 h-16 text-mm-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="nepali-heading text-3xl sm:text-4xl font-bold text-mm-ink mb-4">
              पृष्ठ फेला परेन
            </h2>
            <p className="nepali-text text-lg text-gray-600 mb-6 leading-relaxed">
              माफ गर्नुहोस्, तपाईंले खोजेको पृष्ठ अवस्थित छैन। यो पृष्ठ हटाइएको, स्थानान्तरण गरिएको वा अस्थायी रूपमा अनुपलब्ध हुन सक्छ।
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              asChild 
              className="bg-mm-primary hover:bg-mm-primary/90 text-white px-6 py-3"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                गृहपृष्ठमा फिर्ता जानुहोस्
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="border-mm-primary text-mm-primary hover:bg-mm-primary hover:text-white px-6 py-3"
            >
              <Link href="javascript:history.back()" className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                पछाडि जानुहोस्
              </Link>
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="nepali-heading text-xl font-semibold text-mm-ink mb-4">
              तपाईं यी पृष्ठहरू खोज्दै हुनुहुन्छ?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link 
                href="/about" 
                className="text-mm-primary hover:text-mm-primary/80 transition-colors text-sm font-medium"
              >
                हाम्रो बारेमा
              </Link>
              <Link 
                href="/manifesto" 
                className="text-mm-primary hover:text-mm-primary/80 transition-colors text-sm font-medium"
              >
                घोषणापत्र
              </Link>
              <Link 
                href="/news" 
                className="text-mm-primary hover:text-mm-primary/80 transition-colors text-sm font-medium"
              >
                समाचार
              </Link>
              <Link 
                href="/join" 
                className="text-mm-primary hover:text-mm-primary/80 transition-colors text-sm font-medium"
              >
                सदस्यता
              </Link>
              <Link 
                href="/mission-representative" 
                className="text-mm-primary hover:text-mm-primary/80 transition-colors text-sm font-medium"
              >
                मिसन प्रतिनिधि
              </Link>
              <Link 
                href="/agenda" 
                className="text-mm-primary hover:text-mm-primary/80 transition-colors text-sm font-medium"
              >
                एजेन्डा
              </Link>
              <Link 
                href="/resources" 
                className="text-mm-primary hover:text-mm-primary/80 transition-colors text-sm font-medium"
              >
                स्रोतहरू
              </Link>
              <Link 
                href="/contact" 
                className="text-mm-primary hover:text-mm-primary/80 transition-colors text-sm font-medium"
              >
                सम्पर्क
              </Link>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-mm-primary/5 border border-mm-primary/20 rounded-lg p-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-mm-primary" />
              <h3 className="nepali-heading text-lg font-semibold text-mm-ink">
                सहायता चाहिन्छ?
              </h3>
            </div>
            <p className="nepali-text text-sm text-gray-700 mb-4">
              यदि तपाईंलाई कुनै समस्या छ वा सहायता चाहिन्छ भने कृपया हामीलाई सम्पर्क गर्नुहोस्।
            </p>
            <Button 
              asChild 
              size="sm" 
              className="bg-mm-primary hover:bg-mm-primary/90 text-white"
            >
              <Link href="/contact">
                सम्पर्क गर्नुहोस्
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}