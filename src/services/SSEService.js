import ClientConfig from '../client-configurations';

class SSEService {
    url = (new ClientConfig()).getApi();

    subscribe = (message, callback) => {
        const source = new EventSource(`${this.url}/stream`);
        source.addEventListener(message, callback, false);
    }
}

const sseService = new SSEService();

Object.freeze(sseService);

export default sseService;

export { SSEService };
