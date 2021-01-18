import axios from 'axios';
import _ from 'lodash';

class InterceptorService {
    _mapObject = (object, mapper, options, isSeen = new WeakMap()) => {
        const isObject = value => typeof value === 'object' && value !== null;

        // Customized for this use-case
        const isObjectCustom = value => isObject(value)
                && !(value instanceof RegExp)
                && !(value instanceof Error)
                && !(value instanceof Date);
        options = {
            deep: false,
            target: {},
            ...options,
        };

        if (isSeen.has(object)) {
            return isSeen.get(object);
        }

        isSeen.set(object, options.target);

        const { target } = options;
        delete options.target;

        const mapArray = array => array.map(element => (isObjectCustom(element) ? this._mapObject(element, mapper, options, isSeen) : element));
        if (Array.isArray(object)) {
            return mapArray(object);
        }

        _.each(object, (value, key) => {
            const mappedValues = mapper(key, value, object);
            const newKey = mappedValues[0];
            let newValue = mappedValues[1];

            if (options.deep && isObjectCustom(newValue)) {
                newValue = Array.isArray(newValue)
                    ? mapArray(newValue)
                    : this._mapObject(newValue, mapper, options, isSeen);
            }

            target[newKey] = newValue;
        });

        return target;
    };

    _camelCaseKeys = obj => {
        // Any falsy, which includes `null` whose typeof is `object`.
        if (!obj) {
            return obj;
        }
        // Date, whose typeof is `object` too.
        if (obj instanceof Date) {
            return obj;
        }
        // Array, whose typeof is `object` too.
        if (Array.isArray(obj)) {
            return obj.map(element => this._camelCaseKeys(element));
        }
        // So, if this is still an `object`, we might be interested in it.
        if (typeof obj === 'object') {
            return this._mapObject(obj, (key, value) => {
                const newKey = _.camelCase(key);
                if (key !== newKey && newKey in obj) {
                    throw new Error(`Camel cased key \`${newKey}\` would overwrite existing key of the given JSON object`);
                }
                return [newKey, this._camelCaseKeys(value)];
            });
        }
        // Something else like a String or Number.
        return obj;
    }

    _snakeCaseKeys = obj => {
        // Any falsy, which includes `null` whose typeof is `object`.
        if (!obj) {
            return obj;
        }
        // Date, whose typeof is `object` too.
        if (obj instanceof Date) {
            return obj;
        }
        // Array, whose typeof is `object` too.
        if (Array.isArray(obj)) {
            return obj.map(element => this._snakeCaseKeys(element));
        }
        // So, if this is still an `object`, we might be interested in it.
        if (typeof obj === 'object') {
            return this._mapObject(obj, (key, value) => {
                const newKey = _.snakeCase(key);
                if (key !== newKey && newKey in obj) {
                    throw new Error(`Snake cased key \`${newKey}\` would overwrite existing key of the given JSON object`);
                }
                return [newKey, this._snakeCaseKeys(value)];
            });
        }
        // Something else like a String or Number.
        return obj;
    }

    registerRequestInterceptor = callback => {
        if (_.isNil(callback)) throw new Error('Missing callback');
        axios.interceptors.request.use(request => {
            callback(request);
            return request;
        });
    }

    registerUnauthorizedInterceptor = callback => {
        if (_.isNil(callback)) throw new Error('Missing callback');
        axios.interceptors.response.use(response => response, error => {
            if (error && error.response && error.response.status === 401) {
                return callback();
            }
            return Promise.reject(error);
        });
    }

    registerUnhandledInterceptor = callback => {
        if (_.isNil(callback)) throw new Error('Missing callback');
        axios.interceptors.response.use(response => response, error => {
            if (typeof error.response === 'undefined') {
                callback(error);
            }
            return Promise.reject(error);
        });
    }

    registerDataTransformInterceptor = () => {
        axios.interceptors.request.use(request => {
            if (request.headers['content-type'] !== 'multipart/form-data') {
                request.data = this._snakeCaseKeys(request.data);
            }
            return request;
        });
        axios.interceptors.response.use(response => {
            if (response.headers['content-type'] === 'application/json') {
                response.data = this._camelCaseKeys(response.data);
            }
            return response;
        });
    }
}

const interceptorService = new InterceptorService();

Object.freeze(interceptorService);

export default interceptorService;

export { InterceptorService };
