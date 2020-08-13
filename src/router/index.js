import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: '注册',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/recyclebin',
    name: '回收站',
    component: () => import('../views/Recyclebin.vue')
  },
  {
    path: '/userInfo',
    name: '用户信息',
    component: () => import('../views/UserInfo.vue')
  },
  {
    path: '/docBrowse',
    name: '文档查看',
    component: () => import('../views/DocBrowse.vue')
  },
  {
    path: '/docEdit',
    name: '文档编辑',
    component: () => import('../views/DocEdit.vue')
  },
  {
    path: '/home',
    name: '主界面',
    redirect: '/home/recentFile',
    component: () => import('../views/Home.vue'),
    hasChild: true,
    children: [
      {
        path: '/home/recentFile',
        name: '最近浏览的文档',
        component: () => import('../views/home/RecentFile.vue'),
      },
      {
        path: '/home/collectedFile',
        name: '收藏的文档',
        component: () => import('../views/home/CollectedFile.vue'),
      },
      {
        path: '/home/myFile',
        name: '我创建的文档',
        component: () => import('../views/home/MyFile.vue'),
      },
    ]
  },
  {
    path: '/team',
    name: '团队',
    redirect: '/team/doc',
    component: () => import('../views/Team.vue'),
    hasChild: true,
    children: [
      {
        path: '/team/doc',
        name: '团队文档',
        component: () => import('../views/team/TeamDoc.vue'),
      },
      {
        path: '/team/member',
        name: '团队成员',
        component: () => import('../views/team/TeamMember.vue'),
      },
      {
        path: '/team/info',
        name: '团队信息',
        component: () => import('../views/team/TeamInfo.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
