import { createSlice } from '@reduxjs/toolkit';
import { clearSession } from '../actions';

const initialState = { stage: 1 };

export default createSlice({
    name: 'computation',
    initialState,
    reducers: {
        changeStage: (state, action) => {
            state.stage = action.payload;
            if (state.stage > 3 || state.stage < 1) {
                state.stage = 1;
            }
        },
    },
    extraReducers: {
        [clearSession]: state => {
            Object.assign(state, initialState);
        },
    },
});
