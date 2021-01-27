import { createSlice } from '@reduxjs/toolkit';
import { clearSession } from '../actions';

const initialState = { data: {} };

export default createSlice({
    name: 'computations',
    initialState,
    reducers: {
        createComputation: (state, action) => {
            state.data[action.payload.taskId] = {
                taskId: action.payload.taskId,
                status: 'Pending',
                filename: action.payload.filename,
                createdDate: (new Date()).toISOString(),
                refreshForResultsCounter: 0,
                downloadResultsCounter: 0,
            };
        },
        completeComputation: (state, action) => {
            state.data[action.payload] = {
                ...state.data[action.payload],
                status: 'Completed',
            };
        },
        completeComputations: (state, action) => {
            action.payload.forEach(taskId => {
                state.data[taskId] = {
                    ...state.data[taskId],
                    status: 'Completed',
                };
            });
        },
        attemptComputationRefresh: (state, action) => {
            ++state.data[action.payload].refreshForResultsCounter;
        },
        attemptComputationDownload: (state, action) => {
            ++state.data[action.payload].downloadResultsCounter;
        },
    },
    extraReducers: {
        [clearSession]: state => {
            Object.assign(state, initialState);
        },
    },
});
