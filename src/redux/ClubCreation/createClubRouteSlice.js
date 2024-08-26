import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const createClubRoute = createAsyncThunk(
    'createClubRoute/createClubRoute',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.authToken}`;
            const data = await makeRequest('POST', ENDPOINTS.CREATE_ROUTE, payload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const createClubRouteSlice = createSlice({
    name: 'createClubRoute',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createClubRoute.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClubRoute.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(createClubRoute.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default createClubRouteSlice.reducer;
