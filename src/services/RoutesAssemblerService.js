import React from 'react';
import _ from 'lodash';
import { Route, Redirect } from 'react-router-dom';
import historyService from './HistoryService';

class RoutesAssemblerService {
    assemble(routes) {
        const routeComponents = [];
        _.each(routes, route => {
            const {
                path,
                component,
                redirect,
                conditional,
                exact,
            } = route;
            const isExact = _.isBoolean(exact) ? exact : true;
            if (_.isFunction(conditional)) {
                routeComponents.push(<Route
                    key={path}
                    component={conditional({ historyService })}
                    exact={isExact}
                    path={path}
                />);
                return true;
            }
            if (!_.isNil(redirect)) {
                routeComponents.push(<Redirect
                    key={path}
                    exact={isExact}
                    to={redirect}
                />);
            } else {
                routeComponents.push(<Route
                    key={path}
                    component={component}
                    exact={isExact}
                    path={path}
                />);
            }
        });
        return routeComponents;
    }
}

const routesAssemblerService = new RoutesAssemblerService();

Object.freeze(routesAssemblerService);

export default routesAssemblerService;

export { RoutesAssemblerService };
