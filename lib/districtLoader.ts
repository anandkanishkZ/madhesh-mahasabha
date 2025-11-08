// District loader utility
// This file dynamically loads districts based on selected province

// Helper function to format district label with Nepali translations
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

export const loadDistricts = async (province: string): Promise<Array<{ value: string; label: string }>> => {
  try {
    // Dynamically import the district JSON file for the specific province
    const districtData = await import(`@/lib/data/locations/districtsByProvince/${province}.json`);
    
    // Format the data for the dropdown
    return districtData.districts.map((district: string) => ({
      value: district,
      label: formatDistrictLabel(district)
    }));
  } catch (error) {
    console.error(`Failed to load districts for province: ${province}`, error);
    return [];
  }
};
