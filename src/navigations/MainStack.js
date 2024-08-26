import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SCREENS } from '../constant/constants';
import BottomTabNavigator from './BottomTabBar';
import { ClubCreation, ClubDetail, ClubFeeds, ClubPostCreation, ClubPostDetail, ClubRequests, HighlightDetail, ManageMembers, UpdateClub, ViewProfile } from '..'

const Stack = createStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name={SCREENS.MAIN_DASHBOARD} component={BottomTabNavigator} />
            <Stack.Screen name={SCREENS.CLUB_CREATION} component={ClubCreation} />
            <Stack.Screen name={SCREENS.CLUB_DETAIL} component={ClubDetail} />
            <Stack.Screen name={SCREENS.UPDATE_CLUB} component={UpdateClub} />
            <Stack.Screen name={SCREENS.MANAGE_MEMBERS} component={ManageMembers} />
            <Stack.Screen name={SCREENS.CLUB_REQUESTS} component={ClubRequests} />
            <Stack.Screen name={SCREENS.VIEW_PROFILE} component={ViewProfile} />
            <Stack.Screen name={SCREENS.CLUB_FEEDS} component={ClubFeeds} />
            <Stack.Screen name={SCREENS.CLUB_POST_CREATION} component={ClubPostCreation} />
            <Stack.Screen name={SCREENS.HIGHLIGHT_CLUB_DETAIL} component={HighlightDetail} />
            <Stack.Screen name={SCREENS.CLUB_POST_DETAIL} component={ClubPostDetail} />
        </Stack.Navigator>
    );
};

export default MainStack;
