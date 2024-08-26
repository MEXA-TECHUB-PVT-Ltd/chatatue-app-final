import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: null
};

const setDataSlice = createSlice({
    name: 'setAuthData',
    initialState,
    reducers: {
        setAuthData: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { setAuthData } = setDataSlice.actions;

export default setDataSlice.reducer;
