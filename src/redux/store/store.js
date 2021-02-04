import logger from 'redux-logger';
import {
    configureStore,
    getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { reducers } from '../slices';
import { storage as storageService } from '../../services';

function rehydrateStore() {
    return storageService.get();
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
