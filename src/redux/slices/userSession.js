import { createSlice } from '@reduxjs/toolkit';

const initialState = { sessionId: '' };

const userSessionSlice = createSlice({
    name: 'userSession',
    initialState,
    reducers: {
        login: (state, action) => {
            state.sessionId = action.payload;
        },
        reset: state => {
            Object.assign(state, initialState);
        },
    },
});

userSessionSlice.initialState = initialState;

export default userSessionSlice;
