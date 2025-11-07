import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Test Firebase connection
export async function testFirebaseConnection() {
  try {
    // Try to get a reference to a collection
    const testCollection = collection(db, 'connection-test');
    console.log('✅ Firebase connection successful');
    return { success: true, message: 'Firebase connected successfully' };
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Connection failed' };
  }
}

// Interface for join form data
export interface JoinFormData {
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
  additionalInfo?: string;
}

// Interface for contact form data
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  organization?: string;
}

// Submit join form to Firebase
export async function submitJoinForm(formData: JoinFormData) {
  try {
    // Log the data being submitted for debugging
    console.log('Attempting to submit join form data:', {
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      type: 'membership-application'
    });

    const docRef = await addDoc(collection(db, 'membership-applications'), {
      ...formData,
      submittedAt: serverTimestamp(),
      status: 'pending',
      type: 'membership-application'
    });

    console.log('✅ Membership application submitted successfully with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Error submitting membership application: ', error);
    
    // Provide more specific error messages
    let errorMessage = 'फारम पेश गर्नमा समस्या भयो।';
    
    if (error instanceof Error) {
      if (error.message.includes('network')) {
        errorMessage = 'नेटवर्क जडान जाँच गर्नुहोस्।';
      } else if (error.message.includes('permission')) {
        errorMessage = 'अनुमति सम्बन्धी समस्या छ।';
      } else if (error.message.includes('quota')) {
        errorMessage = 'सेवा अस्थायी रूपमा अनुपलब्ध छ।';
      }
    }
    
    return { success: false, error: errorMessage };
  }
}

// Submit contact form to Firebase
export async function submitContactForm(formData: ContactFormData) {
  try {
    // Log the data being submitted for debugging
    console.log('Attempting to submit contact form data:', {
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'unread',
      type: 'contact-message'
    });

    const docRef = await addDoc(collection(db, 'contact-messages'), {
      ...formData,
      submittedAt: serverTimestamp(),
      status: 'unread',
      type: 'contact-message',
      // Add additional metadata
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
      timestamp: new Date().toISOString(),
    });

    console.log('✅ Contact message submitted successfully with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Error submitting contact message: ', error);
    
    // Provide more specific error messages
    let errorMessage = 'संदेश पठाउनमा समस्या भयो।';
    
    if (error instanceof Error) {
      if (error.message.includes('network')) {
        errorMessage = 'नेटवर्क जडान जाँच गर्नुहोस्।';
      } else if (error.message.includes('permission')) {
        errorMessage = 'अनुमति सम्बन्धी समस्या छ।';
      } else if (error.message.includes('quota')) {
        errorMessage = 'सेवा अस्थायी रूपमा अनुपलब्ध छ।';
      }
    }
    
    return { success: false, error: errorMessage };
  }
}

// Generic function to submit any form data
export async function submitFormData(collectionName: string, data: any) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      submittedAt: serverTimestamp()
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error(`Error submitting to ${collectionName}: `, error);
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' };
  }
}