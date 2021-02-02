import { createSlice } from '@reduxjs/toolkit';
import { clearSession } from '../actions';

const initialState = {
    palette: {
        type: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
        primary: {
            main: '#CF112D',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#4D4D4D',
            contrastText: '#ffffff',
        },
    },
};

export default createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setMode: (state, action) => {
            state.palette.type = action.payload;
        },
    },
    extraReducers: {
        [clearSession]: state => {
            Object.assign(state, initialState);
        },
    },
});
