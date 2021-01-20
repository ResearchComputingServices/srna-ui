import { createSlice } from '@reduxjs/toolkit';
import { clearSession } from '../actions';

const initialState = {
    stage: 1,
    refreshForResultsCounter: 0,
};

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
        incrementRefreshForResultsCounter: state => {
            ++state.refreshForResultsCounter;
        },
    },
    extraReducers: {
        [clearSession]: state => {
            Object.assign(state, initialState);
        },
    },
});
