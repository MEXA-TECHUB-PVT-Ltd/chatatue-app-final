import { PermissionsAndroid, Alert, Linking } from 'react-native'; // Import PermissionsAndroid from 'react-native'

function showPermissionSettingsAlert(permissionType) {
  Alert.alert(
    `${permissionType} Permission Denied`,
    `To enable ${permissionType.toLowerCase()} access, please go to Settings and allow ${permissionType.toLowerCase()} permissions.`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'Settings', onPress: () => openAppSettings() },
    ],
    { cancelable: false }
  );
}

function openAppSettings() {
  // Open app settings
  Linking.openSettings();
}

export async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs access to your camera',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Camera permission granted');
    } else {
      console.log('Camera permission denied');
      showPermissionSettingsAlert("Camera")
    }
  } catch (err) {
    console.warn(err);
  }
}

/**
 * @name requestCameraAndAudioPermission
 * @description Function to request permission for Audio and Camera
 */
export default async function requestCameraAndAudioPermission() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    if (
      granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use the cameras & mic');
    } else {
      console.log('Permission denied');
      showPermissionSettingsAlert("Camera")
    }
  } catch (err) {
    console.warn(err);
  }
}

export const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission granted');
      return true; // Permission granted
    } else {
      console.log('Location permission denied');
      showPermissionSettingsAlert("Location")
      return false; // Permission denied
    }
  } catch (err) {
    console.warn(err);
  }
};

