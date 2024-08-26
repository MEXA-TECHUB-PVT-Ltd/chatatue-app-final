// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';


const initialState = {
    clubPostDetail: null,
    loading: false,
    error: null,
};

export const getClubPost = createAsyncThunk(
    'getClubPost/getClubPost',
    async (postId, { getState, rejectWithValue }) => {
        try {
            const data = await makeRequest('GET', `/posts/${postId}`, null, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getClubPostSlice = createSlice({
    name: 'getClubPost',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getClubPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getClubPost.fulfilled, (state, action) => {
                state.loading = false;
                state.clubPostDetail = action.payload.result;
            })
            .addCase(getClubPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getClubPostSlice.reducer;
