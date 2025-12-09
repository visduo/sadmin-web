<script setup>
import { ref } from 'vue'
import {useCurrentUserStore} from "@/stores/currentUser.js";
import router from "@/router/index.js";
import {toTreeList} from "@/plugins/TreeUtil.js";

// 模拟菜单数据
const menuData = useCurrentUserStore().currentMenu

// 发送请求，获取登录用户信息实体
axios.get('/passport/currentUser').then((res) => {
    useCurrentUserStore().setCurrentUser(res.data)
})

// 注销登录
const logout = () => {
    axios.post('/passport/logout').then((res) => {
        // 登出成功，清空locaoStorage跳转到登录页面
        localStorage.clear()
        router.push('/login')
    })
}
</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单栏 -->
        <el-aside width="200px">
            <!--
                router="true"：启用该模式会在激活导航时以index作为path进行路由跳转
                参考文档：https://element-plus.org/zh-CN/component/menu#menu-attributes
            -->
            <el-menu default-active="1" class="el-menu-vertical" :router="true" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                <el-menu-item index="/admin/index">
                    <span>SAdmin后台管理系统</span>
                </el-menu-item>

                <template v-for="item in menuData" :key="item.id">
                    <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.id">
                        <template #title>
                            <span>{{ item.name }}</span>
                        </template>
                        <!--
                            index注意路径拼接前缀/admin/
                        -->
                        <el-menu-item v-for="child in item.children" :key="child.id" :index="'/admin/' + child.path">
                            {{ child.name }}
                        </el-menu-item>
                    </el-sub-menu>

                    <el-menu-item v-else :index="'/admin/' + item.path">
                        <template #title>{{ item.name }}</template>
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
                        <div class="el-dropdown-link">
                            欢迎您，{{ useCurrentUserStore().currentUser.realname }}
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>修改信息</el-dropdown-item>
                                <el-dropdown-item>修改密码</el-dropdown-item>
                                <el-dropdown-item>登录日志</el-dropdown-item>
                                <el-dropdown-item>操作日志</el-dropdown-item>
                                <el-dropdown-item @click="logout">注销</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </el-header>

            <!-- 主要内容区 -->
            <router-view/>

            <!-- 底部版权信息 -->
            <el-footer class="layout-footer">
                <div class="footer-content">
                    <p>© 2025 后台管理系统. All Rights Reserved.</p>
                </div>
            </el-footer>
        </el-container>
    </el-container>
</template>

<style>
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
    outline: none !important;
    box-shadow: none !important;
}

.layout-main {
    background-color: #f5f7fa;
    padding: 20px;
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
