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
    type: '-1',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: '注册',
    type: '-1',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/home',
    name: '主界面',
    component: () => import('../views/Home.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
