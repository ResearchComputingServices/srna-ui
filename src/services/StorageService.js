import _ from 'lodash';

class StorageService {
    get = () => localStorage

    getSessionId = () => {
        const { $appData } = this.get();
        if (typeof $appData === 'string' && $appData) {
            const parsedData = JSON.parse($appData);
            return _.get(parsedData, 'userSession.sessionId', null);
        }
        return null;
    }
}

const storageService = new StorageService();

Object.freeze(storageService);

export default storageService;

export { StorageService };
