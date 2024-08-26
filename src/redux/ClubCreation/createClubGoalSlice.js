import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const createClubGoal = createAsyncThunk(
    'createClubGoal/createClubGoal',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const data = await makeRequest('POST', ENDPOINTS.CREATE_CLUB_GOALS, payload, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const createClubGoalSlice = createSlice({
    name: 'createClubGoal',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createClubGoal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClubGoal.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(createClubGoal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default createClubGoalSlice.reducer;
