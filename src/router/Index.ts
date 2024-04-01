import * as VueRouter from 'vue-router'
import Home from '@/pages/Home/Index.vue'
import PdfReader from '@/pages/PdfReader/Index.vue'
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