import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  //用status表示登录状态:-1为未登录,0为已登录主界面,1为团队界面
  state: {
    // status: '0', // debug
    status: '-1' || JSON.parse(sessionStorage.getItem('state')).status,
    userId: '' || JSON.parse(sessionStorage.getItem('state')).userId,
    username: '' || JSON.parse(sessionStorage.getItem('state')).username,
    avatar: '' || JSON.parse(sessionStorage.getItem('state')).avatar,
    teamId: '' || JSON.parse(sessionStorage.getItem('state')).teamId,
  },
  mutations: {
    Login(state, value) {
      console.log(value);
      state.status = '0';
      state.userId = value.userId;
      state.username = value.username;
      state.avatar = value.avatar;
      sessionStorage.setItem("state", JSON.stringify(state));
    },
    Logout(state) {
      state.status = '-1';
      state.userId = state.username = state.avatar = '';
      sessionStorage.removeItem("state");
    },
    ChangeStatus(state, status) {
      console.log(status);
      state.status = status;
      sessionStorage.setItem("state", JSON.stringify(state));
      console.log(state.status);
    },
    ChangeTeamId(state, teamId) {
      console.log(teamId);
      state.teamId = teamId;
      sessionStorage.setItem("state", JSON.stringify(state));
      console.log(state.teamId);
    },
  },
  actions: {
    commitLogin({ commit }, value) {
      console.log(value);
      commit('Login', value);
    },
    commitLogout({ commit }) {
      commit('Logout');
    },
    commitChangeStatus({ commit }, status) {
      console.log(status);
      commit('ChangeStatus', status);
    },
    commitChangeTeamId({ commit }, teamId) {
      console.log(teamId);
      commit('ChangeTeamId', teamId);
    },
  },
  modules: {},
});

export default store;
