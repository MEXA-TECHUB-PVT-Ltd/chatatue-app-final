// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';


const initialState = {
    clubMembers: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
};

export const getClubMembers = createAsyncThunk(
    'getClubMembers/getClubMembers',
    async ({ page = 1, limit = 30, clubId }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
            });


            const apiEndpoint = `/membership/${clubId}/members?${params.toString()}`;

            const data = await makeRequest('GET', apiEndpoint, null, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getClubMembersSlice = createSlice({
    name: 'getClubMembers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getClubMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getClubMembers.fulfilled, (state, action) => {
                state.loading = false;
                if (action.meta.arg.page === 1) {
                    state.clubMembers = action.payload.result?.members;
                } else {
                    state.clubMembers = [...state.clubMembers, ...action.payload.result?.members];
                }
                state.currentPage = action.meta.arg.page;
                state.totalPages = action.payload.result?.pagination?.totalPages;
                state.totalCount = action.payload.result?.pagination?.totalItems;
            })
            .addCase(getClubMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getClubMembersSlice.reducer;
