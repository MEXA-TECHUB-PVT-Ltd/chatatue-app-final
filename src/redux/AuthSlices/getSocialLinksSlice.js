import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';

const initialState = {
    socialLinks: null,
    loading: false,
    error: null,
};

export const getSocialLinks = createAsyncThunk(
    'socialLinks/getSocialLinks',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { signup } = getState();
            const { auth } = getState();
            const token = auth.authToken ? `Bearer ${auth.authToken}` : `Bearer ${signup.bearerToken}`;
            const user_id = auth.user_id ? auth.user_id : signup.user_id;
            const data = await makeRequest('GET', `${ENDPOINTS.SOCIAL_LINKS}${user_id}`, null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getSocialLinksSlice = createSlice({
    name: 'socialLinks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSocialLinks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSocialLinks.fulfilled, (state, action) => {
                state.loading = false;
                state.socialLinks = action.payload?.result;
            })
            .addCase(getSocialLinks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getSocialLinksSlice.reducer;
