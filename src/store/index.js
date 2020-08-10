import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  //用status表示登录状态:-1为未登录,0为已登录
  state: {
    status: '-1',
    userId: '',
    username: '',
    avatar: ''
  },
  mutations: {
    Login(state, userId, username, avatar) {
      state.status = '0';
      state.userId = userId;
      state.username = username;
      state.avatar = avatar;
    },
    Logout(state) {
      state.status = '-1';
      state.userId = state.username = state.avatar = '';
    }
  },
  actions: {
    commitLogin({ commit, userId, username, avatar }) {
      commit('Login', userId, username, avatar)
    },
    commitLogout({ commit }) {
      commit('Logout')
    }
  },
  modules: {
  }
})

export default store
