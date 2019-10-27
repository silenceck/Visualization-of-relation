import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const types = {
  SET_AUTHENTICATED: "SET_AUTHENTICATED",
  SET_USER: "SET_USER",
  SET_NEWCHART: "SET_NEWCHART",
  ADD_NODE: "ADD_NDOE",
  ADD_EDGE: "ADD_EDGE",
  DELETE_NODE: "DELETE_NODE",
  DELETE_EDGE: "DELETE_EDGE",
}
const state = {
  isAuthenticated: false,
  user: {},
  newChart: {
    nodes: [],
    links: []
  },
}
const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user,
  newChart: state => state.newChart,
}
const mutations = {
  [types.SET_AUTHENTICATED](state, isAuthenticated) {
    if (isAuthenticated) state.isAuthenticated = isAuthenticated;
    else state.isAuthenticated = false;
  },
  [types.SET_USER](state, user) {
    if (user) state.user = user;
    else state.user = {}
  },
  [types.SET_NEWCHART](state, newChart) {
    if (newChart) state.newChart = newChart;
    else state.newChart = {}
  },
  [types.ADD_NODE](state, node) {
    if (node) state.newChart.nodes.push(node);
    else state.nodes = []
  },
  [types.ADD_EDGE](state, link) {
    if (link) state.newChart.links.push(link);
    else state.links = []
  },
  [types.DELETE_NODE](state, info) {
    if (info) state.newChart.nodes = state.newChart.nodes.filter(node => {
      return node.id !== info.id;
    });
    else state.nodes = []
  },
  [types.DELETE_EDGE](state, info) {
    if (info) state.newChart.links = state.newChart.links.filter(link => {
      return link.id !== info.id;
    });
    else state.links = []
  },
}
const actions = {
  setAuthenticated: ({commit}, isAuthenticated) => {
    commit(types.SET_AUTHENTICATED, isAuthenticated)
  },
  setUser: ({commit}, user) => {
    commit(types.SET_USER, user)
  },
  clearCurrentState: ({commit}) => {
    commit(types.SET_AUTHENTICATED, false);
    commit(types.SET_USER, null);
  },
  setNewChart: ({commit}, newChart) => {
    commit(types.SET_NEWCHART, newChart)
  },
  addNode: ({commit}, node) => {
    commit(types.ADD_NODE, node)
  },
  addLink: ({commit}, link) => {
    commit(types.ADD_EDGE, link)
  },
  deleteNode: ({commit}, info) => {
    commit(types.DELETE_NODE, info)
  },
  deleteLink: ({commit}, info) => {
    commit(types.DELETE_EDGE, info)
  },

}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions 
})
