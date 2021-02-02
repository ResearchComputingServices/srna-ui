import _ from 'lodash';

class StorageService {
    get = () => {
        const $appData = localStorage.getItem('$appData');
        if (typeof $appData === 'string' && $appData) {
            return JSON.parse($appData);
        }
        return null;
    }

    getItem = key => _.get(this.get(), key, null)

    set = data => localStorage.setItem('$appData', JSON.stringify(data))
}

const storageService = new StorageService();

Object.freeze(storageService);

export default storageService;

export { StorageService };
