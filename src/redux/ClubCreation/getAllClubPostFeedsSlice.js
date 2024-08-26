// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';


const initialState = {
    clubPosts: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
};

export const getAllClubPostFeeds = createAsyncThunk(
    'getAllClubPostFeeds/getAllClubPostFeeds',
    async ({ page = 1, limit = 10, searchPayload }, { getState, rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                sortField: "created_at",
                sortOrder: "DESC"
            });

            if (searchPayload?.search) params.append('search', searchPayload.search);
            if (searchPayload?.user_id) params.append('user_id', searchPayload.user_id);
            if (searchPayload?.searcher_id) params.append('searcher_id', searchPayload.searcher_id);
            if (searchPayload?.clubId) params.append('club_id', searchPayload.clubId);

            const apiUrl = `/posts?${params.toString()}`;
            console.log(apiUrl)
            const data = await makeRequest('GET', apiUrl, null, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getAllClubPostFeedsSlice = createSlice({
    name: 'getAllClubPostFeeds',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllClubPostFeeds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllClubPostFeeds.fulfilled, (state, action) => {
                state.loading = false;
                if (action.meta.arg.page === 1) {
                    state.clubPosts = action.payload.result?.posts;
                } else {
                    state.clubPosts = [...state.clubPosts, ...action.payload.result?.posts];
                }
                state.currentPage = action.meta.arg.page;
                state.totalPages = action.payload.result?.pagination?.totalPages;
                state.totalCount = action.payload.result?.pagination?.totalItems;
            })
            .addCase(getAllClubPostFeeds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getAllClubPostFeedsSlice.reducer;
