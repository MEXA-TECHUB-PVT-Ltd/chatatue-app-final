import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { WEB_CLIENT_ID } from '@env'

export const configureGoogleSignin = () => {
    GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
    });
};

export const onGoogleButtonPress = async () => {
    try {
        await GoogleSignin.signOut();
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const userCredential = await auth().signInWithCredential(googleCredential);
        return { user: userCredential.user, idToken };

    } catch (error) {
        console.error('Google Sign-In Error:', error);
        throw error;
    }
};
