import { createSlice } from '@reduxjs/toolkit';
import { clearSession } from '../actions';

const initialState = {
    stage: 1,
    refreshForResultsCounter: 0,
    downloadResultsCounter: 0,
    taskId: null,
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
        setTaskId: (state, action) => {
            state.taskId = action.payload;
        },
        incrementRefreshForResultsCounter: state => {
            ++state.refreshForResultsCounter;
        },
        incrementDownloadResultsCounter: state => {
            ++state.downloadResultsCounter;
        },
    },
    extraReducers: {
        [clearSession]: state => {
            Object.assign(state, initialState);
        },
    },
});
