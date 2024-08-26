import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';

const initialState = {
    runningTimes: null,
    loading: false,
    error: null,
};

export const getRunningTimes = createAsyncThunk(
    'runningTimes/getRunningTimes',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { signup } = getState();
            const { auth } = getState();
            const token = auth.authToken ? `Bearer ${auth.authToken}` : `Bearer ${signup.bearerToken}`;
            const user_id = auth.user_id ? auth.user_id : signup.user_id;
            const data = await makeRequest('GET', ENDPOINTS.RUNNING_TIME, null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getRunningTimesSlice = createSlice({
    name: 'runningTimes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRunningTimes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRunningTimes.fulfilled, (state, action) => {
                state.loading = false;
                state.runningTimes = action.payload?.result;
            })
            .addCase(getRunningTimes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getRunningTimesSlice.reducer;
