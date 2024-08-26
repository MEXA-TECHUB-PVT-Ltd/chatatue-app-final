import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { API_BASE_URL } from '@env'
import { ENDPOINTS } from '../constant/endpoints';

const initializePaymentSheet = async (amount, merchantDisplayName = 'Test User', userId) => {
    console.log('userId', userId)
    // const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PAYMENT_INTENT}`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         amount: amount,
    //         userId: userId
    //     }),
    // });

    // console.log('response', response?.result)

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "connect.sid=s%3AH-PRbvKiwrTNTBOmXBYjQy1fjzmW4b8N.Fs4YQ8SCqLfnm2mSz5AbGMSx5xYMmYhQm26%2Blv06pjo");

    const raw = JSON.stringify({
        amount: amount,
        userId: userId
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PAYMENT_INTENT}`, requestOptions);
    const result = await response.json();


    const { customerId, ephemeralKey, paymentIntent } = result?.result
    console.log('Customer ID:', customerId);
    console.log('Ephemeral Key:', ephemeralKey);
    console.log('Payment Intent:', paymentIntent?.id);

    const { error } = await initPaymentSheet({
        customerId: customerId,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent?.client_secret,
        merchantDisplayName, // Optional
        applePay: { merchantCountryCode: 'US' },
        googlePay: { merchantCountryCode: 'US' },
        primaryButtonLabel: `Pay $${(amount).toFixed(2)}`
    });

    if (error) {
        console.log('Error initializing payment sheet:', error);
        return false;
    } else {
        console.log('Payment sheet initialized');
        return true;
    }
};

const openPaymentSheet = async (amount, handleApiCall, merchantDisplayName, userId) => {
    const initialized = await initializePaymentSheet(amount, merchantDisplayName, userId);
    if (!initialized) return;

    const { error } = await presentPaymentSheet();

    if (error) {
        console.log('Error presenting payment sheet:', error);
    } else {
        console.log('Payment successful');
        if (handleApiCall) handleApiCall();
    }
};

export { initializePaymentSheet, openPaymentSheet };
