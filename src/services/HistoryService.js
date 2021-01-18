import { createBrowserHistory } from 'history';
import _ from 'lodash';

class HistoryService {
    routes = [];

    history = createBrowserHistory()

    constructor() {
        this.history.listen(location => {
            this.routes.push(location);
            localStorage.setItem('$lastVisitedRoute', location.pathname);
        });
    }

    getRoutes = () => this.routes;

    getHistory = () => this.history;

    getUrl = () => _.get(this, 'history.location.pathname');

    getUrlFragments = () => _.compact(this.getUrl().split('/'));

    go = route => this.history.push(route);

    goBack = () => {
        this.history.goBack();
        return this.routes.pop();
    }

    routesLength = () => this.routes.length;

    size = () => this.history.length;
}

const historyService = new HistoryService();

Object.freeze(historyService);

export default historyService;

export { HistoryService };
