<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {useRouter} from "vue-router";
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
                if (res.data.code === 200) {
                    ElMessage.success('登录成功')
                    // 将Token存储到localStorage中
                    localStorage.setItem('authtoken', res.data.data)
                    // 跳转到后台首页
                    // 从vue-router导入useRouter钩子，并执行push方法进行路由跳转
                    router.push('/admin/index')
                } else {
                    ElMessage.error(res.data.message)
                }
            }).catch((error) => {
                ElMessage.error(error.message)
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
                    <el-card>
                        <template #header>
                            <div class="card-header">
                                <span>用户登录</span>
                            </div>
                        </template>

                        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px" label-position="left">
                            <el-form-item label="账户账号" prop="username">
                                <el-input v-model="loginForm.username" placeholder="请输入账户账号"/>
                            </el-form-item>

                            <el-form-item label="账户密码" prop="password">
                                <el-input v-model="loginForm.password" type="password" placeholder="请输入账户密码" show-password/>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" @click="handleLogin">登录</el-button>
                                <el-button @click="resetForm">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<style scoped>
.card-header {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
}
</style>
