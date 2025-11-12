import React from 'react';
import { Shield, Eye, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

interface LegalSidebarProps {
  currentPage: 'privacy' | 'terms';
}

export const LegalSidebar: React.FC<LegalSidebarProps> = ({ currentPage }) => {
  const navItems = [
    {
      href: '/privacy',
      label: 'गोपनीयता नीति',
      icon: Shield,
      active: currentPage === 'privacy'
    },
    {
      href: '/terms',
      label: 'सर्तहरू र शर्तहरू',
      icon: Eye,
      active: currentPage === 'terms'
    }
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-24 bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="nepali-heading text-lg font-semibold text-gray-900 mb-4">
          कानुनी जानकारी
        </h3>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-mm-primary text-white'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-mm-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="nepali-text font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="nepali-heading text-sm font-semibold text-gray-900 mb-3">
            सम्पर्क जानकारी
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>mahasabhamadhesh@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>+977-1-4567890</span>
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5" />
              <span>काठमाडौं, नेपाल</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="nepali-heading text-sm font-semibold text-gray-900 mb-3">
            द्रुत लिङ्कहरू
          </h4>
          <div className="space-y-2">
            <Link 
              href="/about" 
              className="block text-sm text-gray-600 hover:text-mm-primary transition-colors"
            >
              हाम्रो बारेमा
            </Link>
            <Link 
              href="/contact" 
              className="block text-sm text-gray-600 hover:text-mm-primary transition-colors"
            >
              सम्पर्क
            </Link>
            <Link 
              href="/join" 
              className="block text-sm text-gray-600 hover:text-mm-primary transition-colors"
            >
              सदस्यता
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};