import MainPage from '@/pages/Main.page.vue'
import SnakePage from '@/pages/Snake.page.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {path: '/', component: MainPage},
    {path: '/snake', component: SnakePage}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
