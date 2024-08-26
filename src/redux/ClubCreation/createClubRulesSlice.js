import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';


const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const createClubRules = createAsyncThunk(
    'createClubRules/createClubRules',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.authToken}`;
            const data = await makeRequest('POST', ENDPOINTS.CREATE_CLUB_RULES, payload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const createClubRulesSlice = createSlice({
    name: 'createClubRules',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createClubRules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClubRules.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(createClubRules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default createClubRulesSlice.reducer;
