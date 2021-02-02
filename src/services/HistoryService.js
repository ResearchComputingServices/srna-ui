import { createBrowserHistory } from 'history';
import _ from 'lodash';

class HistoryService {
    routes = [];

    history = createBrowserHistory()

    constructor() {
        this.history.listen(location => {
            this.routes.push(location);
        });
    }

    getRoutes = () => this.routes;

    getHistory = () => this.history;

    getUrl = () => _.get(this, 'history.location.pathname');

    getUrlFragments = () => _.compact(this.getUrl().split('/'));

    go = route => this.history.push(route);

    replace = route => this.history.replace(route);

    goBack = () => {
        this.history.goBack();
        return this.routes.pop();
    }

    reload = () => this.history.go(0);

    routesLength = () => this.routes.length;

    size = () => this.history.length;
}

const historyService = new HistoryService();

Object.freeze(historyService);

export default historyService;

export { HistoryService };
