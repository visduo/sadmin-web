<script setup>
import { ref, reactive, onMounted } from 'vue'
import router from "@/router/index.js";

// 分页数据
const tableData = ref([])
const total = ref(0)
const loading = ref(false)

// 搜索表单数据
const searchForm = reactive({
    name: ''
})

// 分页参数
const pagination = reactive({
    currentPage: 1,
    pageSize: 10
})

// 获取部门列表
const fetchDeptList = async () => {
    loading.value = true

    const params = {
        page: pagination.currentPage,
        size: pagination.pageSize,
        name: searchForm.name || undefined
    }

    axios.get('/dept/list', { params })
        .then((res) => {
            tableData.value = res.data.data
            total.value = res.data.total
        })

    loading.value = false
}

// 搜索
const handleSearch = () => {
    pagination.currentPage = 1
    fetchDeptList()
}

// 重置搜索
const handleReset = () => {
    searchForm.name = ''
    pagination.currentPage = 1
    fetchDeptList()
}

// 分页变化
const handleSizeChange = (val) => {
    pagination.pageSize = val
    pagination.currentPage = 1
    fetchDeptList()
}

const handleCurrentChange = (val) => {
    pagination.currentPage = val
    fetchDeptList()
}

// 初始化加载数据
onMounted(() => {
    fetchDeptList()
})
</script>

<template>
    <el-main class="layout-main">
        <!-- 搜索表单 -->
        <el-card shadow="never" style="margin-bottom: 1rem;" :body-style="{paddingBottom: '2px'}">
            <el-form :model="searchForm" inline>
                <el-form-item label="部门名称">
                    <el-input v-model="searchForm.name" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                    <el-button type="warning" @click="router.push('/admin/dept/add')">添加部门</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 数据表格 -->
        <el-card shadow="never">
            <template #header>
                <div class="card-header">
                    <span>部门列表</span>
                </div>
            </template>
            <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
                <el-table-column prop="id" label="部门ID" width="80" />
                <el-table-column prop="name" label="部门名称" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="router.push('/dept/edit/' + scope.row.id)">编辑</el-button>
                        <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                :page-sizes="[10, 20, 50, 100]" :small="false" :disabled="false" :background="true"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                style="margin-top: 20px; justify-content: flex-end; display: flex;"
            />
        </el-card>
    </el-main>
</template>
