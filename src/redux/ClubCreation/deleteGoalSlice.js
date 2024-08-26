import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const deleteGoal = createAsyncThunk(
    'deleteGoal/deleteGoal',
    async (goalId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.authToken}`;
            const data = await makeRequest('DELETE', `/club-goals/${goalId}/delete`, null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const deleteGoalSlice = createSlice({
    name: 'deleteGoal',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteGoal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGoal.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(deleteGoal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default deleteGoalSlice.reducer;
