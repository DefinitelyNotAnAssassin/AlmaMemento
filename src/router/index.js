import { createRouter, createWebHistory } from 'vue-router'
import Home from '../App.vue'
import Dashboard from '../views/admin.vue'
import Login from '../views/login.vue'

const routes = [
  { path: '/', component: Home,  name: 'home' },
  { path: '/dashboard', component: Dashboard, name: 'dashboard' },
  { path: '/login', component: Login,  name: 'login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router