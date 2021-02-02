import axios from 'axios';
import ClientConfig from '../client-configurations';

class SessionService {
    url = (new ClientConfig()).getApi();

    clear = () => axios.post(`${this.url}/clear_session`);
}

const sessionService = new SessionService();

Object.freeze(sessionService);

export default sessionService;

export { SessionService };
