import userSession from './userSession';
import theme from './theme';

export const actions = {
    userSession: userSession.actions,
    theme: theme.actions,
};

export const reducers = {
    userSession: userSession.reducer,
    theme: theme.reducer,
};
