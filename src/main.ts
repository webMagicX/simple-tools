import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
const app = createApp(App)
const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/:error*', component: App }]
})
app.use(router)
app.mount('#app')
