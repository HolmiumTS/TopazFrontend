import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  //用status表示登录状态:-1为未登录,0为已登录主界面,1为团队界面
  state: {
    // status: '0', // debug
    status: '-1',
    userId: '',
    username: '',
    avatar: '',
    teamId: '',
  },
  mutations: {
    Login(state, value) {
      console.log(value)
      state.status = '0';
      state.userId = value.userId;
      state.username = value.username;
      state.avatar = value.avatar;
    },
    Logout(state) {
      state.status = '-1';
      state.userId = state.username = state.avatar = '';
    },
    ChangeStatus(state, status) {
      console.log(status);
      state.status = status;
      console.log(state.status);
    },
  },
  actions: {
    commitLogin({ commit }, value) {
      console.log(value)
      commit('Login', value);
    },
    commitLogout({ commit }) {
      commit('Logout');
    },
    commitChangeStatus({ commit }, status) {
      console.log(status);
      commit('ChangeStatus', status);
    },
  },
  modules: {},
});

export default store;
