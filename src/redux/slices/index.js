import userSession from './userSession';
import theme from './theme';
import computations from './computations';
import { clearSession } from '../actions';

export const actions = {
    userSession: Object.assign(userSession.actions, { clearSession }),
    theme: theme.actions,
    computations: computations.actions,
};

export const reducers = {
    userSession: userSession.reducer,
    theme: theme.reducer,
    computations: computations.reducer,
};
