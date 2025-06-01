import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import '@fortawesome/fontawesome-free/css/all.css'
import './style.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

;(async () => {
  const authStore = useAuthStore()
  await authStore.init()

  app.mount('#app')
})()
