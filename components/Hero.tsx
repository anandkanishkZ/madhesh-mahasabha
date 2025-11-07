'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useScrollAnimation } from '@/hooks/useAnimations';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  useScrollAnimation();
  
  return (
    <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center overflow-hidden">
      {/* Background with Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-mm-bg via-white to-mm-bg/50"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-mm-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-mm-accent/5 rounded-full blur-3xl"></div>
      
      {/* Mithila Pattern Overlay */}
      <div className="absolute inset-0 mithila-pattern opacity-30"></div>
      
      <div className="container-custom relative z-10 py-12 lg:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-mm-primary/10 backdrop-blur-sm border border-mm-primary/20 rounded-full px-5 py-2 mb-8 animate-on-scroll">
            <Sparkles className="w-4 h-4 text-mm-primary" />
            <span className="text-sm font-nepali-body font-semibold text-mm-primary">
              एकता, समानता र अधिकारको अभियान
            </span>
          </div>
          
          {/* Main Heading */}
          <h1 className="nepali-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-mm-ink mb-8 leading-[1.25] animate-on-scroll">
            मधेश र मधेशीको
            <span className="block mt-2 bg-gradient-to-r from-mm-primary via-mm-accent to-mm-warm bg-clip-text text-transparent leading-[1.25]">
              एकता, समानता र अधिकार
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="nepali-text text-2xl sm:text-3xl lg:text-4xl text-gray-700 mb-6 max-w-4xl font-medium leading-relaxed animate-on-scroll" style={{animationDelay: '0.1s'}}>
            मधेश महासभा
          </p>
          
          <p className="nepali-text text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl leading-relaxed animate-on-scroll" style={{animationDelay: '0.2s'}}>
            समान हिस्सेदारी, सम्मान र समृद्धिका साझा अभियान
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-16 animate-on-scroll" style={{animationDelay: '0.3s'}}>
            <Button size="lg" asChild className="w-full sm:w-auto group text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
              <Link href="/join" className="flex items-center justify-center space-x-2">
                <span>सदस्यता ग्रहण गर्नुहोस्</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto text-lg px-8 py-6 border-2 hover:bg-mm-primary/5">
              <Link href="/manifesto">प्रस्तावना पढ्नुहोस्</Link>
            </Button>
          </div>
          
          {/* Value Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 stagger-children">
            <div className="group relative bg-white/80 backdrop-blur-sm border-2 border-mm-primary/10 rounded-2xl p-6 lg:p-8 hover:border-mm-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mm-primary to-mm-primary/50 rounded-t-2xl"></div>
              <div className="text-4xl lg:text-5xl font-extrabold text-mm-primary nepali-heading mb-3">
                एकता
              </div>
              <p className="nepali-text text-gray-600 leading-relaxed">
                विभाजन अन्त्य, साझा आवाज
              </p>
            </div>
            
            <div className="group relative bg-white/80 backdrop-blur-sm border-2 border-mm-accent/10 rounded-2xl p-6 lg:p-8 hover:border-mm-accent/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mm-accent to-mm-accent/50 rounded-t-2xl"></div>
              <div className="text-4xl lg:text-5xl font-extrabold text-mm-accent nepali-heading mb-3">
                समानता
              </div>
              <p className="nepali-text text-gray-600 leading-relaxed">
                न्यायिक हिस्सेदारी
              </p>
            </div>
            
            <div className="group relative bg-white/80 backdrop-blur-sm border-2 border-mm-warm/10 rounded-2xl p-6 lg:p-8 hover:border-mm-warm/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mm-warm to-mm-warm/50 rounded-t-2xl"></div>
              <div className="text-4xl lg:text-5xl font-extrabold text-mm-warm nepali-heading mb-3">
                अधिकार
              </div>
              <p className="nepali-text text-gray-600 leading-relaxed">
                जवाफदेहिता सुनिश्चित
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}