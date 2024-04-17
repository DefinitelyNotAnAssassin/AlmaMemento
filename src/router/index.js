import { createRouter, createWebHistory } from 'vue-router'
import Home from '../App.vue'
import adminDashboard from '../views/admin.vue'
import Login from '../views/login.vue'
import alumniDashboard from '../views/alumni.vue'

const routes = [
  { path: '/', component: Home,  name: 'home' },
  { path: '/adminDashboard', component: adminDashboard, name: 'adminDashboard' },
  { path: '/login', component: Login,  name: 'login' },
  { path: '/alumniDashboard', component: alumniDashboard, name: 'alumniDashboard' },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router