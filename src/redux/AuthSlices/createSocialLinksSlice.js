import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const createSocialLinks = createAsyncThunk(
    'createSocialLinks/createSocialLinks',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { signup } = getState();
            const { auth } = getState();
            const token = auth.authToken ? `Bearer ${auth.authToken}` : `Bearer ${signup.bearerToken}`;
            const data = await makeRequest('POST', ENDPOINTS.CREATE_SOCIAL_LINK, payload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const createSocialLinksSlice = createSlice({
    name: 'createSocialLinks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createSocialLinks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSocialLinks.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(createSocialLinks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default createSocialLinksSlice.reducer;
