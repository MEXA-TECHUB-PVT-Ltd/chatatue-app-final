import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const createGoals = createAsyncThunk(
    'createGoals/createGoals',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { signup } = getState();
            const { auth } = getState();
            const token = auth.authToken ? `Bearer ${auth.authToken}` : `Bearer ${signup.bearerToken}`;
            const data = await makeRequest('POST', ENDPOINTS.CREATE_GOALS, payload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const createGoalsSlice = createSlice({
    name: 'createGoals',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createGoals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGoals.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(createGoals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default createGoalsSlice.reducer;
