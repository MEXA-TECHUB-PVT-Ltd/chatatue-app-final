import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const verifyCode = createAsyncThunk(
    'verifyCode/verifyCode',
    async (payload, { rejectWithValue }) => {
        try {
            const data = await makeRequest('POST', ENDPOINTS.VERIFY_CODE, payload);
            return data;
        } catch (error) {
            return error
        }
    }
);

const verifyCodeSlice = createSlice({
    name: 'verifyCode',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(verifyCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyCode.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(verifyCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default verifyCodeSlice.reducer;
