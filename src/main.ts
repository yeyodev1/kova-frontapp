import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'
import { initPixel } from './utils/pixel'
import { vReveal } from './directives/reveal'
import { checkVersionNow, isStaleChunkError, startVersionWatch } from './composables/useAppVersion'
import '@/styles/global.scss'

initPixel()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.directive('reveal', vReveal)

const userStore = useUserStore(pinia)

// httpBase emite este evento al recibir un 401: la sesión caducó.
window.addEventListener('auth:token-expired', () => {
  userStore.clear()
  if (router.currentRoute.value.meta.requiresAuth) {
    router.replace({ name: 'Login', query: { next: router.currentRoute.value.fullPath } })
  }
})

// Tras publicar una versión nueva, una página vieja puede pedir archivos que ya no existen:
// se recarga una sola vez hacia la página pedida en vez de quedarse en blanco.
router.onError((error, to) => {
  if (!isStaleChunkError(error)) return
  const key = 'kova_reloaded_for'
  if (sessionStorage.getItem(key) === to.fullPath) return
  sessionStorage.setItem(key, to.fullPath)
  window.location.assign(to.fullPath)
})
router.afterEach(() => checkVersionNow())

app.mount('#app')
startVersionWatch()
