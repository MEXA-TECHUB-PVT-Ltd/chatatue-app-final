import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const sendCode = createAsyncThunk(
    'sendCode/sendCode',
    async (payload, { rejectWithValue }) => {
        try {
            const data = await makeRequest('POST', ENDPOINTS.VERIFY_EMAIL, payload);
            return data;
        } catch (error) {
            return error
        }
    }
);

const sendCodeSlice = createSlice({
    name: 'sendCode',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendCode.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(sendCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default sendCodeSlice.reducer;
