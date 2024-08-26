import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: {},
    previousScreen: '',
    id: null
};

const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        },
        setId: (state, action) => {
            state.id = action.payload;
        },
        removeData: (state, action) => {
            const { key } = action.payload;
            delete state.data[key];
        },
        resetData: (state) => {
            state.data = {};
        },
        setPreviousScreen: (state, action) => {
            state.previousScreen = action.payload;
        },
    },
});

export const { setData, removeData, resetData, setPreviousScreen, setId } = generalSlice.actions;

export default generalSlice.reducer;
