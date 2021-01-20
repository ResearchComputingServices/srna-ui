class StorageService {
    get = () => sessionStorage
}

const storageService = new StorageService();

Object.freeze(storageService);

export default storageService;

export { StorageService };
