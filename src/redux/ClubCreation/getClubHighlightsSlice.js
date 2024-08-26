// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';


const initialState = {
    highlightDetail: null,
    loading: false,
    error: null,
};

export const getClubHighlights = createAsyncThunk(
    'getClubHighlights/getClubHighlights',
    async (highlightId, { getState, rejectWithValue }) => {
        try {
            const data = await makeRequest('GET', `/highlights/${highlightId}`, null, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getClubHighlightsSlice = createSlice({
    name: 'getClubHighlights',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getClubHighlights.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getClubHighlights.fulfilled, (state, action) => {
                state.loading = false;
                state.highlightDetail = action.payload.result;
            })
            .addCase(getClubHighlights.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getClubHighlightsSlice.reducer;
