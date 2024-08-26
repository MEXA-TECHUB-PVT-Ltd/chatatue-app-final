import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';

const initialState = {
    categories: null,
    loading: false,
    error: null,
};

export const getCategories = createAsyncThunk(
    'categories/getCategories',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { signup } = getState();
            const { auth } = getState();
            const token = auth.authToken ? `Bearer ${auth.authToken}` : `Bearer ${signup.bearerToken}`;
            const user_id = auth.user_id ? auth.user_id : signup.user_id;
            // const data = await makeRequest('GET', ENDPOINTS.CATEGORY, null, null, token);
            const endpoint = payload?.isCategory ? ENDPOINTS.CATEGORY : '/sub-category';
            const data = await makeRequest('GET', endpoint, null, null, token);

            return data;
        } catch (error) {
            return error
        }
    }
);

const getCategoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload?.result;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getCategoriesSlice.reducer;
