import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const createSchedule = createAsyncThunk(
    'createSchedule/createSchedule',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.authToken}`;
            const data = await makeRequest('POST', ENDPOINTS.CREATE_SCHEDULE, payload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const createScheduleSlice = createSlice({
    name: 'createSchedule',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSchedule.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(createSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default createScheduleSlice.reducer;
