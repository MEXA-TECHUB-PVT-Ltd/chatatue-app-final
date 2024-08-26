import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SCREENS } from '../constant/constants';
import { CreateProfile, ForgetPassword, Login, Onboarding, ResetPassword, VerifyCode } from '..';
import { useSelector } from 'react-redux';

const Stack = createStackNavigator();

const AuthStack = () => {
    const { isFirstLaunch } = useSelector((state) => state.isFirstLaunch);
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}>
            {isFirstLaunch && <Stack.Screen name={SCREENS.ONBOARDING} component={Onboarding} />}
            <Stack.Screen name={SCREENS.LOGIN} component={Login} />
            <Stack.Screen name={SCREENS.FORGET_PASSWORD} component={ForgetPassword} />
            <Stack.Screen name={SCREENS.VERIFY_CODE} component={VerifyCode} />
            <Stack.Screen name={SCREENS.RESET_PASSWORD} component={ResetPassword} />
            <Stack.Screen name={SCREENS.CREATE_PROFILE} component={CreateProfile} />
        </Stack.Navigator>
    );
}

export default AuthStack;