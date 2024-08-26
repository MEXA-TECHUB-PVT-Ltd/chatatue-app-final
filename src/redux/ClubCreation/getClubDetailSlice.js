// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';


const initialState = {
    clubDetail: null,
    loading: false,
    error: null,
};

export const getClubDetail = createAsyncThunk(
    'getClubDetail/getClubDetail',
    async (clubId, { getState, rejectWithValue }) => {
        try {
            const { authToken, user_id } = getState().auth;
            const bearerToken = `Bearer ${authToken}`;
            const data = await makeRequest('GET', `/clubs/${clubId}`, null, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getClubDetailSlice = createSlice({
    name: 'getClubDetail',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getClubDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getClubDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.clubDetail = action.payload.result;
            })
            .addCase(getClubDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getClubDetailSlice.reducer;
