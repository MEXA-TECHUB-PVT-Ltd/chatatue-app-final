import React, { } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { useSelector } from 'react-redux';

const Root = () => {
    const { authToken } = useSelector((state) => state.auth);
    return (
        <NavigationContainer>

            {authToken ? <MainStack /> : <AuthStack />}

        </NavigationContainer>
    );
};


export default Root;
