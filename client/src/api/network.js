import axios from '../http.js'
const baseUrl = '/api/networks'
export default {
    getFieldNetwork(field) {
        return axios.get(`${baseUrl}/field/${field}`);
    },
    queryNetwork(str) {
        return axios.get(`${baseUrl}/query/?data=${str}`);
    },
    addNetwork(params) {
        return axios.post(`${baseUrl}/`, params);
    },
    getNodename(field) {
        return axios.get(`${baseUrl}/nodename/${field}`);
    },
    getNetworkByUser(id) {
        return axios.get(`${baseUrl}/user/${id}`);
    },
    deleteNetwork(params) {
        return axios.post(`${baseUrl}/delete`, params);
    },
    exportNetwork(field) {
        return axios.get(`${baseUrl}/export/${field}`);
    },
    getAdminNetwork() {
        return axios.get(`${baseUrl}/admin`);
    }

}