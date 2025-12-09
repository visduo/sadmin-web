import { createRouter, createWebHistory } from 'vue-router'
import {ElMessage} from "element-plus";
import {loadPermsRoutes} from "@/plugins/PermsUtil.js";

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
        // 移除原有的后台路由，改为动态加载
        // 登录路由为公共路由，不需要权限
    ],
})

// 前置守卫
router.beforeEach(async (to, from, next) => {
    let authtoken = localStorage.getItem("authtoken")
    // 通过to.path获取访问的路由地址，并进行判断
    if (to.path === '/login' && authtoken) {
        // 如果Token存在且访问了登录路由，跳转到首页页面
        ElMessage.success('欢迎回来')
        next({path: '/admin/index'})
    } else if (to.path === '/login') {
        // 先移除原有的admin路由
        router.removeRoute('admin')

        // 跳过登录路由
        next()
    } else if (!authtoken) {
        // 如果Token不存在，即未登录，跳转到登录页面
        ElMessage.error('请先登录')
        next({path: '/login'})
    }

    // Token存在且未加载过动态路由，先加载动态路由
    if (authtoken && !router.hasRoute('admin')) {
        await loadPermsRoutes()
        // 重新触发守卫，避免首次跳转动态路由404
        next({ ...to, replace: true })
    }

    // 其他正常情况，继续访问
    next()
})

export default router
