import {
    NotFound,
    Computation,
} from '../components';

export default [
    {
        path: '/',
        component: Computation,
    },
    {
        path: '*',
        component: NotFound,
    },
];
