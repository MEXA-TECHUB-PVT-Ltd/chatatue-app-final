import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Chat, Clubs, Events, Home, MyProfile } from '..';
import { SCREENS } from '../constant/constants';
import CustomBottomTabBar from '../components/CustomBottomTabBar';
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const icons = ["home-outline", "account-group-outline", "calendar-outline", "chat-outline", "account-outline"];
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarHideOnKeyboard: true,
            }}
            tabBar={(props) => <CustomBottomTabBar {...props} icons={icons} />}>
            <Tab.Screen name={SCREENS.HOME}
                component={Home}
                options={{
                    headerShown: false,
                    title: "Home",
                }} />
            <Tab.Screen name={SCREENS.CLUBS} component={Clubs}
                options={{
                    headerShown: false,
                    title: "Clubs",
                }} />
            <Tab.Screen name={SCREENS.EVENTS} component={Events}
                options={{
                    headerShown: false,
                    title: "Events",
                }} />
            <Tab.Screen name={SCREENS.CHAT} component={Chat}
                options={{
                    headerShown: false,
                    title: "Chat",
                }} />

            <Tab.Screen name={SCREENS.MY_PROFILE} component={MyProfile}
                options={{
                    headerShown: false,
                    title: "My Profile",
                }} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
