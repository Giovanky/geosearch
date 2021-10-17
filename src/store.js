import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    drawer: null,
    user: ''
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    getUser: (state, username) => {
      state.user = username
      router.push('/search')
    }
    
  },
  actions: {
    saveUser: ({commit}, username) => {
      sessionStorage.setItem('user', username)
      commit('getUser', username)
    },
    closeSession: ({commit}) => {
      sessionStorage.removeItem('user')
      router.push('/login')
    }
  },
})
