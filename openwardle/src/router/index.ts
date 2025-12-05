import HomePage from '@/pages/Home.page.vue'
import GamePage from '@/pages/Game.page.vue'
import SnakePage from '@/pages/Snake.page.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {path: '/', component: HomePage},
    {path: '/play/:mode', component: GamePage},
    {path: '/snake', component: SnakePage}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
