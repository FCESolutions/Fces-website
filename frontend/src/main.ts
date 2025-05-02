import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@mdi/font/css/materialdesignicons.min.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Toast, { POSITION } from "vue-toastification"
import "vue-toastification/dist/index.css"

AOS.init()

const app = createApp(App)
app.use(router)
// Add Pinia as a plugin
app.use(createPinia())
app.mount('#app')

app.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 3000
})