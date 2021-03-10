import NotFound from '../components/NotFound';
import ComputationForm from '../components/ComputationForm';
import ComputationResult from '../components/ComputationResult';
import Computations from '../components/Computations';
import MoreInformation from '../components/MoreInformation';

export default [
    {
        path: '/history',
        component: Computations,
    },
    {
        path: '/',
        component: ComputationForm,
    },
    {
        path: '/computation/:id',
        component: ComputationResult,
    },
    {
        path: '/more-information',
        component: MoreInformation,
    },
    {
        path: '*',
        component: NotFound,
    },
];
