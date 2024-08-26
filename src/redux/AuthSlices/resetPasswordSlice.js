import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const resetPassword = createAsyncThunk(
    'resetPassword/resetPassword',
    async (payload, { rejectWithValue }) => {
        try {
            const finalPayload = {
                password: payload?.password
            }
            const data = await makeRequest('PATCH', `${ENDPOINTS.RESET_PASSWORD}${payload?.user_id}`, finalPayload, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const resetPasswordSlice = createSlice({
    name: 'resetPassword',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default resetPasswordSlice.reducer;
