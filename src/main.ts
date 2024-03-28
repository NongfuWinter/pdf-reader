import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import 'bootstrap-icons/font/bootstrap-icons.css'



const app = createApp(App)
app.use(createPinia())
app.mount('#app')
