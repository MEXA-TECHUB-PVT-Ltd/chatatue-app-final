import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const updatePassword = createAsyncThunk(
    'updatePassword/updatePassword',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { authToken } = getState().auth;
            const bearerToken = `Bearer ${authToken}`
            const data = await makeRequest('POST', '/api/v1/users/update-password', payload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const updatePasswordSlice = createSlice({
    name: 'updatePassword',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default updatePasswordSlice.reducer;
