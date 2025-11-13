'use client';

import Link from 'next/link';
import { 
  Mail, 
  Facebook, 
  Youtube, 
  MapPin, 
  Phone,
  ArrowRight,
  FileText,
  Users,
  BookOpen,
  MessageSquare,
  Heart,
  Globe
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'प्रस्तावना', href: '/manifesto', icon: FileText },
    { name: 'कार्यसूची', href: '/agenda', icon: BookOpen },
    { name: 'सदस्यता', href: '/join', icon: Users },
    { name: 'समाचार', href: '/news', icon: MessageSquare },
    { name: 'प्रेस विज्ञप्ति', href: '/press-releases', icon: FileText },
  ];

  const supportLinks = [
    { name: 'संसाधन', href: '/resources', icon: FileText },
    { name: 'सम्पर्क', href: '/contact', icon: Mail },
    { name: 'परिचय', href: '/about', icon: Globe },
  ];

  return (
    <footer className="relative bg-mm-ink text-white overflow-hidden" role="contentinfo">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-mm-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-mm-accent/10 rounded-full blur-3xl"></div>
      
      {/* Wave decoration at top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-gray-50"></path>
        </svg>
      </div>

      <div className="container-custom relative z-10">
        {/* Main footer content */}
        <div className="pt-24 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand Section - Takes more space */}
          <div className="lg:col-span-4">
            {/* Logo/Icon placeholder */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-mm-primary rounded-xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="nepali-heading text-3xl font-bold">
                  मधेश महासभा
                </h3>
                <p className="text-sm text-gray-400">Madhesh Mahasabha</p>
              </div>
            </div>
            
            <p className="nepali-text text-base text-gray-300 mb-6 leading-relaxed">
              मधेश र मधेशीको एकता, समानता र अधिकारका लागि। समान हिस्सेदारी, सम्मान र समृद्धिका साझा अभियान।
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:mahasabhamadhesh@gmail.com"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
                aria-label="इमेल पठाउनुहोस्"
              >
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-mm-primary transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-base">mahasabhamadhesh@gmail.com</span>
              </a>

              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-base nepali-text">मधेश प्रदेश, नेपाल</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="nepali-heading text-base font-semibold mb-3 text-gray-400">सामाजिक संजाल</h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com/madheshmahasabha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all transform hover:scale-110 hover:shadow-lg"
                  aria-label="फेसबुकमा फलो गर्नुहोस्"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://youtube.com/@madheshmahasabha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all transform hover:scale-110 hover:shadow-lg"
                  aria-label="युट्युबमा सब्स्क्राइब गर्नुहोस्"
                >
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="nepali-heading text-xl font-bold mb-5 text-white">द्रुत लिङ्कहरू</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
                    >
                      <Icon className="w-4 h-4 text-mm-primary group-hover:translate-x-1 transition-transform" />
                      <span className="nepali-text text-base">{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2">
            <h4 className="nepali-heading text-xl font-bold mb-5 text-white">सहायता</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
                    >
                      <Icon className="w-4 h-4 text-mm-accent group-hover:translate-x-1 transition-transform" />
                      <span className="nepali-text text-base">{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="nepali-heading text-xl font-bold mb-3 text-white">न्यूजलेटर सब्स्क्राइब गर्नुहोस्</h4>
              <p className="nepali-text text-base text-gray-300 mb-4">
                नवीनतम समाचार र अपडेटहरू प्राप्त गर्नुहोस्
              </p>
              <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="तपाईंको इमेल"
                  className="flex-1 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mm-primary text-base"
                />
                <button
                  type="submit"
                  className="bg-mm-primary hover:bg-mm-primary/90 text-white px-5 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                  aria-label="सब्स्क्राइब गर्नुहोस्"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
              <p className="text-sm text-gray-400 mt-3 nepali-text">
                हामी तपाईंको गोपनीयताको सम्मान गर्छौं
              </p>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <p className="nepali-text text-gray-300 text-base">
                © {currentYear} मधेश महासभा। सबै अधिकार सुरक्षित।
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <Link 
                href="/privacy" 
                className="text-gray-400 hover:text-white text-base transition-colors nepali-text"
              >
                गोपनीयता नीति
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-400 hover:text-white text-base transition-colors nepali-text"
              >
                सर्तहरू
              </Link>
            </div>

            <div className="flex items-center gap-2 text-base">
              <span className="text-white/80">Developed by</span>
              <a
                href="https://zwickytechnology.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-mm-primary transition-all font-semibold"
              >
                Zwicky Technology
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}