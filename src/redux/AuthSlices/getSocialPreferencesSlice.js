import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';

const initialState = {
    socialPreferences: null,
    loading: false,
    error: null,
};

export const getSocialPreferences = createAsyncThunk(
    'socialPreferences/getSocialPreferences',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { signup } = getState();
            const { auth } = getState();
            const token = auth.authToken ? `Bearer ${auth.authToken}` : `Bearer ${signup.bearerToken}`;
            const user_id = auth.user_id ? auth.user_id : signup.user_id;
            const data = await makeRequest('GET', ENDPOINTS.SOCIAL_PREFERENCES, null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getSocialPreferencesSlice = createSlice({
    name: 'socialPreferences',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSocialPreferences.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSocialPreferences.fulfilled, (state, action) => {
                state.loading = false;
                state.socialPreferences = action.payload?.result;
            })
            .addCase(getSocialPreferences.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getSocialPreferencesSlice.reducer;
