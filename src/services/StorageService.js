import _ from 'lodash';

class StorageService {
    get = () => {
        try {
            const $appData = localStorage.getItem('$appData');
            if (typeof $appData === 'string' && $appData) {
                return JSON.parse($appData);
            }
            return undefined;
        } catch (err) {
            return undefined;
        }
    }

    getItem = key => _.get(this.get(), key, null)

    set = data => {
        try { localStorage.setItem('$appData', JSON.stringify(data)); } catch (err) {}
    }
}

const storageService = new StorageService();

Object.freeze(storageService);

export default storageService;

export { StorageService };
