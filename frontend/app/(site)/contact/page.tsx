'use client';

import { useState } from 'react';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { 
  User, 
  Mail, 
  MessageSquare, 
  MapPin, 
  CheckCircle, 
  Facebook, 
  Youtube, 
  AlertCircle,
  Phone,
  Send,
  Building2,
  Globe,
  Sparkles,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  BadgeCheck,
  CircleCheckBig
} from 'lucide-react';
import { submitContactMessage } from '@/lib/api';
import Link from 'next/link';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  organization: string;
}

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
      // Prepare data for backend API submission
      const submissionData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone ? formData.phone.replace(/[\s\-\+\(\)]/g, '') : undefined,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        organization: formData.organization ? formData.organization.trim() : undefined,
      };

      console.log('Submitting contact form data to backend API:', submissionData);

      const result = await submitContactMessage(submissionData);

      if (result.success) {
        console.log('Contact form submitted successfully:', result.data);
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
        <main id="main-content" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mm-primary/5 via-white to-mm-accent/5 relative overflow-hidden">
          {/* Professional background elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-mm-primary/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-tl from-mm-accent/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-gradient-to-r from-mm-primary/5 to-mm-accent/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-3xl mx-auto text-center px-4 py-8 relative z-10">
            {/* Success Icon with professional animation */}
            <div className="relative inline-block mb-10">
              <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30 relative">
                <Send className="w-14 h-14 text-white" strokeWidth={2} />
                
                {/* Subtle pulse ring */}
                <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-20"></div>
              </div>
              
              {/* Professional corner accents */}
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-mm-primary rounded-full shadow-lg"></div>
              <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-mm-accent rounded-full shadow-lg"></div>
            </div>
            
            {/* Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-mm-ink to-mm-primary bg-clip-text text-transparent mb-6" style={{ fontFamily: 'Khand, sans-serif' }}>
              धन्यवाद!
            </h1>
            
            {/* Main success card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-gray-100 mb-10">
              {/* Success indicator */}
              <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-200">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              
              <div className="space-y-4 mb-8">
                <p className="nepali-text text-2xl text-mm-ink font-semibold">
                  तपाईंको संदेश सफलतापूर्वक पठाइयो।
                </p>
                
                <p className="nepali-text text-lg text-gray-600 leading-relaxed">
                  हामी छिट्टै तपाईंलाई जवाफ दिनेछौं।
                </p>
              </div>
              
              {/* Information box */}
              <div className="bg-gradient-to-r from-mm-primary/5 to-mm-accent/5 rounded-2xl p-6 border border-mm-primary/10">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-mm-primary rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="nepali-text text-sm text-gray-700 font-medium mb-1">
                      सिधै सम्पर्कका लागि
                    </p>
                    <a 
                      href="mailto:mahasabhamadhesh@gmail.com"
                      className="text-mm-primary font-semibold hover:underline transition-all"
                    >
                      mahasabhamadhesh@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Next steps section */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-100">
              <h2 className="nepali-heading text-lg font-semibold text-mm-ink mb-4">
                अर्को चरण
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-mm-primary/10 rounded-full flex items-center justify-center mb-2">
                    <span className="text-mm-primary font-bold">1</span>
                  </div>
                  <p className="nepali-text text-gray-600 text-center">संदेश प्राप्त भयो</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-mm-primary/10 rounded-full flex items-center justify-center mb-2">
                    <span className="text-mm-primary font-bold">2</span>
                  </div>
                  <p className="nepali-text text-gray-600 text-center">समीक्षा हुँदैछ</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-mm-primary/10 rounded-full flex items-center justify-center mb-2">
                    <span className="text-mm-primary font-bold">3</span>
                  </div>
                  <p className="nepali-text text-gray-600 text-center">चाँडै जवाफ आउँदैछ</p>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setIsSubmitted(false)} 
                className="bg-gradient-to-r from-mm-primary to-mm-primary/90 hover:from-mm-primary/90 hover:to-mm-primary text-white px-8 py-6 text-lg shadow-lg shadow-mm-primary/20 transition-all hover:shadow-xl hover:shadow-mm-primary/30 group"
              >
                <span className="nepali-text">अर्को संदेश पठाउनुहोस्</span>
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                className="px-8 py-6 text-lg border-2 border-gray-300 hover:border-mm-primary hover:bg-mm-primary/5 transition-all nepali-text"
                asChild
              >
                <Link href="/">गृहपृष्ठमा फर्किनुहोस्</Link>
              </Button>
            </div>
            
            {/* Social media reminder */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <p className="nepali-text text-sm text-gray-500 mb-3">हामीलाई सामाजिक सञ्जालमा पनि फलो गर्नुहोस्</p>
              <div className="flex gap-3 justify-center">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all group"
                >
                  <Facebook className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 hover:bg-red-600 rounded-full flex items-center justify-center transition-all group"
                >
                  <Youtube className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main id="main-content" className="bg-gray-50">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-mm-primary/5">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-mm-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-mm-accent/5 rounded-full blur-3xl"></div>
          
          <div className="container-custom relative z-10 py-20">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-block mb-6">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
                  <Mail className="w-4 h-4 text-mm-primary" />
                  <span className="nepali-heading text-sm font-semibold text-mm-primary">
                    हामीसँग कुरा गर्नुहोस्
                  </span>
                </div>
              </div>
              
              <h1 className="nepali-heading text-5xl md:text-6xl lg:text-7xl font-bold text-mm-ink mb-6 leading-tight">
                सम्पर्क गर्नुहोस्
              </h1>
              
              <p className="nepali-text text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                प्रश्न, सुझाव वा सहयोगका लागि हामीलाई सम्पर्क गर्नुहोस्। हामी तपाईंको सहभागितालाई स्वागत गर्दछौं।
              </p>

              {/* Quick Contact Stats */}
              <div className="flex flex-wrap gap-8 justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-mm-primary rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-mm-ink">24/7</div>
                    <div className="nepali-text text-sm text-gray-600">इमेल सहयोग</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-mm-accent rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-mm-ink">२४ घण्टा</div>
                    <div className="nepali-text text-sm text-gray-600">जवाफ समय</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information Cards */}
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {/* Email */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-mm-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-mm-primary group-hover:scale-110 transition-all">
                  <Mail className="w-7 h-7 text-mm-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="nepali-heading text-lg font-bold text-mm-ink mb-2">
                  इमेल ठेगाना
                </h3>
                <a 
                  href="mailto:mahasabhamadhesh@gmail.com"
                  className="text-mm-primary hover:underline text-sm break-all"
                >
                  mahasabhamadhesh@gmail.com
                </a>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-mm-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-mm-accent group-hover:scale-110 transition-all">
                  <MapPin className="w-7 h-7 text-mm-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="nepali-heading text-lg font-bold text-mm-ink mb-2">
                  स्थान
                </h3>
                <p className="nepali-text text-gray-600 text-sm">
                  मधेश प्रदेश, नेपाल
                </p>
              </div>

              {/* Facebook */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:scale-110 transition-all">
                  <Facebook className="w-7 h-7 text-blue-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="nepali-heading text-lg font-bold text-mm-ink mb-2">
                  Facebook
                </h3>
                <a 
                  href="https://facebook.com/madheshmahasabha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm flex items-center gap-1"
                >
                  <span>@madheshmahasabha</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>

              {/* YouTube */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500 group-hover:scale-110 transition-all">
                  <Youtube className="w-7 h-7 text-red-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="nepali-heading text-lg font-bold text-mm-ink mb-2">
                  YouTube
                </h3>
                <a 
                  href="https://youtube.com/@madheshmahasabha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-500 hover:underline text-sm flex items-center gap-1"
                >
                  <span>@madheshmahasabha</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Contact Form and Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 lg:p-12">
                  <div className="mb-8">
                    <h2 className="nepali-heading text-3xl lg:text-4xl font-bold text-mm-ink mb-4">
                      संदेश पठाउनुहोस्
                    </h2>
                    <p className="nepali-text text-lg text-gray-600">
                      तपाईंका प्रश्न, सुझाव वा विचारहरू साझा गर्नुहोस्
                    </p>
                  </div>

                  {submitError && (
                    <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-base text-red-700 nepali-text font-medium">{submitError}</p>
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
                          तपाईंको नाम *
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mm-primary/50 transition-all text-lg ${
                              errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-mm-primary'
                            }`}
                            placeholder="तपाईंको पूरा नाम"
                          />
                        </div>
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-2 nepali-text flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label 
                          htmlFor="email" 
                          className="block nepali-text text-sm font-semibold text-gray-700 mb-2"
                        >
                          इमेल ठेगाना *
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <Mail className="w-5 h-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mm-primary/50 transition-all text-lg ${
                              errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-mm-primary'
                            }`}
                            placeholder="your.email@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-2 nepali-text flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.email}
                          </p>
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
                          फोन नम्बर
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <Phone className="w-5 h-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mm-primary/50 transition-all text-lg ${
                              errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-mm-primary'
                            }`}
                            placeholder="९८XXXXXXXX (वैकल्पिक)"
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-2 nepali-text flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label 
                          htmlFor="organization" 
                          className="block nepali-text text-sm font-semibold text-gray-700 mb-2"
                        >
                          संस्था/संगठन
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="organization"
                            name="organization"
                            value={formData.organization}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mm-primary/50 hover:border-gray-400 focus:border-mm-primary transition-all text-lg"
                            placeholder="तपाईंको संस्था (वैकल्पिक)"
                          />
                        </div>
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
                        className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mm-primary/50 transition-all text-lg ${
                          errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-mm-primary'
                        }`}
                        placeholder="संदेशको विषय लेख्नुहोस्"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-2 nepali-text flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label 
                        htmlFor="message" 
                        className="block nepali-text text-sm font-semibold text-gray-700 mb-2"
                      >
                        संदेश *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mm-primary/50 transition-all resize-none text-lg ${
                          errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-mm-primary'
                        }`}
                        placeholder="तपाईंको संदेश, प्रश्न वा सुझावहरू यहाँ विस्तारमा लेख्नुहोस्..."
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-2 nepali-text flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-mm-primary text-white py-5 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            <span className="nepali-heading">पठाउँदै...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3 nepali-heading">
                            <Send className="w-6 h-6" />
                            <span>संदेश पठाउनुहोस्</span>
                          </div>
                        )}
                      </Button>

                      <p className="text-sm text-gray-500 mt-4 text-center nepali-text">
                        * आवश्यक क्षेत्रहरू। तपाईंको जानकारी सुरक्षित राखिनेछ।
                      </p>
                    </div>
                  </form>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Website Info */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-mm-primary" />
                    <h3 className="nepali-heading text-xl font-bold text-mm-ink">
                      वेबसाइट
                    </h3>
                  </div>
                  <p className="text-mm-primary font-mono text-sm mb-2">
                    madheshmahasabha.com
                  </p>
                  <p className="nepali-text text-xs text-gray-600">
                    आधिकारिक वेबसाइट
                  </p>
                </div>

                {/* FAQ Quick Links */}
                <div className="bg-mm-primary rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="w-5 h-5" />
                    <h3 className="nepali-heading text-xl font-bold">
                      सामान्य प्रश्नहरू
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="nepali-text text-sm">सदस्यता कसरी लिने?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="nepali-text text-sm">हाम्रो लक्ष्य के हो?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="nepali-text text-sm">कसरी योगदान गर्ने?</span>
                    </li>
                  </ul>
                  <Link 
                    href="/about"
                    className="inline-flex items-center gap-2 bg-white text-mm-primary px-4 py-2 rounded-lg font-semibold hover:bg-white/90 transition-all mt-4 text-sm"
                  >
                    <span className="nepali-heading">थप जान्नुहोस्</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="nepali-heading text-lg font-bold text-mm-ink mb-4">
                    द्रुत लिङ्कहरू
                  </h3>
                  <div className="space-y-3">
                    <Link 
                      href="/join" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-mm-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-mm-primary/10 rounded-lg flex items-center justify-center group-hover:bg-mm-primary transition-colors">
                        <User className="w-5 h-5 text-mm-primary group-hover:text-white transition-colors" />
                      </div>
                      <span className="nepali-text font-medium text-gray-700 group-hover:text-mm-primary">
                        सदस्यता लिनुहोस्
                      </span>
                    </Link>
                    
                    <Link 
                      href="/manifesto" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-mm-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-mm-accent/10 rounded-lg flex items-center justify-center group-hover:bg-mm-accent transition-colors">
                        <Globe className="w-5 h-5 text-mm-accent group-hover:text-white transition-colors" />
                      </div>
                      <span className="nepali-text font-medium text-gray-700 group-hover:text-mm-accent">
                        प्रस्तावना पढ्नुहोस्
                      </span>
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}