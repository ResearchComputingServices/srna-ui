import _ from 'lodash';
import logger from 'redux-logger';
import {
    configureStore,
    getDefaultMiddleware,
} from '@reduxjs/toolkit';
import moment from 'moment';
import { reducers } from '../slices';
import { storage as storageService } from '../../services';

function pruneComputation($appData) {
    const cutOff = 1;
    if ($appData.computations) {
        const prunedData = {};
        _.each($appData.computations.data, (value, key) => {
            const now = moment();
            const createdDate = moment(value.createdDate);
            const diff = now.diff(createdDate, 'days');
            if (diff < cutOff) {
                prunedData[key] = value;
            }
        });
        $appData.computations.data = prunedData;
    }
    return $appData;
}

function rehydrateStore() {
    const $appData = storageService.get();
    return $appData ? pruneComputation($appData) : {};
}

function dehydrateStore(store) {
    storageService.set(store.getState());
}

const store = configureStore({
    preloadedState: rehydrateStore(),
    reducer: reducers,
    middleware: process && process.env && process.env.NODE_ENV === 'development'
        ? [
            ...getDefaultMiddleware(),
            logger,
        ]
        : [...getDefaultMiddleware()],
});

store.subscribe(() => dehydrateStore(store));

export default store;
