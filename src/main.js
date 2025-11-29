import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 完整引入ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

// 引入Axios
import axios from '@/plugins/axios.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 安装ElementPlus
app.use(ElementPlus)

// 安装Axios
app.use(axios)

app.mount('#app')
