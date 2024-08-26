import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const deleteHighlight = createAsyncThunk(
    'deleteHighlight/deleteHighlight',
    async (highlightId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const data = await makeRequest('DELETE', `/highlights/${highlightId}`, null, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const deleteHighlightSlice = createSlice({
    name: 'deleteHighlight',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteHighlight.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteHighlight.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(deleteHighlight.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default deleteHighlightSlice.reducer;
