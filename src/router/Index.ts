import * as VueRouter from 'vue-router'
import Home from '@/pages/Home/Index.vue'
import PdfReader from '@/pages/PdfReader/Index.vue'
const routes = [
  { path: '/', component: Home },
  { path: '/pdfReader', component: PdfReader },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})

export { router }