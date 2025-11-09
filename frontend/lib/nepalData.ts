// Nepal Location Data - Loaded from JSON files

// Import JSON data files
import madheshDistricts from '@/lib/data/locations/districtsByProvince/madhesh.json';
import pradesh1Districts from '@/lib/data/locations/districtsByProvince/pradesh-1.json';
import bagmatiDistricts from '@/lib/data/locations/districtsByProvince/bagmati.json';
import gandakiDistricts from '@/lib/data/locations/districtsByProvince/gandaki.json';
import lumbiniDistricts from '@/lib/data/locations/districtsByProvince/lumbini.json';
import karnaliDistricts from '@/lib/data/locations/districtsByProvince/karnali.json';
import sudurpaschimDistricts from '@/lib/data/locations/districtsByProvince/sudurpaschim.json';

// Helper function to format labels
const formatDistrictLabel = (value: string): string => {
  // Map of district names to Nepali labels
  const nepaliLabels: Record<string, string> = {
    // Madhesh
    'saptari': 'सप्तरी',
    'siraha': 'सिराहा',
    'dhanusha': 'धनुषा',
    'mahottari': 'महोत्तरी',
    'sarlahi': 'सर्लाही',
    'rautahat': 'रौतहट',
    'bara': 'बारा',
    'parsa': 'पर्सा',
    // Province 1 (Koshi)
    'morang': 'मोरङ',
    'sunsari': 'सुनसरी',
    'jhapa': 'झापा',
    'ilam': 'इलाम',
    'illam': 'इलाम',
    'panchthar': 'पाँचथर',
    'taplejung': 'ताप्लेजुङ',
    'sankhuwasabha': 'संखुवासभा',
    'terhathum': 'तेह्रथुम',
    'tehrathum': 'तेह्रथुम',
    'bhojpur': 'भोजपुर',
    'dhankuta': 'धनकुटा',
    'solukhumbu': 'सोलुखुम्बु',
    'okhaldhunga': 'ओखलढुङ्गा',
    'khotang': 'खोटाङ',
    'udayapur': 'उदयपुर',
    // Bagmati
    'kathmandu': 'काठमाडौं',
    'lalitpur': 'ललितपुर',
    'bhaktapur': 'भक्तपुर',
    'kavrepalanchok': 'काभ्रेपलाञ्चोक',
    'nuwakot': 'नुवाकोट',
    'rasuwa': 'रसुवा',
    'dhading': 'धादिङ',
    'chitwan': 'चितवन',
    'makwanpur': 'मकवानपुर',
    'sindhuli': 'सिन्धुली',
    'ramechhap': 'रामेछाप',
    'dolakha': 'दोलखा',
    'sindhupalchok': 'सिन्धुपाल्चोक',
    // Gandaki
    'gorkha': 'गोरखा',
    'lamjung': 'लमजुङ',
    'tanahu': 'तनहुँ',
    'kaski': 'कास्की',
    'manang': 'मनाङ',
    'mustang': 'मुस्ताङ',
    'myagdi': 'म्याग्दी',
    'parbat': 'पर्वत',
    'baglung': 'बागलुङ',
    'nawalpur': 'नवलपरासी (पूर्व)',
    'syangja': 'स्याङ्जा',
    // Lumbini
    'kapilvastu': 'कपिलवस्तु',
    'rupandehi': 'रुपन्देही',
    'parasi': 'नवलपरासी (पश्चिम)',
    'palpa': 'पाल्पा',
    'arghakhanchi': 'अर्घाखाँची',
    'gulmi': 'गुल्मी',
    'pyuthan': 'प्युठान',
    'rolpa': 'रोल्पा',
    'eastern-rukum': 'पूर्वी रुकुम',
    'banke': 'बाँके',
    'bardiya': 'बर्दिया',
    'dang': 'दाङ',
    // Karnali
    'western-rukum': 'पश्चिमी रुकुम',
    'salyan': 'सल्यान',
    'dolpa': 'डोल्पा',
    'jumla': 'जुम्ला',
    'kalikot': 'कालिकोट',
    'mugu': 'मुगु',
    'humla': 'हुम्ला',
    'dailekh': 'दैलेख',
    'jajarkot': 'जाजरकोट',
    'surkhet': 'सुर्खेत',
    // Sudurpaschim
    'bajura': 'बाजुरा',
    'bajhang': 'बझाङ',
    'achham': 'अछाम',
    'doti': 'डोटी',
    'kailali': 'कैलाली',
    'kanchanpur': 'कञ्चनपुर',
    'dadeldhura': 'डडेलधुरा',
    'baitadi': 'बैतडी',
    'darchula': 'दार्चुला',
  };

  return nepaliLabels[value] || value;
};

export const provinces = [
  { value: 'madhesh', label: 'मधेश प्रदेश' },
  { value: 'pradesh-1', label: 'कोशी प्रदेश' },
  { value: 'bagmati', label: 'बागमती प्रदेश' },
  { value: 'gandaki', label: 'गण्डकी प्रदेश' },
  { value: 'lumbini', label: 'लुम्बिनी प्रदेश' },
  { value: 'karnali', label: 'कर्णाली प्रदेश' },
  { value: 'sudurpaschim', label: 'सुदूरपश्चिम प्रदेश' },
];

// Convert imported JSON data to the format needed by the form
const createDistrictOptions = (districtArray: string[]) => {
  return districtArray.map(district => ({
    value: district,
    label: formatDistrictLabel(district)
  }));
};

export const districts: Record<string, { value: string; label: string }[]> = {
  'madhesh': createDistrictOptions(madheshDistricts.districts),
  'pradesh-1': createDistrictOptions(pradesh1Districts.districts),
  'bagmati': createDistrictOptions(bagmatiDistricts.districts),
  'gandaki': createDistrictOptions(gandakiDistricts.districts),
  'lumbini': createDistrictOptions(lumbiniDistricts.districts),
  'karnali': createDistrictOptions(karnaliDistricts.districts),
  'sudurpaschim': createDistrictOptions(sudurpaschimDistricts.districts),
};

export const positionOptions = [
  { value: 'parliament_member', label: 'प्रतिनिधिसभा सदस्य' },
  { value: 'provincial_assembly', label: 'प्रदेश सभा सदस्य' },
  { value: 'local_representative', label: 'स्थानीय तह प्रतिनिधि' },
  { value: 'coordinator', label: 'संयोजक' },
  { value: 'volunteer', label: 'स्वयंसेवक' },
  { value: 'advisor', label: 'सल्लाहकार' },
  { value: 'other', label: 'अन्य' },
];

export const keyIssues = [
  { value: 'education', label: 'शिक्षा' },
  { value: 'health', label: 'स्वास्थ्य' },
  { value: 'employment', label: 'रोजगारी' },
  { value: 'federalism', label: 'संघीयता' },
  { value: 'madheshi_rights', label: 'मधेशी अधिकार' },
  { value: 'agriculture', label: 'कृषि' },
  { value: 'infrastructure', label: 'पूर्वाधार विकास' },
  { value: 'social_justice', label: 'सामाजिक न्याय' },
  { value: 'youth_development', label: 'युवा विकास' },
  { value: 'women_empowerment', label: 'महिला सशक्तिकरण' },
];

export const genderOptions = [
  { value: 'male', label: 'पुरुष' },
  { value: 'female', label: 'महिला' },
  { value: 'other', label: 'अन्य' },
];
