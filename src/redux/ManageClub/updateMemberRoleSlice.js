import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const updateMemberRole = createAsyncThunk(
    'updateMemberRole/updateMemberRole',
    async (memberId, { getState, rejectWithValue }) => {
        try {
            const payload = {
                member_role: "ADMIN"
            }
            const data = await makeRequest('PATCH', `/membership/update-role/${memberId}`, payload, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const updateMemberRoleSlice = createSlice({
    name: 'updateMemberRole',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateMemberRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMemberRole.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(updateMemberRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default updateMemberRoleSlice.reducer;
