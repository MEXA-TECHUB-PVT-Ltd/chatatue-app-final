import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const deleteRule = createAsyncThunk(
    'deleteRule/deleteRule',
    async (ruleId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.authToken}`;
            const data = await makeRequest('DELETE', `/club-rules/${ruleId}/delete`, null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const deleteRuleSlice = createSlice({
    name: 'deleteRule',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteRule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRule.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(deleteRule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default deleteRuleSlice.reducer;
