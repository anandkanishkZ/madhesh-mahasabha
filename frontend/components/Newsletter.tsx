'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Mail } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link for newsletter subscription
    const subject = 'मधेश महासभा न्यूजलेटर सब्स्क्रिप्शन';
    const body = `कृपया मलाई मधेश महासभाको न्यूजलेटरमा सब्स्क्राइब गर्नुहोस्।\n\nइमेल: ${email}`;
    const mailtoUrl = `mailto:mahasabhamadhesh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoUrl;
    setIsSubmitted(true);
    setEmail('');
    
    // Reset submission state after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Mail className="w-6 h-6 text-mm-primary" />
        <h3 className="nepali-heading text-xl font-bold text-mm-ink">
          न्यूजलेटर सब्स्क्रिप्शन
        </h3>
      </div>
      
      <p className="nepali-text text-gray-600 mb-6">
        नियमित अपडेट र महत्वपूर्ण घटनाक्रमहरूको जानकारी पाउनुहोस्।
      </p>

      {isSubmitted ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="nepali-text text-green-800">
            धन्यवाद! तपाईंको सब्स्क्रिप्शन अनुरोध पठाइयो।
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newsletter-email" className="sr-only">
              इमेल ठेगाना
            </label>
            <input
              type="email"
              id="newsletter-email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="तपाईंको इमेल ठेगाना"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent nepali-text"
            />
          </div>
          
          <Button type="submit" className="w-full">
            सब्स्क्राइब गर्नुहोस्
          </Button>
        </form>
      )}
      
      <p className="nepali-text text-sm text-gray-500 mt-4">
        नोट: यो हाल प्लेसहोल्डर मात्र हो। चाँडै स्वचालित न्यूजलेटर सेवा सक्रिय हुनेछ।
      </p>
    </div>
  );
}