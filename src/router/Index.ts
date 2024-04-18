import * as VueRouter from 'vue-router'
import Home from '@/pages/Home.vue'
import PdfReader from '@/pages/PdfReader.vue'
const routes = [
  { 
    path: '/home',
    component: Home, 
  },
  {
    path: '/',
    redirect: '/home',
  },
  { 
    path: '/pdfReader',
    component: PdfReader 
  },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})

export { router }