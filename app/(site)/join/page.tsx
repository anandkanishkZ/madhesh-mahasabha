'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Footer } from '@/components/Footer';
import { JoinStrip } from '@/components/JoinStrip';
import { submitJoinForm } from '@/lib/firebaseService';
import { CheckCircle, Users, Shield, Heart, ArrowRight, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Calendar, UserCheck, ChevronUp } from 'lucide-react';

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
        <main id="main-content">
          <Section className="py-24">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="nepali-heading text-3xl lg:text-4xl font-bold text-mm-ink mb-6">
                स्वागत छ मधेश महासभामा!
              </h1>
              
              <p className="nepali-text text-lg text-gray-700 mb-6">
                तपाईंको सदस्यता आवेदन सफलतापूर्वक पेश भएको छ। हामी छिट्टै तपाईंलाई सम्पर्क गर्नेछौं।
              </p>
              
              <p className="nepali-text text-sm text-gray-600 mb-8">
                तपाईंको योगदानले मधेशी समुदायको सशक्तिकरणमा महत्वपूर्ण भूमिका खेल्नेछ।
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setIsSubmitted(false)} className="bg-mm-primary hover:bg-mm-primary/90">
                  अर्को आवेदन पेश गर्नुहोस्
                </Button>
                <Button variant="outline" asChild>
                  <a href="/">गृहपृष्ठमा फर्किनुहोस्</a>
                </Button>
              </div>
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
        <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center mithila-pattern">
          <div className="absolute inset-0 bg-mm-bg"></div>
          
          <div className="container-custom relative z-10">
            <div className="max-w-4xl">
              <h1 className="nepali-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-mm-ink mb-6 leading-tight">
                मधेश महासभामा सामेल हुनुहोस्
              </h1>
              
              <p className="nepali-text text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl leading-relaxed">
                मधेशी जनताको अधिकार, समानता र सम्मानका लागि हामीसँग मिलेर काम गर्नुहोस्
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mt-12">
                <div className="text-center sm:text-left">
                  <div className="w-12 h-12 bg-mm-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                    <Users className="w-6 h-6 text-mm-primary" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-mm-primary nepali-heading mb-2">
                    एकता
                  </div>
                  <p className="nepali-text text-gray-600">
                    मधेशी समुदायको एकजुट आवाज
                  </p>
                </div>
                
                <div className="text-center sm:text-left">
                  <div className="w-12 h-12 bg-mm-accent/10 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                    <Shield className="w-6 h-6 text-mm-accent" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-mm-accent nepali-heading mb-2">
                    अधिकार
                  </div>
                  <p className="nepali-text text-gray-600">
                    न्यायसंगत हिस्सेदारी र अधिकार
                  </p>
                </div>
                
                <div className="text-center sm:text-left">
                  <div className="w-12 h-12 bg-mm-warm/10 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                    <Heart className="w-6 h-6 text-mm-warm" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-mm-warm nepali-heading mb-2">
                    सेवा
                  </div>
                  <p className="nepali-text text-gray-600">
                    समुदायको सेवामा समर्पित
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <Section>
          <SectionHeader centered>
            <SectionTitle>सदस्यताका फाइदाहरू</SectionTitle>
            <SectionDescription className="mx-auto">
              मधेश महासभाको सदस्य बनेर तपाईंले पाउने अवसरहरू
            </SectionDescription>
          </SectionHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-mm-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-mm-primary" />
                </div>
                <h3 className="nepali-heading font-semibold text-lg mb-2">
                  राजनीतिक सहभागिता
                </h3>
                <p className="nepali-text text-sm text-gray-600">
                  नीति निर्माणमा प्रत्यक्ष योगदान र राजनीतिक गतिविधिमा सहभागिता
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-mm-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-6 h-6 text-mm-accent" />
                </div>
                <h3 className="nepali-heading font-semibold text-lg mb-2">
                  नेतृत्व विकास
                </h3>
                <p className="nepali-text text-sm text-gray-600">
                  नेतृत्व क्षमता विकास र समुदायिक नेतृत्वमा अवसर
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-mm-warm/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-mm-warm" />
                </div>
                <h3 className="nepali-heading font-semibold text-lg mb-2">
                  अधिकार संरक्षण
                </h3>
                <p className="nepali-text text-sm text-gray-600">
                  मधेशी समुदायका अधिकारको संरक्षण र उत्थानमा योगदान
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="nepali-heading font-semibold text-lg mb-2">
                  सञ्जाल निर्माण
                </h3>
                <p className="nepali-text text-sm text-gray-600">
                  राष्ट्रिय र अन्तर्राष्ट्रिय स्तरमा व्यापक सञ्जाल निर्माण
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Form Section */}
        <Section className="bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <SectionHeader centered>
              <SectionTitle>सदस्यता आवेदन फारम</SectionTitle>
              <SectionDescription className="mx-auto">
                तलको फारम भरेर मधेश महासभाको सदस्यता लिनुहोस्
              </SectionDescription>
            </SectionHeader>

            <Card className="shadow-lg">
              <CardContent className="p-8">
                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">{submitError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        पूरा नाम *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent transition-colors ${
                          errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="तपाईंको पूरा नाम लेख्नुहोस्"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1 nepali-text">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        इमेल ठेगाना *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent transition-colors ${
                          errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="example@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 nepali-text">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        फोन नम्बर *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent transition-colors ${
                          errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="९८XXXXXXXX"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 nepali-text">{errors.phone}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        ठेगाना *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent transition-colors ${
                          errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="वडा, नगरपालिका, जिल्ला, प्रदेश"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1 nepali-text">{errors.address}</p>
                      )}
                    </div>

                    {/* Occupation */}
                    <div>
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        <Briefcase className="w-4 h-4 inline mr-2" />
                        पेशा
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent hover:border-gray-400 transition-colors"
                        placeholder="तपाईंको पेशा"
                      />
                    </div>

                    {/* Education */}
                    <div>
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        <GraduationCap className="w-4 h-4 inline mr-2" />
                        शिक्षा
                      </label>
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent hover:border-gray-400 transition-colors"
                        placeholder="तपाईंको शैक्षिक योग्यता"
                      />
                    </div>

                    {/* Birth Date */}
                    <div>
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        जन्म मिति
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent hover:border-gray-400 transition-colors"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                        <UserCheck className="w-4 h-4 inline mr-2" />
                        लिङ्ग
                      </label>
                      <div className="relative">
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent hover:border-gray-400 transition-colors appearance-none bg-white"
                        >
                          <option value="">छान्नुहोस्</option>
                          <option value="male">पुरुष</option>
                          <option value="female">महिला</option>
                          <option value="other">अन्य</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <div className="bg-mm-primary rounded-full p-1">
                            <ChevronUp className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div>
                    <label className="block nepali-text text-sm font-semibold text-gray-700 mb-2">
                      सामेल हुने कारण *
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mm-primary focus:border-transparent transition-colors ${
                        errors.additionalInfo ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="तपाईं किन मधेश महासभामा सामेल हुन चाहनुहुन्छ? आफ्ना लक्ष्य र उद्देश्यहरू लेख्नुहोस्। (कम्तिमा २० अक्षर)"
                    />
                    {errors.additionalInfo && (
                      <p className="text-red-500 text-sm mt-1 nepali-text">{errors.additionalInfo}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1 nepali-text">
                      {formData.additionalInfo.length}/200 अक्षर
                    </p>
                  </div>

                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full bg-mm-primary hover:bg-mm-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          पेश गरिँदै...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          सदस्यता फारम पेश गर्नुहोस्
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </div>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 mt-4 text-center nepali-text">
                      * आवश्यक क्षेत्रहरू। तपाईंको जानकारी सुरक्षित राखिनेछ।
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </Section>

        <JoinStrip />
      </main>
      
      <Footer />
    </>
  );
}
