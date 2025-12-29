import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AIAssistantView from '../views/AIAssistantView.vue'
import ChartsView from '../views/ChartsView.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/assistant', name: 'assistant', component: AIAssistantView },
  { path: '/charts', name: 'charts', component: ChartsView },
  { path: '/about', name: 'about', component: AboutView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
