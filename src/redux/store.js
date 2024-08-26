// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import signInReducer from './AuthSlices/signInSlice';
import signupReducer from './AuthSlices/signupSlice';
import sendCodeReducer from './AuthSlices/sendCodeSlice';
import verifyCodeReducer from './AuthSlices/verifyCodeSlice';
import resetPasswordReducer from './AuthSlices/resetPasswordSlice';
import setDataReducer from './AuthSlices/setDataSlice';
import updateProfileReducer from './AuthSlices/updateProfileSlice';
import getExperiencesReducer from './AuthSlices/getExperiencesSlice';
import getSocialLinksReducer from './AuthSlices/getSocialLinksSlice';
import getCategoriesReducer from './AuthSlices/getCategoriesSlices';
import getSocialPreferencesReducer from './AuthSlices/getSocialPreferencesSlice';
import getRunningTimesReducer from './AuthSlices/getRunningTimesSlice';
import createSocialLinksReducer from './AuthSlices/createSocialLinksSlice';
import createGoalsReducer from './AuthSlices/createGoalsSlice';
import isFirstLaunchReducer from './AuthSlices/isFirstLaunchSlice';
import createClubReducer from './ClubCreation/createClubSlice';
import createClubRouteReducer from './ClubCreation/createClubRouteSlice';
import createClubRulesReducer from './ClubCreation/createClubRulesSlice';
import createScheduleReducer from './ClubCreation/createScheduleSlice';
import getAllClubsReducer from './ClubCreation/getAllClubsSlice';
import getClubDetailReducer from './ClubCreation/getClubDetailSlice';
import generalReducer from './generalSlice';
import getAllRoutesReducer from './ClubCreation/getAllRoutesSlice';
import deleteRouteReducer from './ClubCreation/deleteRouteSlice';
import deleteRuleReducer from './ClubCreation/deleteRuleSlice';
import deleteGoalReducer from './ClubCreation/deleteGoalSlice';
import cloudinaryReducer from './cloudinarySlice';
import deleteClubReducer from './ClubCreation/deleteClubSlice';
import getClubMembersReducer from './ManageClub/getClubMembersSlice';
import getClubRequestsReducer from './ManageClub/getClubRequestsSlice';
import updateMemberRoleReducer from './ManageClub/updateMemberRoleSlice';
import removeClubMemberReducer from './ManageClub/removeClubMemberSlice';
import sendMembershipRequestReducer from './ManageClub/sendMembershipRequestSlice';
import updateMembershipReducer from './ManageClub/updateMembershipSlice';
import followUserReducer from './FollowSlices/followUserSlice';
import AddReviewReducer from './ReviewSlices/AddReviewSlice';
import getProfileDetailReducer from './ProfileSlices/getProfileDetailSlice';
import getAllClubPostFeedsReducer from './ClubCreation/getAllClubPostFeedsSlice';
import createClubPostReducer from './ClubCreation/createClubPostSlice';
import createHighlightReducer from './ClubCreation/createHighlightSlice';
import getClubPostReducer from './ClubCreation/getClubPostSlice';
import getClubHighlightsReducer from './ClubCreation/getClubHighlightsSlice';
import deleteHighlightReducer from './ClubCreation/deleteHighlightSlice';
import deleteClubPostReducer from './ClubCreation/deleteClubPostSlice';
import createClubGoalReducer from './ClubCreation/createClubGoalSlice';
import getAllEventsReducer from './EventSlices/getAllEventsSlice';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth', 'signup', 'isFirstLaunch']  // Persist 'auth' and 'signup' slices
};

const rootReducer = combineReducers({
    setAuthData: setDataReducer,
    isFirstLaunch: isFirstLaunchReducer,
    general: generalReducer,
    auth: signInReducer,
    signup: signupReducer,
    sendCode: sendCodeReducer,
    verifyCode: verifyCodeReducer,
    resetPassword: resetPasswordReducer,
    createProfile: updateProfileReducer,
    experiences: getExperiencesReducer,
    socialLinks: getSocialLinksReducer,
    categories: getCategoriesReducer,
    socialPreferences: getSocialPreferencesReducer,
    runningTimes: getRunningTimesReducer,
    createSocialLinks: createSocialLinksReducer,
    createGoals: createGoalsReducer,
    createClub: createClubReducer,
    createClubRoute: createClubRouteReducer,
    createClubRules: createClubRulesReducer,
    createSchedule: createScheduleReducer,
    getAllClubs: getAllClubsReducer,
    getClubDetail: getClubDetailReducer,
    getAllRoutes: getAllRoutesReducer,
    deleteRoute: deleteRouteReducer,
    deleteRule: deleteRuleReducer,
    deleteGoal: deleteGoalReducer,
    cloudinary: cloudinaryReducer,
    deleteClub: deleteClubReducer,
    getClubMembers: getClubMembersReducer,
    getClubRequests: getClubRequestsReducer,
    updateMemberRole: updateMemberRoleReducer,
    removeClubMember: removeClubMemberReducer,
    sendMembershipRequest: sendMembershipRequestReducer,
    updateMembership: updateMembershipReducer,
    followUser: followUserReducer,
    addReview: AddReviewReducer,
    getProfileDetail: getProfileDetailReducer,
    getAllClubPostFeeds: getAllClubPostFeedsReducer,
    createClubPost: createClubPostReducer,
    createHighlight: createHighlightReducer,
    getClubPost: getClubPostReducer,
    getClubHighlights: getClubHighlightsReducer,
    deleteHighlight: deleteHighlightReducer,
    deleteClubPost: deleteClubPostReducer,
    createClubGoal: createClubGoalReducer,
    getAllEvents: getAllEventsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
