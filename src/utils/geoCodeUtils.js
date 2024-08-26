// geocodeUtils.js

import { MAP_API_KEY } from '@env';

export const reverseGeocode = async (latitude, longitude) => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MAP_API_KEY}`
        );
        const data = await response.json();
        if (data.results.length > 0) {
            return data.results[0].formatted_address;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return null;
    }
};
