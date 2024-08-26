import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const sendMembershipRequest = createAsyncThunk(
    'sendMembershipRequest/sendMembershipRequest',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const data = await makeRequest('POST', `/membership/send-request`, payload, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const sendMembershipRequestSlice = createSlice({
    name: 'sendMembershipRequest',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendMembershipRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMembershipRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(sendMembershipRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default sendMembershipRequestSlice.reducer;
