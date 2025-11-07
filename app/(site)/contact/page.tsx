'use client';

import { useState } from 'react';
import { Footer } from '@/components/Footer';
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Mail, MessageSquare, MapPin, CheckCircle, Facebook, Youtube, AlertCircle } from 'lucide-react';
import { submitContactForm, type ContactFormData } from '@/lib/firebaseService';

interface FormData extends ContactFormData {}

interface FormErrors {
  [key: string]: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    organization: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'नाम आवश्यक छ';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'नाम कम्तिमा २ अक्षरको हुनुपर्छ';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'इमेल ठेगाना आवश्यक छ';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्';
    }

    if (formData.phone && formData.phone.trim()) {
      const cleanPhone = formData.phone.replace(/[\s\-\+\(\)]/g, '');
      if (!/^[0-9]{10,}$/.test(cleanPhone)) {
        newErrors.phone = 'मान्य फोन नम्बर प्रविष्ट गर्नुहोस्';
      }
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'विषय आवश्यक छ';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'विषय कम्तिमा ३ अक्षरको हुनुपर्छ';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'संदेश आवश्यक छ';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'संदेश कम्तिमा १० अक्षरको हुनुपर्छ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare data for Firebase submission
      const submissionData: ContactFormData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone ? formData.phone.replace(/[\s\-\+\(\)]/g, '') : '',
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        organization: formData.organization ? formData.organization.trim() : '',
      };

      console.log('Submitting contact form data:', submissionData);

      const result = await submitContactForm(submissionData);

      if (result.success) {
        console.log('Contact form submitted successfully with ID:', result.id);
        setIsSubmitted(true);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          organization: '',
        });
        
        // Clear any existing errors
        setErrors({});
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        console.error('Contact form submission failed:', result.error);
        setSubmitError(result.error || 'संदेश पठाउनमा समस्या भयो। पुनः प्रयास गर्नुहोस्।');
      }
    } catch (error) {
      console.error('Network error during contact form submission:', error);
      setSubmitError('नेटवर्क त्रुटि। इन्टरनेट जडान जाँच गरेर पुनः प्रयास गर्नुहोस्।');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <main id="main-content">
          <Section className="py-24">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="nepali-heading text-3xl lg:text-4xl font-bold text-mm-ink mb-6">
                धन्यवाद!
              </h1>
              
              <p className="nepali-text text-lg text-gray-700 mb-6">
                तपाईंको संदेश पठाइयो। हामी चाँडै जवाफ दिनेछौं।
              </p>
              
              <p className="nepali-text text-sm text-gray-600 mb-8">
                यदि इमेल एप्लिकेसन खुलेन भने, कृपया mahasabhamadhesh@gmail.com मा सिधै इमेल पठाउनुहोस्।
              </p>
              
              <Button asChild>
                <a href="/">गृहपृष्ठमा फर्किनुहोस्</a>
              </Button>
            </div>
          </Section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main id="main-content">
        {/* Hero Section */}
        <Section background="pattern" className="py-16">
          <SectionHeader>
            <SectionTitle as="h1" className="text-4xl lg:text-5xl">
              हामीसँग सम्पर्क गर्नुहोस्
            </SectionTitle>
            <SectionDescription>
              प्रश्न, सुझाव वा सहयोगका लागि सम्पर्कमा रहनुहोस्
            </SectionDescription>
          </SectionHeader>
        </Section>

        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>सम्पर्क जानकारी</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-mm-primary mt-0.5" />
                      <div>
                        <h3 className="nepali-heading font-semibold mb-1">इमेल</h3>
                        <a 
                          href="mailto:mahasabhamadhesh@gmail.com"
                          className="text-mm-primary hover:underline"
                        >
                          mahasabhamadhesh@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-mm-primary mt-0.5" />
                      <div>
                        <h3 className="nepali-heading font-semibold mb-1">स्थान</h3>
                        <p className="text-gray-600">नेपाल</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>सामाजिक संजाल</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <a
                      href="https://facebook.com/madheshmahasabha"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-700 hover:text-mm-primary transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                      <span>Facebook</span>
                    </a>
                    
                    <a
                      href="https://youtube.com/@madheshmahasabha"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-700 hover:text-mm-primary transition-colors"
                    >
                      <Youtube className="w-5 h-5" />
                      <span>YouTube</span>
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>वेबसाइट</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-mm-primary font-mono text-sm">
                    madheshmahasabha.com
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>हामीलाई संदेश पठाउनुहोस्</CardTitle>
                  <p className="nepali-text text-gray-600">
                    तपाईंका प्रश्न, सुझाव वा विचारहरू साझा गर्नुहोस्
                  </p>
                </CardHeader>
                
                <CardContent>
                  {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm nepali-text">{submitError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {/* Name and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label 
                          htmlFor="name" 
                          className="block nepali-text text-sm font-semibold text-gray-700 mb-2"
                        >
                          <Mail className="w-4 h-4 inline mr-2" />
                          तपाईंको नाम *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent transition-colors nepali-text ${
                            errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                          placeholder="तपाईंको पूरा नाम लेख्नुहोस्"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1 nepali-text">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label 
                          htmlFor="email" 
                          className="block nepali-text text-sm font-semibold text-gray-700 mb-2"
                        >
                          <Mail className="w-4 h-4 inline mr-2" />
                          इमेल ठेगाना *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent transition-colors ${
                            errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1 nepali-text">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone and Organization */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label 
                          htmlFor="phone" 
                          className="block nepali-text text-sm font-semibold text-gray-700 mb-2"
                        >
                          <MapPin className="w-4 h-4 inline mr-2" />
                          फोन नम्बर
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent transition-colors nepali-text ${
                            errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                          placeholder="९८XXXXXXXX (वैकल्पिक)"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1 nepali-text">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label 
                          htmlFor="organization" 
                          className="block nepali-text text-sm font-semibold text-gray-700 mb-2"
                        >
                          संस्था/संगठन
                        </label>
                        <input
                          type="text"
                          id="organization"
                          name="organization"
                          value={formData.organization}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent hover:border-gray-400 transition-colors nepali-text"
                          placeholder="तपाईंको संस्था वा संगठन (वैकल्पिक)"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label 
                        htmlFor="subject" 
                        className="block nepali-text text-sm font-semibold text-gray-700 mb-2"
                      >
                        विषय *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent transition-colors nepali-text ${
                          errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="संदेशको विषय लेख्नुहोस्"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1 nepali-text">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label 
                        htmlFor="message" 
                        className="block nepali-text text-sm font-semibold text-gray-700 mb-2"
                      >
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        संदेश *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent transition-colors resize-vertical nepali-text ${
                          errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="तपाईंको संदेश, प्रश्न वा सुझावहरू यहाँ विस्तारमा लेख्नुहोस्..."
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1 nepali-text">{errors.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <Button 
                        type="submit" 
                        size="lg" 
                        disabled={isSubmitting}
                        className="w-full bg-mm-primary hover:bg-mm-secondary text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed nepali-text text-lg"
                      >
                        {isSubmitting ? 'पठाउँदै...' : 'संदेश पठाउनुहोस्'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}