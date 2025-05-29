import { createRouter, createWebHistory } from 'vue-router'
import Profissional from '../views/Profissional.vue'
import Chat from '../views/Chat.vue'
import Login from '../views/Login.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/profissional'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/profissional',
      name: 'profissional',
      component: Profissional
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  
  // Initialize auth store if not already done
  if (!authStore.user) {
    await authStore.init()
  }

  if (to.meta.requiresAuth && !authStore.user) {
    return { name: 'login' }
  }

  if (to.name === 'login' && authStore.user) {
    return { name: 'chat' }
  }
})

export default router
