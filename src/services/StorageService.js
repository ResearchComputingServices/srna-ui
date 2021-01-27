class StorageService {
    get = () => localStorage
}

const storageService = new StorageService();

Object.freeze(storageService);

export default storageService;

export { StorageService };
