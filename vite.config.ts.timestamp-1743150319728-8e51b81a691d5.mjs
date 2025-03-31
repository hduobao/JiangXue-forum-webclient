// vite.config.ts
import { defineConfig } from "file:///F:/FrontendProject/JiangXue-forum-webclient/node_modules/.pnpm/vite@5.4.2_@types+node@22.5.1/node_modules/vite/dist/node/index.js";
import react from "file:///F:/FrontendProject/JiangXue-forum-webclient/node_modules/.pnpm/@vitejs+plugin-react@4.3.1_vite@5.4.2_@types+node@22.5.1_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///F:/FrontendProject/JiangXue-forum-webclient/node_modules/.pnpm/vite-plugin-svgr@4.2.0_roll_8ab48fe71bcebf2b696efcf1d7270d3e/node_modules/vite-plugin-svgr/dist/index.js";
import path from "path";
import tailwindcss from "file:///F:/FrontendProject/JiangXue-forum-webclient/node_modules/.pnpm/tailwindcss@3.4.10/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///F:/FrontendProject/JiangXue-forum-webclient/node_modules/.pnpm/autoprefixer@10.4.20_postcss@8.4.44/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_dirname = "F:\\FrontendProject\\JiangXue-forum-webclient";
var vite_config_default = defineConfig({
  plugins: [react(), svgr()],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    },
    extensions: [".ts", ".js", ".tsx", ".json"]
  },
  server: {
    proxy: {
      //配置本地代理
      "/api": {
        //匹配的路径
        target: "http://127.0.0.1:8888",
        //目标url
        changeOrigin: true,
        //跨域
        rewrite: (path2) => {
          return path2.replace(/^\/api/, "");
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxGcm9udGVuZFByb2plY3RcXFxcSmlhbmdYdWUtZm9ydW0td2ViY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFxGcm9udGVuZFByb2plY3RcXFxcSmlhbmdYdWUtZm9ydW0td2ViY2xpZW50XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi9Gcm9udGVuZFByb2plY3QvSmlhbmdYdWUtZm9ydW0td2ViY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgc3ZnciBmcm9tICd2aXRlLXBsdWdpbi1zdmdyJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICBcInRhaWx3aW5kY3NzXCJcclxuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tIFwiYXV0b3ByZWZpeGVyXCJcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCksIHN2Z3IoKV0sXHJcbiAgY3NzOiB7XHJcbiAgICBwb3N0Y3NzOiB7XHJcbiAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICB0YWlsd2luZGNzcywgXHJcbiAgICAgICAgYXV0b3ByZWZpeGVyLFxyXG4gICAgICBdXHJcbiAgICB9XHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcclxuICAgIH0sXHJcbiAgICBleHRlbnNpb25zOltcIi50c1wiLFwiLmpzXCIsXCIudHN4XCIsXCIuanNvblwiXVxyXG4gIH0sXHJcbiAgc2VydmVyOntcclxuICAgIHByb3h5OnsgIC8vXHU5MTREXHU3RjZFXHU2NzJDXHU1NzMwXHU0RUUzXHU3NDA2XHJcbiAgICAgICAgXCIvYXBpXCI6eyAgIC8vXHU1MzM5XHU5MTREXHU3Njg0XHU4REVGXHU1Rjg0XHJcbiAgICAgICAgICAgICB0YXJnZXQ6IFwiaHR0cDovLzEyNy4wLjAuMTo4ODg4XCIsIC8vXHU3NkVFXHU2ODA3dXJsXHJcbiAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsICAvL1x1OERFOFx1NTdERlxyXG4gICAgICAgICAgICAgcmV3cml0ZToocGF0aCkgPT4ge1xyXG4gICAgICAgICAgICAgIHJldHVybiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCBcIlwiKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VCxTQUFTLG9CQUFvQjtBQUN0VixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGlCQUFrQjtBQUN6QixPQUFPLGtCQUFrQjtBQUx6QixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUFBLEVBQ3pCLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ3BDO0FBQUEsSUFDQSxZQUFXLENBQUMsT0FBTSxPQUFNLFFBQU8sT0FBTztBQUFBLEVBQ3hDO0FBQUEsRUFDQSxRQUFPO0FBQUEsSUFDTCxPQUFNO0FBQUE7QUFBQSxNQUNGLFFBQU87QUFBQTtBQUFBLFFBQ0YsUUFBUTtBQUFBO0FBQUEsUUFDUixjQUFjO0FBQUE7QUFBQSxRQUNkLFNBQVEsQ0FBQ0EsVUFBUztBQUNqQixpQkFBT0EsTUFBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLFFBQ2hDO0FBQUEsTUFDTjtBQUFBLElBRUo7QUFBQSxFQUNKO0FBRUEsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
