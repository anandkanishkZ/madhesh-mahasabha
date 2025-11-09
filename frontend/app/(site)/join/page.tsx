'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/Footer';
import { submitJoinForm } from '@/lib/firebaseService';
import { 
  CheckCircle, 
  Users, 
  Shield, 
  Heart, 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  UserCheck, 
  ChevronDown,
  Sparkles,
  Target,
  Award,
  Globe
} from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  education: string;
  birthDate: string;
  gender: string;
  motivations: string[];
  skills: string[];
  availability: string;
  additionalInfo: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function JoinPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    education: '',
    birthDate: '',
    gender: '',
    motivations: [],
    skills: [],
    availability: '',
    additionalInfo: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'पूरा नाम आवश्यक छ';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'नाम कम्तिमा २ अक्षरको हुनुपर्छ';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'इमेल ठेगाना आवश्यक छ';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'फोन नम्बर आवश्यक छ';
    } else if (!/^[0-9]{10,}$/.test(formData.phone.replace(/[\s\-\+\(\)]/g, ''))) {
      newErrors.phone = 'मान्य फोन नम्बर प्रविष्ट गर्नुहोस्';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'ठेगाना आवश्यक छ';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'ठेगाना कम्तिमा ५ अक्षरको हुनुपर्छ';
    }

    if (!formData.additionalInfo.trim()) {
      newErrors.additionalInfo = 'सामेल हुने कारण आवश्यक छ';
    } else if (formData.additionalInfo.trim().length < 20) {
      newErrors.additionalInfo = 'कम्तिमा २० अक्षरमा आफ्नो कारण लेख्नुहोस्';
    }

    // Set motivations based on additionalInfo for Firebase compatibility
    if (formData.additionalInfo.trim()) {
      formData.motivations = [formData.additionalInfo.trim()];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // For now, handle motivations as a single string that we'll convert to array
    if (name === 'motivations') {
      setFormData(prev => ({ ...prev, [name]: [value] }));
    } else if (name === 'skills') {
      setFormData(prev => ({ ...prev, [name]: value.split(',').map(s => s.trim()).filter(s => s) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

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
      const submissionData = {
        ...formData,
        // Ensure motivations array is populated
        motivations: formData.additionalInfo ? [formData.additionalInfo] : [],
        // Set default values for optional fields
        skills: formData.skills.length > 0 ? formData.skills : [],
        availability: formData.availability || 'flexible',
        // Clean phone number
        phone: formData.phone.replace(/[\s\-\+\(\)]/g, ''),
        // Trim all string fields
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        address: formData.address.trim(),
        occupation: formData.occupation.trim() || 'अन्य',
        education: formData.education.trim() || 'अन्य',
        gender: formData.gender || 'अन्य',
      };

      console.log('Submitting form data:', submissionData);

      const result = await submitJoinForm(submissionData);

      if (result.success) {
        console.log('Form submitted successfully with ID:', result.id);
        setIsSubmitted(true);
        
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          address: '',
          occupation: '',
          education: '',
          birthDate: '',
          gender: '',
          motivations: [],
          skills: [],
          availability: '',
          additionalInfo: '',
        });
        
        // Clear any existing errors
        setErrors({});
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        console.error('Form submission failed:', result.error);
        setSubmitError(result.error || 'फारम पेश गर्नमा समस्या भयो। पुनः प्रयास गर्नुहोस्।');
      }
    } catch (error) {
      console.error('Network error during form submission:', error);
      setSubmitError('नेटवर्क त्रुटि। इन्टरनेट जडान जाँच गरेर पुनः प्रयास गर्नुहोस्।');
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isSubmitted) {
    return (
      <>
        <main id="main-content" className="min-h-screen flex items-center justify-center bg-green-50 relative overflow-hidden">
          {/* Animated background circles */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-mm-primary/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          
          <div className="max-w-2xl mx-auto text-center px-4 relative z-10">
            {/* Success Icon with animation */}
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
              </div>
              {/* Decorative rings */}
              <div className="absolute inset-0 w-32 h-32 bg-green-300 rounded-full animate-ping opacity-20"></div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
              <div className="absolute -bottom-2 -left-2">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse delay-500" />
              </div>
            </div>
            
            <h1 className="nepali-heading text-4xl lg:text-5xl font-bold text-mm-ink mb-6">
              स्वागत छ मधेश महासभामा!
            </h1>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              
              <p className="nepali-text text-xl text-gray-700 mb-4">
                तपाईंको सदस्यता आवेदन सफलतापूर्वक पेश भएको छ।
              </p>
              
              <p className="nepali-text text-lg text-gray-600 mb-6">
                हामी छिट्टै तपाईंलाई सम्पर्क गर्नेछौं र मधेश महासभाको गतिविधिहरूमा सहभागी गराउनेछौं।
              </p>
              
              <div className="bg-mm-primary/5 rounded-xl p-4 border border-mm-primary/20">
                <p className="nepali-text text-sm text-mm-primary font-semibold">
                  ✨ तपाईंको योगदानले मधेशी समुदायको सशक्तिकरणमा महत्वपूर्ण भूमिका खेल्नेछ।
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setIsSubmitted(false)} 
                className="bg-mm-primary hover:bg-mm-primary/90 text-white px-8 py-4 text-lg"
              >
                अर्को आवेदन पेश गर्नुहोस्
              </Button>
              <Button 
                variant="outline" 
                className="px-8 py-4 text-lg border-2"
                asChild
              >
                <a href="/">गृहपृष्ठमा फर्किनुहोस्</a>
              </Button>
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
        <section className="relative min-h-[80vh] flex items-center overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-mm-primary/5"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-mm-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-mm-accent/5 rounded-full blur-3xl"></div>
          
          <div className="container-custom relative z-10 py-20">
            <div className="max-w-6xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-block mb-8">
                <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-lg border border-gray-200">
                  <Globe className="w-5 h-5 text-mm-primary" />
                  <span className="nepali-heading text-sm font-semibold text-mm-primary">
                    सदस्यता फारम
                  </span>
                </div>
              </div>
              
              <h1 className="nepali-heading text-5xl md:text-6xl lg:text-7xl font-bold text-mm-ink mb-6 leading-tight">
                मधेश महासभामा<br />
                <span className="text-mm-primary">सामेल हुनुहोस्</span>
              </h1>
              
              <p className="nepali-text text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                मधेशी जनताको अधिकार, समानता र सम्मानका लागि हामीसँग मिलेर काम गर्नुहोस्
              </p>
              
              {/* Value Props */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all group">
                  <div className="w-16 h-16 bg-mm-primary rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="nepali-heading text-2xl font-bold text-mm-ink mb-2">
                    एकता
                  </h3>
                  <p className="nepali-text text-gray-600">
                    मधेशी समुदायको एकजुट आवाज
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all group">
                  <div className="w-16 h-16 bg-mm-accent rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="nepali-heading text-2xl font-bold text-mm-accent mb-2">
                    अधिकार
                  </h3>
                  <p className="nepali-text text-gray-600">
                    न्यायसंगत हिस्सेदारी र अधिकार
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all group">
                  <div className="w-16 h-16 bg-mm-warm rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="nepali-heading text-2xl font-bold text-mm-warm mb-2">
                    सेवा
                  </h3>
                  <p className="nepali-text text-gray-600">
                    समुदायको सेवामा समर्पित
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="nepali-heading text-4xl lg:text-5xl font-bold text-mm-ink mb-4">
                सदस्यताका फाइदाहरू
              </h2>
              <p className="nepali-text text-xl text-gray-600 max-w-2xl mx-auto">
                मधेश महासभाको सदस्य बनेर तपाईंले पाउने अवसरहरू
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {[
                {
                  icon: Users,
                  title: 'राजनीतिक सहभागिता',
                  desc: 'नीति निर्माणमा प्रत्यक्ष योगदान र राजनीतिक गतिविधिमा सहभागिता',
                  color: 'bg-blue-500'
                },
                {
                  icon: Target,
                  title: 'नेतृत्व विकास',
                  desc: 'नेतृत्व क्षमता विकास र समुदायिक नेतृत्वमा अवसर',
                  color: 'bg-green-500'
                },
                {
                  icon: Shield,
                  title: 'अधिकार संरक्षण',
                  desc: 'मधेशी समुदायका अधिकारको संरक्षण र उत्थानमा योगदान',
                  color: 'bg-purple-500'
                },
                {
                  icon: Globe,
                  title: 'सञ्जाल निर्माण',
                  desc: 'राष्ट्रिय र अन्तर्राष्ट्रिय स्तरमा व्यापक सञ्जाल निर्माण',
                  color: 'bg-orange-500'
                }
              ].map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div 
                    key={idx}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className={`w-14 h-14 ${benefit.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="nepali-heading text-xl font-bold text-mm-ink mb-3">
                      {benefit.title}
                    </h3>
                    <p className="nepali-text text-base text-gray-600 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 lg:py-24">
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="nepali-heading text-4xl lg:text-5xl font-bold text-mm-ink mb-4">
                सदस्यता आवेदन फारम
              </h2>
              <p className="nepali-text text-xl text-gray-600">
                तलको फारम भरेर मधेश महासभाको सदस्यता लिनुहोस्
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 lg:p-12">
              {submitError && (
                <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-base text-red-700 nepali-text font-medium">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-mm-primary/10 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-mm-primary" />
                    </div>
                    <h3 className="nepali-heading text-2xl font-bold text-mm-ink">
                      व्यक्तिगत जानकारी
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="relative">
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        पूरा नाम *
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mm-primary/50 transition-all text-lg ${
                            errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-mm-primary'
                          }`}
                          placeholder="तपाईंको पूरा नाम"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-2 nepali-text flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        इमेल ठेगाना *
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mm-primary/50 transition-all text-lg ${
                            errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-mm-primary'
                          }`}
                          placeholder="example@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-2 nepali-text flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        फोन नम्बर *
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <Phone className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mm-primary/50 transition-all text-lg ${
                            errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-mm-primary'
                          }`}
                          placeholder="९८XXXXXXXX"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-2 nepali-text flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="relative">
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        ठेगाना *
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <MapPin className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mm-primary/50 transition-all text-lg ${
                            errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-mm-primary'
                          }`}
                          placeholder="वडा, नगरपालिका, जिल्ला, प्रदेश"
                        />
                      </div>
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-2 nepali-text flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.address}
                        </p>
                      )}
                    </div>

                    {/* Occupation */}
                    <div className="relative">
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        पेशा
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <Briefcase className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mm-primary/50 hover:border-gray-400 focus:border-mm-primary transition-all text-lg"
                          placeholder="तपाईंको पेशा"
                        />
                      </div>
                    </div>

                    {/* Education */}
                    <div className="relative">
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        शिक्षा
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <GraduationCap className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="education"
                          value={formData.education}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mm-primary/50 hover:border-gray-400 focus:border-mm-primary transition-all text-lg"
                          placeholder="तपाईंको शैक्षिक योग्यता"
                        />
                      </div>
                    </div>

                    {/* Birth Date */}
                    <div className="relative">
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        जन्म मिति
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mm-primary/50 hover:border-gray-400 focus:border-mm-primary transition-all text-lg"
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="relative">
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        लिङ्ग
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <UserCheck className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-10 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mm-primary/50 hover:border-gray-400 focus:border-mm-primary transition-all appearance-none bg-white text-lg cursor-pointer"
                        >
                          <option value="">छान्नुहोस्</option>
                          <option value="male">पुरुष</option>
                          <option value="female">महिला</option>
                          <option value="other">अन्य</option>
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Motivation Section */}
                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-mm-accent/10 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-mm-accent" />
                    </div>
                    <h3 className="nepali-heading text-2xl font-bold text-mm-ink">
                      सामेल हुने कारण
                    </h3>
                  </div>

                  <div>
                    <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                      तपाईं किन मधेश महासभामा सामेल हुन चाहनुहुन्छ? *
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mm-primary/50 transition-all text-lg resize-none ${
                        errors.additionalInfo ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-mm-primary'
                      }`}
                      placeholder="आफ्ना लक्ष्य र उद्देश्यहरू लेख्नुहोस्। तपाईंको योगदानले मधेशी समुदायलाई कसरी फाइदा पुग्नेछ? (कम्तिमा २० अक्षर)"
                    />
                    {errors.additionalInfo && (
                      <p className="text-red-500 text-sm mt-2 nepali-text flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.additionalInfo}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-500 nepali-text">
                        {formData.additionalInfo.length}/200 अक्षर
                      </p>
                      {formData.additionalInfo.length >= 20 && (
                        <p className="text-sm text-green-600 nepali-text flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          राम्रो!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="border-t border-gray-200 pt-8">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-mm-primary to-mm-primary/90 hover:from-mm-primary/90 hover:to-mm-primary text-white py-5 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span className="nepali-heading">पेश गरिँदै...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3 nepali-heading">
                        <span>सदस्यता फारम पेश गर्नुहोस्</span>
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    )}
                  </Button>

                  <p className="text-sm text-gray-500 mt-4 text-center nepali-text">
                    * आवश्यक क्षेत्रहरू। तपाईंको जानकारी सुरक्षित राखिनेछ र गोपनीय रहनेछ।
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
