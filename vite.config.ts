import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{  //配置本地代理
        "/api":{   //匹配的路径
             target: "http://127.0.0.1:8888", //目标url
             changeOrigin: true,  //跨域
             rewrite:(path) => {
              return path.replace(/^\/api/, "")
              }
        }
        
    }
}

})

// zheli