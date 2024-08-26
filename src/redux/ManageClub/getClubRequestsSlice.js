// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';


const initialState = {
    clubRequests: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
};

export const getClubRequests = createAsyncThunk(
    'getClubRequests/getClubRequests',
    async ({ page = 1, limit = 10, clubId }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
            });


            const apiEndpoint = `/membership/requests/${clubId}?${params.toString()}`;

            const data = await makeRequest('GET', apiEndpoint, null, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getClubRequestsSlice = createSlice({
    name: 'getClubRequests',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getClubRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getClubRequests.fulfilled, (state, action) => {
                state.loading = false;
                if (action.meta.arg.page === 1) {
                    state.clubRequests = action.payload.result?.requests;
                } else {
                    state.clubRequests = [...state.clubRequests, ...action.payload.result?.requests];
                }
                state.currentPage = action.meta.arg.page;
                state.totalPages = action.payload.result?.pagination?.totalPages;
                state.totalCount = action.payload.result?.pagination?.totalItems;
            })
            .addCase(getClubRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getClubRequestsSlice.reducer;
