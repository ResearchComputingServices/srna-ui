import NotFound from '../components/NotFound';
import Computation from '../components/Computation';

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
