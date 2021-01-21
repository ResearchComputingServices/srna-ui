import axios from 'axios';
import { snakeCase } from 'lodash';
import ClientConfig from '../client-configurations';

class ComputationService {
    url = (new ClientConfig()).getApi();

    compute = data => {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(snakeCase(key), data[key]));
        const config = { headers: { 'content-type': 'multipart/form-data' } };
        return axios.post(`${this.url}/compute_srnas`, formData, config);
    }

    result = () => axios.get(`${this.url}/get_output_file`);
}

const computationService = new ComputationService();

Object.freeze(computationService);

export default computationService;

export { ComputationService };
