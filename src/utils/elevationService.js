import { GOOGLE_API_KEY, MAP_ELEVATION_URL } from '@env'

export const getElevation = async (latitude, longitude) => {
    try {
        const response = await fetch(
            `${MAP_ELEVATION_URL}?locations=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
        );
        const data = await response.json();
        if (data.status === 'OK') {
            return data.results[0].elevation;
        } else {
            console.error('Elevation API Error:', data.status);
            return null;
        }
    } catch (error) {
        console.error('Error fetching elevation:', error);
        return null;
    }
};
