import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import {createRouter,createWebHashHistory} from 'vue-router'


// 指定路由规则

const routes =[
  {
    path:'/',
    name:'main',
    component:()=>import('@/views/Main.vue'),
    redirect:'/home',
    children:[]
  },
  {
    path:'/login',
    name:'login',
    component:()=>import('@/views/Login.vue')
  },
  {
    path:'/404',
    name:'404',
    component:()=>import('@/views/404.vue')
  },
  {
    path:'/password',
    name:'password',
    component:()=>import('@/views/password.vue')
  }
]

const router = createRouter({
  history:createWebHashHistory(),
  routes,
})


export default router;