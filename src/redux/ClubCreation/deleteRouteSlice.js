import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const deleteRoute = createAsyncThunk(
    'deleteRoute/deleteRoute',
    async (routeId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.authToken}`;
            const data = await makeRequest('DELETE', `/routes/${routeId}`, null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const deleteRouteSlice = createSlice({
    name: 'deleteRoute',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteRoute.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRoute.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(deleteRoute.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default deleteRouteSlice.reducer;
