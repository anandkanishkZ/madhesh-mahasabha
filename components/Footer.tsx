import Link from 'next/link';
import { Mail, Facebook, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'प्रस्तावना', href: '/manifesto' },
    { name: 'कार्यसूची', href: '/agenda' },
    { name: 'सदस्यता', href: '/join' },
    { name: 'समाचार', href: '/news' },
  ];

  const supportLinks = [
    { name: 'संसाधन', href: '/resources' },
    { name: 'सम्पर्क', href: '/contact' },
    { name: 'परिचय', href: '/about' },
  ];

  return (
    <footer className="bg-mm-ink text-white" role="contentinfo">
      <div className="container-custom">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-children">
          {/* Brand */}
          <div className="lg:col-span-2 animate-on-scroll-left">
            <h3 className="nepali-heading text-2xl font-bold mb-4 hover-glow">
              मधेश महासभा
            </h3>
            <p className="nepali-text text-gray-300 mb-6 max-w-md">
              मधेश र मधेशीको एकता, समानता र अधिकारका लागि। समान हिस्सेदारी, सम्मान र समृद्धिका साझा अभियान।
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="mailto:mahasabhamadhesh@gmail.com"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 focus-ring rounded-md p-2 hover-lift"
                aria-label="इमेल पठाउनुहोस्"
              >
                <Mail className="w-5 h-5" />
                <span className="text-sm">mahasabhamadhesh@gmail.com</span>
              </a>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="https://facebook.com/madheshmahasabha"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-all duration-300 focus-ring rounded-md p-2 hover-scale hover-glow"
                aria-label="फेसबुकमा फलो गर्नुहोस्"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@madheshmahasabha"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-all duration-300 focus-ring rounded-md p-2 hover-scale hover-glow"
                aria-label="युट्युबमा सब्स्क्राइब गर्नुहोस्"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-on-scroll-right">
            <h4 className="nepali-heading font-semibold mb-4 hover-glow">द्रुत लिङ्कहरू</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-all duration-300 focus-ring rounded-sm hover-lift nav-item"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="animate-on-scroll-right" style={{animationDelay: '0.2s'}}>
            <h4 className="nepali-heading font-semibold mb-4 hover-glow">सहायता</h4>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-all duration-300 focus-ring rounded-sm hover-lift nav-item"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-white/20 py-8 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-white text-base font-medium">
              © {currentYear} मधेश महासभा। सबै अधिकार सुरक्षित।
            </p>
            <div className="text-white text-base">
              <span>
                Developed by:{' '}
                <a
                  href="https://zwickytechnology.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Zwicky Technology
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}