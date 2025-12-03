<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import qs from "qs";

// 表单引用
const formRef = ref()

// 表单数据
const formData = reactive({
    name: ''
})

// 表单验证规则
const rules = {
    name: [
        { required: true, message: '请输入部门名称', trigger: 'blur' },
        { min: 1, max: 50, message: '长度应在1到50个字符之间', trigger: 'blur' }
    ]
}

// 路由实例
const router = useRouter()

// 提交表单
const submitForm = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid) => {
        if (valid) {
            // 发送添加请求
            axios.post('/dept/add', qs.stringify(formData)).then((res) => {
                ElMessage.success('添加成功')
                // 返回部门列表页面
                router.push('/admin/dept/list')
            })
        } else {
            ElMessage.error('请正确填写表单信息')
            return false
        }
    })
}

// 重置表单
const resetForm = () => {
    formRef.value.resetFields()
}
</script>

<template>
    <el-main class="layout-main">
        <el-card shadow="never">
            <template #header>
                <div class="card-header">
                    <span>添加部门</span>
                </div>
            </template>

            <el-form ref="formRef" :model="formData" :rules="rules" label-position="top">
                <el-form-item label="部门名称" prop="name" size="large">
                    <el-input v-model="formData.name" placeholder="请输入部门名称"/>
                </el-form-item>

                <div>
                    <el-button type="primary" size="large" @click="submitForm">提交</el-button>
                    <el-button size="large" @click="resetForm">重置</el-button>
                </div>
            </el-form>
        </el-card>
    </el-main>
</template>
