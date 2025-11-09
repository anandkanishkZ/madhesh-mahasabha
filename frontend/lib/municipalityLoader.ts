// Municipality loader utility
// This file dynamically loads municipalities based on selected district

// Helper function to format municipality label (capitalize first letter of each word)
const formatMunicipalityLabel = (value: string): string => {
  return value
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const loadMunicipalities = async (district: string): Promise<Array<{ value: string; label: string }>> => {
  try {
    // Map common district name variations to file names
    const districtFileMap: Record<string, string> = {
      'nawalparasi_east': 'nawalpur',
      'nawalparasi_west': 'parasi',
      'eastern_rukum': 'eastern-rukum',
      'western_rukum': 'western-rukum',
      'illam': 'illam',
    };

    const fileName = districtFileMap[district] || district;
    
    // Dynamically import the municipality JSON file
    const municipalData = await import(`@/lib/data/locations/municipalsByDistrict/${fileName}.json`);
    
    // Format the data for the dropdown
    return municipalData.municipals.map((municipal: string) => ({
      value: municipal.toLowerCase().replace(/\s+/g, '-'),
      label: formatMunicipalityLabel(municipal)
    }));
  } catch (error) {
    console.error(`Failed to load municipalities for district: ${district}`, error);
    return [];
  }
};
