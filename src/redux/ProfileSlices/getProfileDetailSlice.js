// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';


const initialState = {
    profileDetail: null,
    loading: false,
    error: null,
};

export const getProfileDetail = createAsyncThunk(
    'getProfileDetail/getProfileDetail',
    async (userId, { getState, rejectWithValue }) => {
        try {
            const data = await makeRequest('GET', `/users/${userId}`, null, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getProfileDetailSlice = createSlice({
    name: 'getProfileDetail',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProfileDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfileDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.profileDetail = action.payload.result;
            })
            .addCase(getProfileDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getProfileDetailSlice.reducer;
