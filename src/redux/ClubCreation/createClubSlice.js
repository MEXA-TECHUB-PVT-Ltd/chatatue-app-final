import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const createClub = createAsyncThunk(
    'createClub/createClub',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.authToken}`;
            const finalEndpoint = payload?.method === 'PUT' ? `${ENDPOINTS.UPDATE_CLUB}${payload?.clubID}` : ENDPOINTS.CREATE_CLUB
            const data = await makeRequest(payload?.method, finalEndpoint, payload?.data, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const createClubSlice = createSlice({
    name: 'createClub',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createClub.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClub.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(createClub.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default createClubSlice.reducer;
