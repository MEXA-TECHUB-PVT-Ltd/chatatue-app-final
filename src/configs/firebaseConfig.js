// firebaseConfig.js
import { Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID
} from '@env';

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

async function requestNotificationPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
        const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (permission === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission granted.');
        } else {
            console.log('Notification permission denied.');
        }
    }
}

async function requestUserPermission() {
    const authStatus = await messaging().requestPermission({
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        provisional: false,
        sound: true,
    });
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}

async function getFcmToken() {
    // await requestNotificationPermission();
    requestUserPermission()
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
        return fcmToken
    } else {
        console.log('Failed to get FCM token');
    }
}

function onMessageListener() {
    return messaging().onMessage(async remoteMessage => {
        console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
}

export {
    getFcmToken,
    onMessageListener,
    requestUserPermission
};
