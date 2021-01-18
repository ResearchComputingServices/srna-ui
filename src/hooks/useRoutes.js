import * as routes from '../config/routes';

export default function useRoutes(route) {
    return routes[route];
}
