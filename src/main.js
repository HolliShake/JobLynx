/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import { abilitiesPlugin } from '@casl/vue'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import ability from './plugins/casl/ability'

loadFonts()


// Create vue app
const app = createApp(App)
const piniaState = createPinia()


watch(piniaState.state, state => {
  // persist the whole state to the local storage whenever it changes
  localStorage.setItem('piniaState', JSON.stringify(state))
}, { deep: true })

// Use plugins
app.use(vuetify)
app.use(piniaState)
app.use(router)
app.use(layoutsPlugin)
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
})
app.use(Vue3Toastify, {
  autoClose: 3000,
})

// Mount vue app
app.mount('#app')
