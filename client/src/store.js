import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'
import defaultSettings from '@/settings'

const { showSettings, fixedHeader, sidebarLogo } = defaultSettings
Vue.use(Vuex)

const types = {
  SET_AUTHENTICATED: "SET_AUTHENTICATED",
  SET_USER: "SET_USER",
  SET_NEWCHART: "SET_NEWCHART",
  SET_FIELD: "SET_FIELD",
  SET_INDEX: 'SET_INDEX',
  SET_RELATIONDATA: 'SET_RELATIONDATA',
  ADD_NODE: "ADD_NDOE",
  ADD_EDGE: "ADD_EDGE",
  DELETE_NODE: "DELETE_NODE",
  DELETE_EDGE: "DELETE_EDGE",
  UPDATE_NODE: "UPDATE_NODE",
  UPDATE_EDGE: "UPDATE_EDGE",
}
const state = {
  isAuthenticated: false,
  user: {},
  newChart: {
    nodes: [],
    links: []
  },
  relationData: [],
  index: 'index',
  field: '',
  sidebar: {
    opened: true,
    withoutAnimation: false
  },
  device: 'desktop',
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  name: 'ck',
  avatar: ''
}
const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user,
  newChart: state => state.newChart,
  relationData: state =>state.relationData,
  index: state => state.index,
  field: state => state.field,
  sidebar: state => state.sidebar,
  device: state => state.device,
  avatar: state => state.avatar,
  name: state => state.name
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
  [types.SET_FIELD](state, field) {
    if (field) state.field = field;
    else state.field = ''
  },
  [types.SET_INDEX](state, index) {
    if (index) state.index = index;
    else state.index = ''
  },
  [types.SET_RELATIONDATA](state, relationData) {
    console.log('set relation data')
    if (relationData) state.relationData = relationData;
    else state.relationData = []
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
    if (info) {
      state.newChart.nodes = state.newChart.nodes.filter(node => {
        return node.id !== info.id;
      });
      state.newChart.links = state.newChart.links.filter(link => {
        return link.source !== info.id && link.target !== info.id;
      });
    }
    else state.nodes = []
  },
  [types.DELETE_EDGE](state, info) {
    if (info) state.newChart.links = state.newChart.links.filter(link => {
      return link.id !== info.id;
    });
    else state.links = [];
  },
  [types.UPDATE_NODE](state, info) {
    if (info) {
      for(let i in state.newChart.nodes){
        if(state.newChart.nodes[i].id === info.id){
          state.newChart.nodes[i] = info;          
        }
      }
    }
    else state.nodes = []
  },
  [types.UPDATE_EDGE](state, info) {
    if (info) {
      for(let i in state.newChart.links){
        if(state.newChart.links[i].id === info.id){
          state.newChart.links[i] = info;          
        }
      }
    }
    else state.links = []
  },
  // 
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
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
  setField: ({commit}, field) => {
    commit(types.SET_FIELD, field)
  },
  setIndex: ({commit}, index) => {
    commit(types.SET_INDEX, index)
  },
  setRelationData: ({commit}, relationData) => {
    commit(types.SET_RELATIONDATA, relationData)
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
  updateNode: ({commit}, info) => {
    commit(types.UPDATE_NODE, info)
  },
  updateLink: ({commit}, info) => {
    commit(types.UPDATE_EDGE, info)
  },
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }

}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions 
})
