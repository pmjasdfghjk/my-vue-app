import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/less/index.less"
import router from '@/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import "@/api/mock.js"
import api from "@/api/api"
function isRoute(to){
  return router.getRoutes().filter(item=>item.path===to.path).length>0
}
router.beforeEach((to,from)=>{
  if(to.path!=='/login' &&!store.state.token){
    return {name:'login'}
  }
  if(!isRoute(to)){
    console.log('cuole')
    return {name:'404'}
  }
})


const pinia=createPinia()

const app=createApp(App)
app.config.globalProperties.$api=api;
// 通过将 api 添加到全局属性中，你可以在应用中的任何组件中轻松访问它。
// 通过 this.$api 访问 API
app.use(pinia)
const store=useAllDataStore()
import { useAllDataStore } from './stores'
app.use(ElementPlus)
store.addMenu(router,'refresh')
app.use(router).mount('#app')
for(const [key,component] of Object.entries(ElementPlusIconsVue)){
  app.component(key,component);
}
