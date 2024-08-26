import axios from 'axios';
import { API_BASE_URL } from '@env'
import NetInfo from "@react-native-community/netinfo";

const apiService = axios.create({
    baseURL: `${API_BASE_URL}`,
    headers: {
        'content-type': 'application/json'
    },
});


const makeRequest = (method, endpoint, data = null, params = null, accessToken) => {
    return new Promise((resolve, reject) => {
        const unsubscribe = NetInfo.addEventListener(async (state) => {
            console.log(endpoint)
            if (state.isConnected) {
                try {
                    const requestData = data ? { data } : {}; // Include data only if it's not null

                    const response = await apiService({
                        method,
                        url: `${API_BASE_URL}${endpoint}`,
                        ...requestData,
                        params,
                        headers: {
                            ...apiService.defaults.headers,
                            'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
                            'Authorization': accessToken
                        },
                    });
                    resolve(response?.data);
                } catch (error) {
                    if (error.response) {
                        console.log('response error', error.response.data)
                        reject(error.response.data);
                    } else if (error.request) {
                        console.log('request error', error.request.data)
                        reject(error.response.data);
                    } else {
                        console.log('error message', error.message)
                        reject(error.message);
                    }
                }
            } else {
                //Toast.show('Network not available.');
                console.log('Network not available.')
                reject('Network not available.');
            }
        });
    });
};

export default makeRequest;
