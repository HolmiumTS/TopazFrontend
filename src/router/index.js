import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
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
    path: '/home',
    name: '主界面',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/workbench',
    name: '工作台',
    component: () => import('../views/Workbench.vue')
  },
  {
    path: '/teamspace',
    name: '团队空间',
    component: () => import('../views/Teamspace.vue')
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
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
