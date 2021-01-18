import axios from 'axios';
import _ from 'lodash';
import ClientConfig from '../client-configurations';

export default class RestService {
    prefix = (new ClientConfig()).getApi();

    getUrl = () => this.prefix;

    _transform = (data, transformers = []) => {
        const transform = _.flow(transformers);
        return transform(data);
    }

    _processRequest = (data, options) => this._transform(data, options.requestTransformers)

    _processResponse = (res, options) => {
        let { data } = res;
        if (options.single) {
            [data] = data;
        }
        return this._transform(data, options.responseTransformers);
    }

    _buildQuery = query => {
        let url = this.prefix;
        if (_.has(query, 'url')) {
            url = query.url;
        }
        let filterQuery = '?';
        let index = -1;
        if (_.has(query, 'null')) {
            filterQuery = `/${query.null}?`;
        }
        delete query.url;
        _.each(query, (value, key) => {
            if (_.isNil(key) || _.eq(key, 'null')) return;
            if (!_.eq(++index, 0)) {
                filterQuery += '&';
            }
            if (_.isArray(value)) {
                filterQuery += `${key}=${value.toString()}`;
            } else {
                filterQuery += `${key}=${value}`;
            }
        });
        return _.eq(filterQuery, '?') ? url : `${url}${filterQuery}`;
    }

    _get = (query, options = {}) => axios
        .get(this._buildQuery({ ...query }))
        .then(data => this._processResponse(data, options))

    _add = (data, options = {}) => axios
        .post(this.prefix, this._processRequest(data, options))
        .then(data => this._processResponse(data, options));

    _update = (data, options = {}) => axios
        .put(`${this.prefix}${!_.isNil(options.id) ? `/${options.id}` : ''}`, this._processRequest(data, options))
        .then(data => this._processResponse(data, options));

    _remove = (data, options = {}) => axios
        .delete(`${this.prefix}${!_.isNil(options.id) ? `/${options.id}` : ''}`, { data: this._processRequest(data, options) })
        .then(data => this._processResponse(data, options));

    _count = (query = {}, options = {}) => axios
        .get(this._buildQuery({
            ...query,
            url: `${this.prefix}/count`,
        }))
        .then(data => this._processResponse(data, options))

    _export = (id, options = {}) => {
        let url = `${this.prefix}/export`;
        url = !_.isNil(id) ? `${url}?id=${id}` : url;
        const query = _.get(options, 'query');
        const config = {
            responseType: 'arraybuffer',
            headers: { 'Content-Type': 'blob' },
        };
        if (!_.isNil(query) && !_.isEmpty(query) && _.isObject(query)) {
            config.params = query;
        }
        return axios
            .get(url, config)
            .then(data => this._processResponse(data, options));
    }

    _import = (data, options = {}) => {
        const formData = new FormData();
        formData.append('file', data.file[0]);
        formData.append('name', data.name);
        const config = {
            headers: { 'content-type': 'multipart/form-data' },
            responseType: 'arraybuffer',
        };
        return axios
            .post(`${this.prefix}/upload`, formData, config)
            .then(data => this._processResponse(data, options));
    }
}
