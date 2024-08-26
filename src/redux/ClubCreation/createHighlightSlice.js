import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const createHighlight = createAsyncThunk(
    'createHighlight/createHighlight',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const finalEndpoint = payload?.method === 'PATCH' ? `${ENDPOINTS.UPDATE_HIGHLIGHT}${payload?.highlightId}` : ENDPOINTS.CREATE_HIGHLIGHT
            const data = await makeRequest(payload?.method, finalEndpoint, payload?.data, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const createHighlightSlice = createSlice({
    name: 'createHighlight',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createHighlight.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createHighlight.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(createHighlight.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default createHighlightSlice.reducer;
