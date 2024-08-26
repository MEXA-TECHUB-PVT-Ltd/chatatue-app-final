import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const addReview = createAsyncThunk(
    'addReview/addReview',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const data = await makeRequest('POST', ENDPOINTS.ADD_REVIEW, payload, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const addReviewSlice = createSlice({
    name: 'addReview',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(addReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default addReviewSlice.reducer;
