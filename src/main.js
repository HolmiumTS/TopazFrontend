import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

Vue.config.productionTip = false;

Vue.prototype.$http = axios;

//后端地址
axios.defaults.baseURL = 'http://localhost:18888';
axios.defaults.timeout = 5000;
//UTF-8编码的json格式
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

Vue.use(ElementUI);

// 待定
export const generateUserUrl = (id) => {
  return 'http://60.205.189.66/user/' + id;
};

Vue.use(mavonEditor);
/*
接口日志:
  8月11日:
    新增:
      用户登录,
      用户注册,
      查看个人所在团队,
      查看个人信息,
      修改个人信息,
      修改头像,
      修改密码,
      查看团队信息,
      查看团队成员，
      设置管理员，
      取消管理员，
      获取团队所有申请
  8月12日:
    新增:
      搜索团队
*/

// ! === 个人 === (begin)
export /**
 * 用户登录
 * @param {user, password} params
 * 账号、邮箱或手机,密码
 * @returns {result, id, username, avatar}
 * 登录是否成功,用户id, 昵称, 头像url
 */
  const Login = (params) => {
    return axios.post('/Login', params);
  };

export /**
 * 用户注册
 * @param {tel, email, password, username}
 * 手机, 邮箱, 密码, 昵称
 * @returns {result, id}
 * 注册是否成功,用户id
 */
  const Register = (params) => {
    return axios.post('/Register', params);
  };

export /**
 * 查看个人所在团队
 * @param {id}
 * 用户id
 * @returns {teams[{id, name}]}
 * 团队[{团队id, 团队名称}]
 */
  const GetUserTeam = (params) => {
    return axios.post('/GetUserTeam', params);
  };

export /**
 * 查看个人信息
 * @param {id}
 * 手机, 邮箱, 密码, 昵称
 * @returns {id, username, tel, email, avatar}
 * 用户id, 昵称, 手机, 邮箱, 头像url
 */
  const GetUserInfo = (params) => {
    return axios.post('/GetUserInfo', params);
  };

export /**
 * 修改个人信息
 * @param {id, username, tel, email}
 * 用户id, 昵称, 手机, 邮箱
 * @returns {result}
 * 是否成功
 */
  const ChangeUserInfo = (params) => {
    return axios.post('/ChangeUserInfo', params);
  };

export /**
 * 修改头像
 * @param {id, avatar}
 * 用户id, 头像url
 * @returns {result}
 * 是否成功
 */
  const ChangeUserAvatar = (params) => {
    return axios.post('/ChangeUserAvatar', params);
  };

export /**
 * 修改密码
 * @param {id, oldPassword, newPassword}
 * 用户id, 旧密码, 新密码
 * @returns {result}
 * 是否成功
 */
  const ChangeUserPassword = (params) => {
    return axios.post('/ChangeUserPassword', params);
  };
// ! === 个人 === (end)

// ! === 团队 === (begin)
export /**
 * 查看团队信息
 * @param {teamId}
 * 团队id
 * @returns {result, creatorId, teamName, teamInfo}
 * 是否成功，创建者id，团队名称，团队简介
 */ const GetTeamInfo = (params) => {
    return axios.post('/GetTeamInfo', params);
  };

// TODO: 考虑第二次迭代时换成
// {创建者id, 创建者用户名，创建者头像},
// {管理员id，管理员用户名，管理员头像}[]，
// {成员id，成员用户名，成员头像}[]
// 的形式

export /**
 * 搜索团队
 * @param {id,keyword}
 * 用户Id,团队Id或团队名称
 * @returns {teams[{id,name,info}]}
 * [{团队Id, 团队名称, 团队简介}]
 * 用户已经加入的和正在申请的不用返回
 */ const SearchTeams = (params) => {
    return axios.post('/SearchTeams', params);
  };

export /**
 * 申请加入团队
 * @param {userId,teamId}
 * 用户Id,团队Id
 * @returns {result}
 * 申请提交是否成功
 */ const ApplyToTeam = (params) => {
    return axios.post('/ApplyToTeam', params);
  };

export /**
 * 查看团队成员
 * @param {teamId}
 * 团队id
 * @returns {result, creatorId, adminId[], memberId[]}
 * 是否成功，创建者id，管理员id[]，成员id[]
 */ const GetTeamMember = (params) => {
    return axios.post('/GetTeamMember', params);
  };

export /**
 * 设置管理员
 * @param {teamId, id}
 * 团队id，管理员id
 * @returns {result}
 * 是否成功
 */ const SetAdmin = (params) => {
    return axios.post('/SetAdmin', params);
  };

export /**
 * 取消管理员
 * @param {teamId, id}
 * 团队id，管理员id
 * @returns {result}
 * 是否成功
 */ const CancelAdmin = (params) => {
    return axios.post('/CancelAdmin', params);
  };

export /**
 * 获取团队所有申请
 * @param {teamId}
 * 团队id
 * @returns {result, application}
 * 其中 application 为 {id, username, avatar}[] 数组
 * 是否成功，{申请人id，申请人用户名，申请人头像}的数组
 */ const GetAllApplication = (params) => {
    return axios.post('/GetAllApplication', params);
  };

export /**
 * 审核加入团队申请
 * @param {teamId, id, isAccept}
 * 团队id, 用户id，是否同意（字符串形式的 true OR false）
 * @returns {result}
 * 是否成功
 */ const JudgeApplication = (params) => {
    return axios.post('/JudgeApplication', params);
  };

// ! === 团队 === (end)

//todo: 导航守卫

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
