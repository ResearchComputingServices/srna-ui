import NotFound from '../components/NotFound';
import ComputationForm from '../components/ComputationForm';

export default [
    {
        path: '/',
        component: ComputationForm,
    },
    {
        path: '*',
        component: NotFound,
    },
];
