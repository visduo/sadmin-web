import { createRouter, createWebHistory } from 'vue-router'
import {ElMessage} from "element-plus";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            // 根路径跳转到登录路由
            path: '',
            redirect: '/login'
        },
        {
            // 登录
            path: '/login',
            component: () => import('@/views/Login.vue'),
        },
        {
            // 后台
            path: '/admin',
            component: () => import('@/views/Layout.vue'),
            // 使用嵌套路由
            // 嵌套路由的component会渲染到父路由的router-view中
            children: [
                {
                    // 后台首页
                    path: 'index',  // 子路由路径前不能加/号，访问路径为父路由路径+/子路由路径
                    component: () => import('@/views/Index.vue'),
                }
            ]
        },
    ],
})

router.beforeEach((to, from, next) => {
    let authtoken = localStorage.getItem("authtoken")
    // 通过to.path获取访问的路由地址，并进行判断
    if(to.path === '/login' && authtoken) {
        // 如果Token存在且访问了登录路由，跳转到首页页面
        ElMessage.success('欢迎回来')
        next({path: '/admin/index'})
    } else if(to.path === '/login') {
        // 跳过登录路由
        next()
    } else if(!authtoken) {
        // 如果Token不存在，即未登录，跳转到登录页面
        ElMessage.error('请先登录')
        next({path: '/login'})
    }

    // 其他正常情况，继续访问
    next()
})

export default router
