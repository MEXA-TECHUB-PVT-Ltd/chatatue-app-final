import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const removeClubMember = createAsyncThunk(
    'removeClubMember/removeClubMember',
    async (memberId, { getState, rejectWithValue }) => {
        try {
            const data = await makeRequest('DELETE', `/membership/${memberId}/remove`, null, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const removeClubMemberSlice = createSlice({
    name: 'removeClubMember',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(removeClubMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeClubMember.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(removeClubMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default removeClubMemberSlice.reducer;
