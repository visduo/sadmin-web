import router from '@/router/index.js';
import {useCurrentUserStore} from "@/stores/currentUser.js";
import {toTreeList} from "@/plugins/TreeUtil.js";

/**
 * 将扁平权限数组转换为路由规则
 * @param {Array} flatPerms 扁平权限数组
 * @returns {Array} 路由规则数组
 */
export function permsToRoutes(flatPerms) {
    const routes = [];

    // 直接遍历扁平权限数组，只处理菜单类型（type=1）的权限
    // 目录、操作类型一般不需要处理，因为目录、操作类型的权限没有路由路径和路由组件
    flatPerms.forEach(perm => {
        // 只处理菜单类型的权限（type=1）
        if (perm.type === 1) {
            const route = {};

            // 设置路由路径
            if (perm.path) {
                route.path = perm.path;
            }

            // 设置组件
            if (perm.component) {
                // 动态导入组件
                route.component = () => import(`@/views/${perm.component}.vue`);
            }

            // 只有当路径和组件都存在时才添加路由
            if (route.path && route.component) {
                routes.push(route);
            }
        }
    });

    return routes;
}

/**
 * 动态添加路由
 * 请求 /passport/currentPerms 得到扁平结构的权限列表，调用 permsToRoutes 方法将其转换为路由规则
 */
export async function loadPermsRoutes() {
    // 请求获取扁平结构的权限列表
    const response = await axios.get('/passport/currentPerms');

    // 将扁平权限结构转换为路由规则
    const routes = permsToRoutes(response.data);

    // 将用户权限菜单存储到仓库中
    useCurrentUserStore().setCurrentMenu(toTreeList(response.data, false))

    // 先移除原有的admin路由
    router.removeRoute('admin')

    // 添加新的 admin 路由
    router.addRoute({
        path: '/admin',
        name: 'admin',
        component: () => import('@/views/Layouts.vue'),
        children: [] // 设置空的子路由
    })

    // 动态添加路由到 admin 路由下（添加到 /admin 路由的 children 中）
    routes.forEach(route => {
        router.addRoute('admin', route);
    });
}

export default {
    permsToRoutes,
    loadPermsRoutes
};
