import axios from '../http.js'
const baseUrl = '/api/users'
export default {
    login(params) {
        return axios.post(`${baseUrl}/login`, params);
    },
    register(params) {
        return axios.post(`${baseUrl}/register`, params);
    },
    getCurrentUser() {
        return axios.get(`${baseUrl}/current`);
    },
    editUserInfo(id, params) {
        return axios.post(`${baseUrl}/edit/${id}`, params);
    }
}