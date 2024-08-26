import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';

const initialState = {
    experiences: null,
    loading: false,
    error: null,
};

export const getExperiences = createAsyncThunk(
    'experiences/getExperiences',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { signup } = getState();
            const { auth } = getState();
            const token = auth.authToken ? `Bearer ${auth.authToken}` : `Bearer ${signup.bearerToken}`;
            const user_id = auth.user_id ? auth.user_id : signup.user_id;
            const data = await makeRequest('GET', ENDPOINTS.EXPERIENCE_LEVEL, _, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getExperiencesSlice = createSlice({
    name: 'experiences',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getExperiences.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getExperiences.fulfilled, (state, action) => {
                state.loading = false;
                state.experiences = action.payload?.result;
            })
            .addCase(getExperiences.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getExperiencesSlice.reducer;
