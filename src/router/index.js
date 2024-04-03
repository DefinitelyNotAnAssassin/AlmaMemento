import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: () => import("../App.vue") },
        { path: "/admin-dashboard", component: () => import("../views/admin-dashboard.vue") },
    ],
})

export default router