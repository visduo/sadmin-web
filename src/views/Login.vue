<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import router from "@/router/index.js";
import qs from "qs";

// 表单数据
const loginForm = reactive({
    username: '',
    password: ''
})

// 表单引用
const loginFormRef = ref()

// 表单验证规则
const loginRules = {
    username: [
        { required: true, message: '请输入账户账号', trigger: 'blur' },
        { min: 6, max: 18, message: '账户账号长度应为6-18个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入账户密码', trigger: 'blur' },
        { min: 6, max: 18, message: '账户密码长度应为6-18个字符', trigger: 'blur' }
    ]
}

// 登录处理函数
const handleLogin = async () => {
    if (!loginFormRef.value) return

    await loginFormRef.value.validate((valid) => {
        if (valid) {
            // 这里执行实际的登录逻辑
            // 发送Axios请求
            axios.post('/passport/login', qs.stringify(loginForm)).then((res) => {
                ElMessage.success('登录成功')
                // 将Token存储到localStorage中
                // Axios响应拦截器处理，res即后端响应给前端的数据，不再是res.data.data
                localStorage.setItem('authtoken', res.data)
                // 跳转到后台首页
                router.push('/admin/index')
            })
        } else {
            ElMessage.error('请正确填写表单信息')
            return false
        }
    })
}

// 重置表单
const resetForm = () => {
    loginFormRef.value.resetFields()
}
</script>

<template>
    <el-container>
        <el-main>
            <el-row justify="center">
                <el-col :span="8">
                    <el-card style="margin-top: 5rem">
                        <template #header>
                            <div style="text-align: center; padding: 0.5rem 0">
                                <h2 style="margin-top: 0; margin-bottom: 10px">SAdmin后台管理系统</h2>
                                <span>欢迎使用SAdmin后台管理系统，请先登录</span>
                            </div>
                        </template>

                        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px" label-position="top">
                            <el-form-item label="账户账号" prop="username" size="large">
                                <el-input v-model="loginForm.username" placeholder="请输入账户账号"/>
                            </el-form-item>

                            <el-form-item label="账户密码" prop="password" size="large">
                                <el-input v-model="loginForm.password" type="password" placeholder="请输入账户密码" show-password/>
                            </el-form-item>

                            <div style="width: 100%; text-align: center">
                                <el-button type="primary" size="large" @click="handleLogin">登录</el-button>
                                <el-button size="large" @click="resetForm">重置</el-button>
                            </div>
                        </el-form>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>
