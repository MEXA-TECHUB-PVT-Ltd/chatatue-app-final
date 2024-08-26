// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const updateProfile = createAsyncThunk(
    'createProfile/updateProfile',
    async (profilePayload, { getState, rejectWithValue }) => {
        try {
            const { signup } = getState();
            const { auth } = getState();
            const token = auth.authToken ? `Bearer ${auth.authToken}` : `Bearer ${signup.bearerToken}`;
            const user_id = auth.user_id ? auth.user_id : signup.user_id;
            console.log('user_id', user_id)
            const data = await makeRequest('PUT', `/users/${user_id}/update`, profilePayload, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const updateProfileSlice = createSlice({
    name: 'createProfile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default updateProfileSlice.reducer;
