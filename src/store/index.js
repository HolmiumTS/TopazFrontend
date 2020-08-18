import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  //用status表示登录状态:-1为未登录,0为已登录主界面,1为团队界面
  state: JSON.parse(
    sessionStorage.getItem('state') ||
    JSON.stringify({ status: '-1', userId: '', username: '', avatar: '', teamId: '' })
  ),
  mutations: {
    Login(state, value) {
      console.log("Login")
      console.log(value);
      state.status = '0';
      state.userId = value.userId;
      state.username = value.username;
      state.avatar = value.avatar;
      //sessionStorage.removeItem('state');
      sessionStorage.setItem('state', JSON.stringify(state));
    },
    Logout(state) {
      console.log("Logout")
      state.status = '-1';
      state.userId = state.username = state.avatar = '';
      sessionStorage.removeItem('state');
    },
    ChangeStatus(state, status) {
      console.log("ChangeStatus")
      console.log(status);
      state.status = status;
      //sessionStorage.removeItem('state');
      sessionStorage.setItem('state', JSON.stringify(state));
      console.log(state.status);
    },
    ChangeTeamId(state, teamId) {
      console.log("ChangeTeamId")
      console.log(teamId);
      state.teamId = teamId;
      sessionStorage.removeItem('state');
      sessionStorage.setItem('state', JSON.stringify(state));
      console.log(state.teamId);
    },
  },
  actions: {
    commitLogin({ commit }, value) {
      console.log("commitLogin")
      console.log(value);
      commit('Login', value);
    },
    commitLogout({ commit }) {
      console.log("commitLogout")
      commit('Logout');
    },
    commitChangeStatus({ commit }, status) {
      console.log("commitChangeStatus")
      console.log(status);
      commit('ChangeStatus', status);
    },
    commitChangeTeamId({ commit }, teamId) {
      console.log("commitChangeTeamId")
      console.log(teamId);
      commit('ChangeTeamId', teamId);
    },
  },
  modules: {},
});

export default store;
