import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const deleteClub = createAsyncThunk(
    'deleteClub/deleteClub',
    async (clubId, { getState, rejectWithValue }) => {
        try {
            const data = await makeRequest('DELETE', `/clubs/${clubId}`, null, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const deleteClubSlice = createSlice({
    name: 'deleteClub',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteClub.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteClub.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(deleteClub.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default deleteClubSlice.reducer;
