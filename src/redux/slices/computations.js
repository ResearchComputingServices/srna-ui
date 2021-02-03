import { createSlice } from '@reduxjs/toolkit';
import { capitalize } from 'lodash';
import { clearSession } from '../actions';

const initialState = { data: {} };

export default createSlice({
    name: 'computations',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        },
        createComputation: (state, action) => {
            state.data[action.payload.taskId] = {
                taskId: action.payload.taskId,
                status: 'Pending',
                filename: action.payload.filename,
                createdDate: (new Date()).toISOString(),
                refreshForResultsCounter: 0,
            };
        },
        startComputation: (state, action) => {
            state.data[action.payload] = {
                ...state.data[action.payload],
                status: 'Started',
            };
        },
        completeComputation: (state, action) => {
            state.data[action.payload] = {
                ...state.data[action.payload],
                status: 'Success',
            };
        },
        updateComputationStatuses: (state, action) => {
            action.payload.forEach(status => {
                state.data[status.taskId] = {
                    ...state.data[status.taskId],
                    status: capitalize(status.taskStatus),
                };
            });
        },
        attemptComputationRefresh: (state, action) => {
            ++state.data[action.payload].refreshForResultsCounter;
        },
    },
    extraReducers: {
        [clearSession]: state => {
            Object.assign(state, initialState);
        },
    },
});
