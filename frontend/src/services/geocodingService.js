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

/**
 * Search for addresses matching the query.
 * @param {string} query - The address to search for.
 * @returns {Promise<Array<{lat: string, lng: string, displayName: string}>>}
 */
export const searchAddress = async (query) => {
    if (!query || query.length < 3) return [];

    try {
        const response = await axios.get(NOMINATIM_BASE_URL, {
            params: {
                q: query,
                format: 'json',
                limit: 5,
                addressdetails: 1
            }
        });

        if (response.data && response.data.length > 0) {
            return response.data.map(result => ({
                lat: result.lat,
                lng: result.lon,
                displayName: result.display_name
            }));
        }
        return [];
    } catch (error) {
        console.error('Geocoding search error:', error);
        return [];
    }
};
