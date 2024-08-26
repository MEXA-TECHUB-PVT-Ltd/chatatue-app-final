// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';

const initialState = {
    bearerToken: null,
    role: null,
    user_id: null,
    response: null,
    loading: false,
    error: null,
};

export const signupUser = createAsyncThunk(
    'signup/signupUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await makeRequest('POST', ENDPOINTS.SIGNUP, credentials, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
        clearState(state) {
            state.bearerToken = null;
            state.response = null;
            state.role = null;
            state.user_id = null;
        },
        setTempToken(state, action) {
            state.bearerToken = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
                state.bearerToken = action.payload?.result?.authToken;
                state.role = action.payload?.result?.user_role;
                state.user_id = action.payload?.result?.id;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export const { clearState, setTempToken } = signupSlice.actions;
export default signupSlice.reducer;
