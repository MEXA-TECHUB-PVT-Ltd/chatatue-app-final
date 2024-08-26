import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const followUser = createAsyncThunk(
    'followUser/followUser',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.authToken}`;
            const data = await makeRequest('POST', ENDPOINTS.FOLLOW_USER, payload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const followUserSlice = createSlice({
    name: 'followUser',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(followUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(followUser.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(followUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default followUserSlice.reducer;
