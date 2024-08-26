import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const createClubPost = createAsyncThunk(
    'createClubPost/createClubPost',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const finalEndpoint = payload?.method === 'PATCH' ? `${ENDPOINTS.UPDATE_CLUB_POST}${payload?.postId}` : ENDPOINTS.CREATE_POST
            const data = await makeRequest(payload?.method, finalEndpoint, payload?.data, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const createClubPostSlice = createSlice({
    name: 'createClubPost',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createClubPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClubPost.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(createClubPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default createClubPostSlice.reducer;
