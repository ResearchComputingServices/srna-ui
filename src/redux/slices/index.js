import userSession from './userSession';
import theme from './theme';
import computation from './computation';
import { clearSession } from '../actions';

export const actions = {
    userSession: Object.assign(userSession.actions, { clearSession }),
    theme: theme.actions,
    computation: computation.actions,
};

export const reducers = {
    userSession: userSession.reducer,
    theme: theme.reducer,
    computation: computation.reducer,
};
