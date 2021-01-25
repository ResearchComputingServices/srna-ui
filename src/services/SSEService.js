import ClientConfig from '../client-configurations';

class SSEService {
    url = (new ClientConfig()).getApi();

    source = typeof EventSource !== 'undefined' ? new EventSource(`${this.url}/stream`) : null;

    subscribe = (message, callback) => this.source && this.source.addEventListener(message, callback, false);

    unsubscribe = message => this.source && this.source.removeEventListener(message);
}

const sseService = new SSEService();

Object.freeze(sseService);

export default sseService;

export { SSEService };
