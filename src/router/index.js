import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {guest:true}
  },
  {
    path: '/home',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: HomeView,
    meta: {requiresAuth:true}
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta:{guest:true}
  },
  {
    path: '/company',
    name: 'company',
    component: () => import('../views/Company.vue'),
    meta:{requiresAuth: true}
  },
  {
    path:'/employee',
    name:'employee',
    component:() => import('../views/Employee.vue')
  },
  {
    path:'/logout',
    name:'logout',
    component:() => import('../views/Logout.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
