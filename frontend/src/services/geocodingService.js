import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * Geocode an address to coordinates using OpenStreetMap Nominatim API.
 * @param {string} address - The address to geocode.
 * @returns {Promise<{lat: string, lng: string, displayName: string} | null>}
 */
export const geocodeAddress = async (address) => {
    if (!address) return null;

    try {
        const response = await axios.get(NOMINATIM_BASE_URL, {
            params: {
                q: address,
                format: 'json',
                limit: 1,
            },
            headers: {
                'User-Agent': 'TrackerOrderApp/1.0'
            }
        });
        console.error('Geocoding :', response.data);
        if (response.data && response.data.length > 0) {
            const result = response.data[0];
            return {
                lat: result.lat,
                lng: result.lon,
                displayName: result.display_name
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
};
