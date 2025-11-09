'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/Footer';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Target,
  FileText,
  CheckCircle,
  Upload,
  Calendar,
  ChevronDown,
  Building2,
  Flag,
  Award,
  Lightbulb,
  AlertCircle,
  Users,
  Sparkles
} from 'lucide-react';
import { 
  provinces, 
  positionOptions, 
  keyIssues,
  genderOptions 
} from '@/lib/nepalData';
import { loadMunicipalities } from '@/lib/municipalityLoader';
import { loadDistricts } from '@/lib/districtLoader';
import { getConstituenciesByDistrict } from '@/lib/data/constituencyData';

interface MissionFormData {
  // Personal Information
  fullName: string;
  dateOfBirth: string;
  age: string;
  gender: string;
  contactNumber: string;
  email: string;
  
  // Address Information
  province: string;
  district: string;
  constituency: string;
  municipality: string;
  wardNo: string;
  
  // Educational & Professional
  education: string;
  occupation: string;
  organization: string;
  
  // Political Interest
  positionInterested: string;
  politicalExperience: string;
  campaignObjective: string;
  keyIssues: string[];
  
  // Documents
  photoFile: File | null;
  citizenshipFile: File | null;
  resumeFile: File | null;
  
  // Declarations
  confirmTruth: boolean;
  agreeContact: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function MissionRepresentativePage() {
  const [formData, setFormData] = useState<MissionFormData>({
    fullName: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    contactNumber: '',
    email: '',
    province: '',
    district: '',
    constituency: '',
    municipality: '',
    wardNo: '',
    education: '',
    occupation: '',
    organization: '',
    positionInterested: '',
    politicalExperience: '',
    campaignObjective: '',
    keyIssues: [],
    photoFile: null,
    citizenshipFile: null,
    resumeFile: null,
    confirmTruth: false,
    agreeContact: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState<{ value: string; label: string }[]>([]);
  const [availableConstituencies, setAvailableConstituencies] = useState<string[]>([]);
  const [availableMunicipalities, setAvailableMunicipalities] = useState<{ value: string; label: string }[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);

  // Update districts when province changes
  useEffect(() => {
    if (formData.province) {
      setFormData(prev => ({ ...prev, district: '', constituency: '', municipality: '' }));
      setAvailableMunicipalities([]);
      
      // Load districts for the selected province
      setLoadingDistricts(true);
      loadDistricts(formData.province)
        .then(districtList => {
          setAvailableDistricts(districtList);
          setLoadingDistricts(false);
        })
        .catch(error => {
          console.error('Error loading districts:', error);
          setAvailableDistricts([]);
          setLoadingDistricts(false);
        });
    } else {
      setAvailableDistricts([]);
    }
  }, [formData.province]);

  // Update constituencies and load municipalities when district changes
  useEffect(() => {
    if (formData.district) {
      // Get constituencies for the selected district
      const constituencies = getConstituenciesByDistrict(formData.district);
      setAvailableConstituencies(constituencies);
      setFormData(prev => ({ ...prev, constituency: '', municipality: '' }));
      
      // Load municipalities for the selected district
      setLoadingMunicipalities(true);
      loadMunicipalities(formData.district)
        .then(municipals => {
          setAvailableMunicipalities(municipals);
          setLoadingMunicipalities(false);
        })
        .catch(error => {
          console.error('Error loading municipalities:', error);
          setAvailableMunicipalities([]);
          setLoadingMunicipalities(false);
        });
    } else {
      setAvailableConstituencies([]);
      setAvailableMunicipalities([]);
    }
  }, [formData.district]);

  // Calculate age from date of birth
  useEffect(() => {
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.dateOfBirth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleKeyIssuesChange = (issue: string) => {
    setFormData(prev => {
      const currentIssues = prev.keyIssues;
      if (currentIssues.includes(issue)) {
        return { ...prev, keyIssues: currentIssues.filter(i => i !== issue) };
      } else {
        return { ...prev, keyIssues: [...currentIssues, issue] };
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof MissionFormData) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [fieldName]: file }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.fullName.trim()) newErrors.fullName = 'पूरा नाम आवश्यक छ';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'जन्म मिति आवश्यक छ';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'सम्पर्क नम्बर आवश्यक छ';
    if (!formData.email.trim()) newErrors.email = 'इमेल ठेगाना आवश्यक छ';
    if (!formData.province) newErrors.province = 'प्रदेश चयन गर्नुहोस्';
    if (!formData.district) newErrors.district = 'जिल्ला चयन गर्नुहोस्';
    if (!formData.constituency) newErrors.constituency = 'निर्वाचन क्षेत्र आवश्यक छ';
    if (!formData.municipality) newErrors.municipality = 'नगरपालिका/गाउँपालिका चयन गर्नुहोस्';
    if (!formData.wardNo.trim()) newErrors.wardNo = 'वडा नम्बर आवश्यक छ';
    if (!formData.education.trim()) newErrors.education = 'शैक्षिक योग्यता आवश्यक छ';
    if (!formData.positionInterested) newErrors.positionInterested = 'पद चयन गर्नुहोस्';
    if (!formData.campaignObjective.trim() || formData.campaignObjective.length < 50) {
      newErrors.campaignObjective = 'कम्तिमा ५० अक्षरको विवरण आवश्यक छ';
    }
    if (formData.keyIssues.length === 0) {
      newErrors.keyIssues = 'कम्तिमा एक मुद्दा चयन गर्नुहोस्';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्';
    }

    // Phone validation (Nepal format)
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.contactNumber && !phoneRegex.test(formData.contactNumber.replace(/[\s-]/g, ''))) {
      newErrors.contactNumber = 'मान्य १० अंकको फोन नम्बर प्रविष्ट गर्नुहोस्';
    }

    // Declarations validation
    if (!formData.confirmTruth) {
      newErrors.confirmTruth = 'कृपया पुष्टि गर्नुहोस्';
    }
    if (!formData.agreeContact) {
      newErrors.agreeContact = 'कृपया सहमति दिनुहोस्';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.error-message');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Import the API functions
      const { submitMissionRepresentative, uploadMissionRepresentativeFiles } = await import('@/lib/api');
      
      // First, upload files if any
      let fileUrls: any = {};
      if (formData.photoFile || formData.citizenshipFile || formData.resumeFile) {
        const uploadResponse = await uploadMissionRepresentativeFiles({
          photo: formData.photoFile || undefined,
          citizenship: formData.citizenshipFile || undefined,
          educationCert: formData.resumeFile || undefined,
        });

        if (uploadResponse.success && uploadResponse.data) {
          fileUrls = uploadResponse.data;
        } else {
          alert('फाईल अपलोड गर्नमा समस्या भयो। कृपया पुन: प्रयास गर्नुहोस्।');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Prepare data for API (match backend schema)
      const apiData = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        contactNumber: formData.contactNumber,
        email: formData.email,
        province: formData.province,
        district: formData.district,
        constituency: formData.constituency,
        municipality: formData.municipality,
        wardNumber: formData.wardNo,
        currentAddress: `${formData.municipality}, Ward ${formData.wardNo}, ${formData.district}, ${formData.province}`,
        educationLevel: formData.education,
        institutionName: formData.organization || undefined,
        fieldOfStudy: formData.occupation || undefined,
        positionInterested: formData.positionInterested,
        politicalExperience: formData.politicalExperience || undefined,
        keyIssues: formData.keyIssues,
        whyJoin: formData.campaignObjective || undefined,
        photoUrl: fileUrls.photoUrl || undefined,
        citizenshipUrl: fileUrls.citizenshipUrl || undefined,
        educationCertUrl: fileUrls.educationCertUrl || undefined,
        agreeTerms: formData.confirmTruth,
        agreePrivacy: formData.agreeContact,
      };

      // Submit to backend
      const response = await submitMissionRepresentative(apiData);

      if (response.success) {
        setSubmitSuccess(true);
        
        // Scroll to top
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else {
        alert(response.error || 'फारम पेश गर्नमा समस्या भयो। कृपया पुन: प्रयास गर्नुहोस्।');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('फारम पेश गर्नमा समस्या भयो। कृपया पुन: प्रयास गर्नुहोस्।');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  धन्यवाद! 🎉
                </h1>
                <p className="text-xl text-gray-700 mb-2">
                  तपाईंको आवेदन सफलतापूर्वक प्राप्त भयो
                </p>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                <p className="text-gray-700 mb-4">
                  हामी छिट्टै तपाईंलाई सम्पर्क गर्नेछौं र मिसन प्रतिनिधिसभाको गतिविधिहरूमा सहभागी गराउनेछौं।
                </p>
                <div className="space-y-2 text-left">
                  <p className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>तपाईंको आवेदन हाम्रो टोलीले समीक्षा गर्नेछ</span>
                  </p>
                  <p className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>तपाईंलाई इमेल वा फोनबाट सम्पर्क गरिनेछ</span>
                  </p>
                  <p className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>तपाईंको योगदानले मधेशी समुदायको सशक्तिकरणमा महत्वपूर्ण भूमिका खेल्नेछ</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => {
                    setSubmitSuccess(false);
                    setFormData({
                      fullName: '',
                      dateOfBirth: '',
                      age: '',
                      gender: '',
                      contactNumber: '',
                      email: '',
                      province: '',
                      district: '',
                      constituency: '',
                      municipality: '',
                      wardNo: '',
                      education: '',
                      occupation: '',
                      organization: '',
                      positionInterested: '',
                      politicalExperience: '',
                      campaignObjective: '',
                      keyIssues: [],
                      photoFile: null,
                      citizenshipFile: null,
                      resumeFile: null,
                      confirmTruth: false,
                      agreeContact: false,
                    });
                  }}
                  className="bg-primary hover:bg-primary-dark text-white"
                >
                  अर्को आवेदन पेश गर्नुहोस्
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                >
                  मुख्य पृष्ठमा जानुहोस्
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12">
          <div className="inline-block mb-4">
            <div className="bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
              मधेश महासभा
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            मिसन प्रतिनिधिसभा
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-3">
            निर्वाचनमा उम्मेदवार बन्ने अवसर
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            आगामी प्रतिनिधिसभा निर्वाचनमा उम्मेदवार बन्न चाहने व्यक्तिहरूको लागि विशेष अभियान
          </p>
        </div>

        {/* Mission Overview Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-orange-600 text-white p-3 rounded-full">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">मिसन प्रतिनिधिसभा के हो?</h2>
              <p className="text-gray-700 leading-relaxed">
                यो <span className="font-bold text-orange-700">"मधेश महासभा"</span> ले चलाएको एउटा अभियान हो। यसको मुख्य उद्देश्य आगामी प्रतिनिधिसभा निर्वाचन (संसदको चुनाव) मा उम्मेदवार बन्न चाहने व्यक्तिहरूलाई सहयोग गर्नु हो।
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              को-को सहभागी हुन सक्छन्?
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">राजनीतिक व्यक्तिहरू</h4>
                  <p className="text-sm text-gray-600">कुनै पार्टीमा आबद्ध व्यक्तिहरू</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">गैरराजनीतिक व्यक्तिहरू</h4>
                  <p className="text-sm text-gray-600">पार्टीमा नभएका, स्वतन्त्र व्यक्तिहरू</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 text-center italic">
              यी इच्छुक व्यक्तिहरूले फारम भरेर यो मिसनको सहभागी बन्न सक्छन्।
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Award className="w-6 h-6 text-orange-600" />
              सहभागीहरूलाई के-कस्ता सहयोग मिल्छ?
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-lg p-5 border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                    १
                  </div>
                  <h4 className="font-bold text-gray-900">चुनावी तालिम</h4>
                </div>
                <p className="text-sm text-gray-700">
                  चुनावमा कसरी काम गर्ने भन्ने बारेमा प्रशिक्षण
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                    २
                  </div>
                  <h4 className="font-bold text-gray-900">प्राविधिक सहयोग</h4>
                </div>
                <p className="text-sm text-gray-700">
                  मिडिया, सोशल मिडिया, फारम भर्ने, अनलाइन काम आदि सहयोग
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                    ३
                  </div>
                  <h4 className="font-bold text-gray-900">राजनीतिक तालिम</h4>
                </div>
                <p className="text-sm text-gray-700">
                  राजनीति र नेतृत्व क्षमताको विकाससम्बन्धी प्रशिक्षण
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                    ४
                  </div>
                  <h4 className="font-bold text-gray-900">खर्च व्यवस्थापन</h4>
                </div>
                <p className="text-sm text-gray-700">
                  चुनावमा लाग्ने खर्चका लागि स्रोतसाधन जुटाउन सहयोग
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="bg-orange-600 rounded-xl shadow-lg p-6 md:p-8 mb-8 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            आफ्नो समुदायको प्रतिनिधित्व गर्ने अवसर!
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            मधेश महासभाले आगामी प्रतिनिधिसभा निर्वाचनका लागि उम्मेदवार बन्न चाहने राजनीतिक वा गैरराजनीतिक व्यक्तिहरूलाई तालिम, प्राविधिक सहयोग, राजनीतिक प्रशिक्षण र चुनावी खर्च जुटाउन सहयोग गर्नेछ।
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-2 rounded-full font-semibold">
            <Sparkles className="w-5 h-5" />
            <span>तलको फारम भरेर सहभागी बन्नुहोस्</span>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Information Section */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-orange-200">
                <User className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">व्यक्तिगत जानकारी</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    पूरा नाम <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="तपाईंको पूरा नाम"
                  />
                  {errors.fullName && (
                    <p className="error-message mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    जन्म मिति <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                        errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="error-message mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    उमेर
                  </label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                    placeholder="स्वतः गणना"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    लिङ्ग
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none"
                    >
                      <option value="">चयन गर्नुहोस्</option>
                      {genderOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    सम्पर्क नम्बर <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                        errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="९८XXXXXXXX"
                    />
                  </div>
                  {errors.contactNumber && (
                    <p className="error-message mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.contactNumber}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    इमेल ठेगाना <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="example@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="error-message mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-green-200">
                <MapPin className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">स्थायी ठेगाना</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    प्रदेश <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none ${
                        errors.province ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">प्रदेश चयन गर्नुहोस्</option>
                      {provinces.map(prov => (
                        <option key={prov.value} value={prov.value}>
                          {prov.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.province && (
                    <p className="error-message mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.province}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    जिल्ला <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      disabled={!formData.province || loadingDistricts}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        errors.district ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">
                        {loadingDistricts 
                          ? 'लोड हुँदैछ...' 
                          : 'जिल्ला चयन गर्नुहोस्'}
                      </option>
                      {availableDistricts.map(dist => (
                        <option key={dist.value} value={dist.value}>
                          {dist.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.district && (
                    <p className="error-message mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.district}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    निर्वाचन क्षेत्र <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="constituency"
                      value={formData.constituency}
                      onChange={handleInputChange}
                      disabled={!formData.district || availableConstituencies.length === 0}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        errors.constituency ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">निर्वाचन क्षेत्र चयन गर्नुहोस्</option>
                      {availableConstituencies.map(constituency => (
                        <option key={constituency} value={constituency}>
                          {constituency}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.constituency && (
                    <p className="error-message mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.constituency}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    नगरपालिका/गाउँपालिका <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="municipality"
                      value={formData.municipality}
                      onChange={handleInputChange}
                      disabled={!formData.district || loadingMunicipalities}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        errors.municipality ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">
                        {loadingMunicipalities 
                          ? 'लोड हुँदैछ...' 
                          : 'नगरपालिका/गाउँपालिका चयन गर्नुहोस्'}
                      </option>
                      {availableMunicipalities.map(municipal => (
                        <option key={municipal.value} value={municipal.value}>
                          {municipal.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.municipality && (
                    <p className="error-message mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.municipality}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    वडा नम्बर <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="wardNo"
                    value={formData.wardNo}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                      errors.wardNo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="वडा नम्बर"
                  />
                  {errors.wardNo && (
                    <p className="error-message mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.wardNo}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Educational & Professional Section */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-blue-200">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">शैक्षिक तथा पेशागत विवरण</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    शैक्षिक योग्यता <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      errors.education ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="उदाहरण: स्नातक, स्नातकोत्तर, आदि"
                  />
                  {errors.education && (
                    <p className="error-message mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.education}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    पेशा / व्यवसाय
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="तपाईंको पेशा"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    संस्था / संगठन
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="यदि कुनै छ भने"
                  />
                </div>
              </div>
            </div>

            {/* Political Interest Section */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-purple-200">
                <Target className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">राजनीतिक / निर्वाचन रुचि</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    रुचि भएको पद <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="positionInterested"
                      value={formData.positionInterested}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none ${
                        errors.positionInterested ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">पद चयन गर्नुहोस्</option>
                      {positionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.positionInterested && (
                    <p className="error-message mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.positionInterested}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    राजनीतिक अनुभव (यदि छ भने)
                  </label>
                  <textarea
                    name="politicalExperience"
                    value={formData.politicalExperience}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                    placeholder="तपाईंको राजनीतिक अनुभव संक्षेपमा लेख्नुहोस्"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    तपाईंको निर्वाचन अभियानको उद्देश्य <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="campaignObjective"
                    value={formData.campaignObjective}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none ${
                      errors.campaignObjective ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="उदाहरण: युवाहरूलाई राजनीतिमा सहभागी गराउन र विकास योजनाहरूमा पारदर्शिता सुनिश्चित गर्न... (कम्तिमा ५० अक्षर)"
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.campaignObjective && (
                      <p className="error-message text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.campaignObjective}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {formData.campaignObjective.length} अक्षर
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    तपाईंले सम्बोधन गर्न चाहने मुख्य मुद्दाहरू <span className="text-red-500">*</span>
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {keyIssues.map(issue => (
                      <label
                        key={issue.value}
                        className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={formData.keyIssues.includes(issue.value)}
                          onChange={() => handleKeyIssuesChange(issue.value)}
                          className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-gray-700">{issue.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.keyIssues && (
                    <p className="error-message mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.keyIssues}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-indigo-200">
                <Upload className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">कागजातहरू</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <p className="text-sm text-indigo-800 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>कागजातहरू वैकल्पिक छन्, तर यसले तपाईंको आवेदनलाई बलियो बनाउँछ।</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    फोटो अपलोड गर्नुहोस्
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'photoFile')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {formData.photoFile && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {formData.photoFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    नागरिकता / परिचय पत्र
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, 'citizenshipFile')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {formData.citizenshipFile && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {formData.citizenshipFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    जीवनवृत्त (Resume / Bio Data)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'resumeFile')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {formData.resumeFile && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {formData.resumeFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Declarations Section */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-red-200">
                <FileText className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">घोषणा</h2>
              </div>

              <div className="space-y-4">
                <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.confirmTruth 
                    ? 'bg-green-50 border-green-500' 
                    : errors.confirmTruth 
                    ? 'border-red-500' 
                    : 'border-gray-300 hover:border-green-300'
                }`}>
                  <input
                    type="checkbox"
                    name="confirmTruth"
                    checked={formData.confirmTruth}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5"
                  />
                  <span className="text-gray-700">
                    म पुष्टि गर्दछु कि मैले प्रदान गरेको सबै जानकारी सत्य र सही छ।
                  </span>
                </label>
                {errors.confirmTruth && (
                  <p className="error-message text-sm text-red-600 flex items-center gap-1 ml-8">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmTruth}
                  </p>
                )}

                <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.agreeContact 
                    ? 'bg-green-50 border-green-500' 
                    : errors.agreeContact 
                    ? 'border-red-500' 
                    : 'border-gray-300 hover:border-green-300'
                }`}>
                  <input
                    type="checkbox"
                    name="agreeContact"
                    checked={formData.agreeContact}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5"
                  />
                  <span className="text-gray-700">
                    म मिसन प्रतिनिधिसभा टोलीबाट यस अभियानको सम्बन्धमा सम्पर्क गर्न सहमत छु।
                  </span>
                </label>
                {errors.agreeContact && (
                  <p className="error-message text-sm text-red-600 flex items-center gap-1 ml-8">
                    <AlertCircle className="w-4 h-4" />
                    {errors.agreeContact}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    पेश गर्दै...
                  </>
                ) : (
                  <>
                    आवेदन पेश गर्नुहोस्
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            कुनै प्रश्न वा सहयोगको लागि:{' '}
            <a href="/contact" className="text-orange-600 hover:text-orange-700 font-semibold underline">
              सम्पर्क गर्नुहोस्
            </a>
          </p>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
