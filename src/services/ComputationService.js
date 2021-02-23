import axios from 'axios';
import { snakeCase } from 'lodash';
import ClientConfig from '../client-configurations';

class ComputationService {
    url = (new ClientConfig()).getApi();

    compute = async data => {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(snakeCase(key), data[key]));
        const config = { headers: { 'content-type': 'multipart/form-data' } };
        return axios.post(`${this.url}/compute_srnas`, formData, config).then(res => res.data);
    }

    status = taskId => axios.get(`${this.url}/get_task_status`, { params: { task_id: taskId } }).then(res => res.data);

    statuses = taskIds => axios.post(`${this.url}/get_tasks_status`, { tasks: taskIds }).then(res => res.data);

    outputFile = taskId => axios.get(`${this.url}/get_output_file`, {
        params: { task_id: taskId },
        responseType: 'blob',
    }).then(res => res.data);

    sessionEpoch = () => axios.get(`${this.url}/session_epoch`).then(res => res.data);

    queueLoad = () => axios.get(`${this.url}/queue_load`);
}

const computationService = new ComputationService();

Object.freeze(computationService);

export default computationService;

export { ComputationService };
