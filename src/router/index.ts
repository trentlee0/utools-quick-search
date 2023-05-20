import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/info/categories/:categoryId/items/:itemId?',
    name: 'Info',
    component: () => import('@/views/Info.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
