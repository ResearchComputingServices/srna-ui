import ClientConfig from '../client-configurations';

class SSEService {
    url = (new ClientConfig()).getApi();

    source = new EventSource(`${this.url}/stream`);

    subscribe = (message, callback) => this.source.addEventListener(message, callback, false);

    unsubscribe = message => this.source.removeEventListener(message);
}

const sseService = new SSEService();

Object.freeze(sseService);

export default sseService;

export { SSEService };
