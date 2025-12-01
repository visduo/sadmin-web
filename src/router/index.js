import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            // 登录
            path: '/login',
            component: () => import('@/views/Login.vue'),
        },
        {
            // 后台
            path: '/admin',
            // 使用嵌套路由
            children: [
                {
                    // 后台首页
                    path: 'index',
                    component: () => import('@/views/Index.vue'),
                }
            ]
        },
    ],
})

export default router
