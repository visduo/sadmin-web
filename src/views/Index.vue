<script setup>
import { ref } from 'vue'
import {ElMessage} from "element-plus";
import router from "@/router/index.js";
import {storeToRefs} from "pinia";
import {useCurrentUserStore} from "@/stores/currentUser.js";
// 模拟菜单数据
const menuData = ref([
    {
        id: 1,
        title: '系统管理',
        children: [
            {
                id: 11,
                title: '用户管理',
                path: '/user'
            },
            {
                id: 12,
                title: '角色管理',
                path: '/role'
            },
            {
                id: 13,
                title: '菜单管理',
                path: '/menu'
            }
        ]
    },
    {
        id: 2,
        title: '业务管理',
        children: [
            {
                id: 21,
                title: '订单管理',
                path: '/order'
            },
            {
                id: 22,
                title: '产品管理',
                path: '/product'
            }
        ]
    },
    {
        id: 3,
        title: '数据统计',
        children: [
            {
                id: 31,
                title: '销售统计',
                path: '/sales'
            },
            {
                id: 32,
                title: '用户统计',
                path: '/user-statistics'
            }
        ]
    }
])

// 发送请求，获取登录用户信息实体
axios.get('/passport/currentUser', {
    // 发送请求时，添加请求头Header，传递Token
    headers: {
        'authtoken': localStorage.getItem('authtoken')
    }
}).then((res) => {
    if (res.data.code === 200) {
        // 将登录用户信息实体存储到数据仓库中
        useCurrentUserStore().setCurrentUser(res.data.data)
    } else {
        ElMessage.error(res.data.message)
    }
}).catch((error) => {
    ElMessage.error(error.message)
})
</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单栏 -->
        <el-aside width="200px">
            <el-menu default-active="1" class="el-menu-vertical" :router="true" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                <el-menu-item index="0" disabled>
                    <span>后台管理系统</span>
                </el-menu-item>

                <template v-for="item in menuData" :key="item.id">
                    <el-sub-menu v-if="item.children && item.children.length > 0" :index="String(item.id)">
                        <template #title>
                            <span>{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="child in item.children" :key="child.id" :index="String(child.id)">
                            {{ child.title }}
                        </el-menu-item>
                    </el-sub-menu>

                    <el-menu-item v-else :index="String(item.id)">
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </el-menu>
        </el-aside>

        <!-- 右侧内容区 -->
        <el-container>
            <!-- 顶部导航栏 -->
            <el-header class="layout-header">
                <div class="header-right">
                    <el-dropdown>
                        <template #default>
                            欢迎您，{{ useCurrentUserStore().currentUser.realname }}
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </template>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>修改信息</el-dropdown-item>
                                <el-dropdown-item>修改密码</el-dropdown-item>
                                <el-dropdown-item>登录日志</el-dropdown-item>
                                <el-dropdown-item>操作日志</el-dropdown-item>
                                <el-dropdown-item>注销</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </el-header>

            <!-- 主要内容区 -->
            <el-main class="layout-main">
                <div class="welcome-container">
                    <h2>欢迎您，{{ useCurrentUserStore().currentUser.realname }}！</h2>
                    <p>祝您工作愉快！</p>
                </div>
            </el-main>

            <!-- 底部版权信息 -->
            <el-footer class="layout-footer">
                <div class="footer-content">
                    <p>© 2025 后台管理系统. All Rights Reserved.</p>
                </div>
            </el-footer>
        </el-container>
    </el-container>
</template>

<style scoped>
.layout-container {
    height: 100vh;
}

.el-aside {
    background-color: #545c64;
}

.el-menu-vertical {
    height: 100%;
    border: none;
}

.layout-header {
    background-color: #ffffff;
    color: #333;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
}

.header-right {
    display: flex;
    align-items: center;
}

.el-dropdown-link {
    cursor: pointer;
    color: #333;
    display: flex;
    align-items: center;
}

.layout-main {
    background-color: #f5f7fa;
    padding: 20px;
}

.welcome-container {
    background-color: #ffffff;
    padding: 40px;
    border-radius: 4px;
    text-align: center;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.layout-footer {
    background-color: #ffffff;
    color: #666;
    text-align: center;
    padding: 20px;
    border-top: 1px solid #ebeef5;
}

.footer-content p {
    margin: 0;
}
</style>
