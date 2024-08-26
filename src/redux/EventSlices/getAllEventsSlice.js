// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';


const initialState = {
    events: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
};

export const getAllEvents = createAsyncThunk(
    'getAllEvents/getAllEvents',
    async ({ page = 1, limit = 10, searchPayload }, { getState, rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                sortField: "created_at",
                sortOrder: "DESC"
            });

            if (searchPayload?.search) params.append('search', searchPayload.search);
            if (searchPayload?.userId) params.append('userId', searchPayload.userId);
            if (searchPayload?.creator_id) params.append('creator_id', searchPayload.creator_id);

            const apiUrl = `/events?${params.toString()}`;

            const data = await makeRequest('GET', apiUrl, null, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getAllEventsSlice = createSlice({
    name: 'getAllEvents',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllEvents.fulfilled, (state, action) => {
                state.loading = false;
                if (action.meta.arg.page === 1) {
                    state.events = action.payload.result?.events;
                } else {
                    state.events = [...state.events, ...action.payload.result?.events];
                }
                state.currentPage = action.meta.arg.page;
                state.totalPages = action.payload.result?.pagination?.totalPages;
                state.totalCount = action.payload.result?.pagination?.totalItems;
            })
            .addCase(getAllEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getAllEventsSlice.reducer;
