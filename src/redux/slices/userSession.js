import { createSlice } from '@reduxjs/toolkit';
import { clearSession } from '../actions';

const initialState = {
    sessionId: '',
    createdDate: null,
    lastLoginDate: null,
};

const userSessionSlice = createSlice({
    name: 'userSession',
    initialState,
    reducers: {
        login: (state, action) => {
            state.sessionId = action.payload;
            state.lastLoginDate = new Date().toISOString();
        },
        register: (state, action) => {
            state.sessionId = action.payload;
            state.createdDate = new Date().toISOString();
        },
        reset: state => {
            Object.assign(state, initialState);
        },
    },
    extraReducers: {
        [clearSession]: state => {
            Object.assign(state, initialState);
        },
    },
});

userSessionSlice.initialState = initialState;

export default userSessionSlice;
