import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 完整引入ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

// 引入Axios
import axios from '@/plugins/axios.js'

// 引入ElementPlus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 批量注册ElementPlus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(createPinia())
app.use(router)

// 安装ElementPlus
app.use(ElementPlus)

// 安装Axios
app.use(axios)

app.mount('#app')
