import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isFirstLaunch: true
};

const isFirstLaunchSlice = createSlice({
    name: 'isFirstLaunch',
    initialState,
    reducers: {
        setFirstLaunch: (state, action) => {
            state.isFirstLaunch = action.payload;
        },
    },
});

export const { setFirstLaunch } = isFirstLaunchSlice.actions;

export default isFirstLaunchSlice.reducer;
