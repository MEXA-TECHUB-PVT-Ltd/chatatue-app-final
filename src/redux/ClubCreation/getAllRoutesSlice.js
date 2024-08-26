// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    routes: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
};

export const getAllRoutes = createAsyncThunk(
    'getAllRoutes/getAllRoutes',
    async ({ page = 1, limit = 10, searchPayload }, { getState, rejectWithValue }) => {
        try {
            const { authToken, user_id } = getState().auth;  // get user_id from the state
            const bearerToken = `Bearer ${authToken}`;
            const data = await makeRequest('GET', `/routes`, null, null, bearerToken);

            // Filter routes to only include those belonging to the current user
            const filteredRoutes = data.result?.routes?.filter(route => route.user_id === user_id);
        
            return {
                ...data,
                result: {
                    ...data.result,
                    routes: filteredRoutes,  // assign filtered routes
                }
            };
        } catch (error) {
            return error; // handle error
        }
    }
);

const getAllRoutesSlice = createSlice({
    name: 'getAllRoutes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllRoutes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllRoutes.fulfilled, (state, action) => {
                state.loading = false;
                if (action.meta.arg.page === 1) {
                    state.routes = action.payload.result?.routes;  // set filtered routes
                } else {
                    state.routes = [...state.routes, ...action.payload.result?.routes];  // append filtered routes
                }
                state.currentPage = action.meta.arg.page;
                state.totalPages = action.payload.result?.pagination?.totalPages;
                state.totalCount = action.payload.result?.pagination?.totalItems;
            })
            .addCase(getAllRoutes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getAllRoutesSlice.reducer;
