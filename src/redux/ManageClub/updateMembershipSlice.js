import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const updateMembership = createAsyncThunk(
    'updateMembership/updateMembership',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const request = {
                status: payload?.status
            }
            const data = await makeRequest('PATCH', `/membership/${payload?.memberId}`, request, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const updateMembershipSlice = createSlice({
    name: 'updateMembership',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateMembership.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMembership.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(updateMembership.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default updateMembershipSlice.reducer;
