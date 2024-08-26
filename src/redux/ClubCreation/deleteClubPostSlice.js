import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const deleteClubPost = createAsyncThunk(
    'deleteClubPost/deleteClubPost',
    async (clubPostId, { getState, rejectWithValue }) => {
        try {
            const data = await makeRequest('DELETE', `/posts/${clubPostId}`, null, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const deleteClubPostSlice = createSlice({
    name: 'deleteClubPost',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteClubPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteClubPost.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(deleteClubPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default deleteClubPostSlice.reducer;
