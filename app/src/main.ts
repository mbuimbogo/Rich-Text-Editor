import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// --- 1. Add Vuetify and icon imports ---
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// --- 2. Create the Vuetify instance ---
const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

// --- 3. Chain all .use() calls together ---
app.use(createPinia())
app.use(router)
app.use(vuetify) // Add Vuetify to your app

app.mount('#app')