import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 这个是添加的别名，可以将@直接定位到src文件夹
  resolve:{
    alias:[
      {
        find:"@",replacement:"/src",
      }
    ]
  }
})
