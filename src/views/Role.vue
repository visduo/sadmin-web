<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import qs from "qs";

// 分页数据
const tableData = ref([])
const total = ref(0)

// 搜索表单数据
const searchForm = reactive({
    name: '',
    remarks: ''
})

// 分页参数
const pagination = reactive({
    currentPage: 1,
    pageSize: 10
})

// 添加角色对话框相关
const addDialogVisible = ref(false)
const addFormRef = ref()
const addFormData = reactive({
    name: '',
    remarks: ''
})
const addFormRules = {
    name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
        { min: 1, max: 50, message: '长度应在1到50个字符之间', trigger: 'blur' }
    ],
    remarks: [
        { required: true, message: '请输入角色备注', trigger: 'blur' },
        { min: 1, max: 200, message: '长度应在1到200个字符之间', trigger: 'blur' }
    ]
}

// 编辑角色对话框相关
const editDialogVisible = ref(false)
const editFormRef = ref()
const editFormData = reactive({
    id: '',
    name: '',
    remarks: ''
})
const editFormRules = {
    name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
        { min: 1, max: 50, message: '长度应在1到50个字符之间', trigger: 'blur' }
    ],
    remarks: [
        { required: true, message: '请输入角色备注', trigger: 'blur' },
        { min: 1, max: 200, message: '长度应在1到200个字符之间', trigger: 'blur' }
    ]
}

// 获取角色列表
const fetchRoleList = () => {
    const params = {
        page: pagination.currentPage,
        size: pagination.pageSize,
        name: searchForm.name || undefined,
        remarks: searchForm.remarks || undefined
    }

    axios.get('/role/list', { params }).then((res) => {
        tableData.value = res.data.data
        total.value = res.data.total
    })
}

// 搜索
const submitSearchForm = () => {
    pagination.currentPage = 1
    fetchRoleList()
}

// 重置搜索
const resetSearchForm = () => {
    searchForm.name = ''
    searchForm.remarks = ''
    pagination.currentPage = 1
    fetchRoleList()
}

// 分页变化
const handleSizeChange = (val) => {
    pagination.pageSize = val
    pagination.currentPage = 1
    fetchRoleList()
}

const handleCurrentChange = (val) => {
    pagination.currentPage = val
    fetchRoleList()
}

// 显示添加角色对话框
const showAddDialog = () => {
    addDialogVisible.value = true
}

// 提交添加表单
const submitAddForm = () => {
    addFormRef.value.validate((valid) => {
        if (valid) {
            axios.post('/role/add', qs.stringify(addFormData)).then((res) => {
                ElMessage.success('添加成功')
                addDialogVisible.value = false
                resetAddForm()
                fetchRoleList()
            })
        } else {
            ElMessage.error('请正确填写表单信息')
            return false
        }
    })
}

// 重置添加表单
const resetAddForm = () => {
    addFormRef.value.resetFields()
}

// 显示编辑角色对话框
const showEditDialog = (row) => {
    // 先设置ID，用于请求详细信息
    editFormData.id = row.id
    editDialogVisible.value = true

    // 获取角色详细信息
    axios.get(`/role/get/${row.id}`).then((res) => {
        editFormData.name = res.data.name
        editFormData.remarks = res.data.remarks
    })
}

// 提交编辑表单
const submitEditForm = () => {
    editFormRef.value.validate((valid) => {
        if (valid) {
            axios.put(`/role/update/${editFormData.id}`, qs.stringify(editFormData)).then((res) => {
                ElMessage.success('修改成功')
                editDialogVisible.value = false
                resetEditForm()
                fetchRoleList()
            })
        } else {
            ElMessage.error('请正确填写表单信息')
            return false
        }
    })
}

// 重置编辑表单
const resetEditForm = () => {
    editFormRef.value.resetFields()
}

// 删除角色
const handleDelete = (id) => {
    ElMessageBox.confirm('确定要删除该角色吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        axios.delete(`/role/delete/${id}`)
            .then((res) => {
                ElMessage.success('删除成功')
                fetchRoleList()
            })
    }).catch(() => {
        // 用户取消删除
    })
}

// 初始化加载数据
onMounted(() => {
    fetchRoleList()
})
</script>

<template>
    <el-main class="layout-main">
        <!-- 搜索表单 -->
        <el-card shadow="never" style="margin-bottom: 1rem;" :body-style="{paddingBottom: '2px'}">
            <el-form :model="searchForm" inline>
                <el-form-item label="角色名称">
                    <el-input v-model="searchForm.name" />
                </el-form-item>
                <el-form-item label="角色备注">
                    <el-input v-model="searchForm.remarks" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitSearchForm">搜索</el-button>
                    <el-button @click="resetSearchForm">重置</el-button>
                    <el-button type="warning" @click="showAddDialog">添加角色</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 数据表格 -->
        <el-card shadow="never">
            <template #header>
                <div class="card-header">
                    <span>角色列表</span>
                </div>
            </template>
            <el-table :data="tableData" style="width: 100%" stripe>
                <el-table-column prop="id" label="角色ID" width="80" />
                <el-table-column prop="name" label="角色名称" />
                <el-table-column prop="remarks" label="角色备注" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-button
                            type="danger"
                            size="small"
                            @click="handleDelete(scope.row.id)"
                            :disabled="scope.row.id === 1"
                        >
                            删除
                        </el-button>
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

        <!-- 添加角色对话框 -->
        <el-dialog v-model="addDialogVisible" title="添加角色" width="500px" @close="resetAddForm">
            <el-form ref="addFormRef" :model="addFormData" :rules="addFormRules" label-width="80px" label-position="top">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="addFormData.name" placeholder="请输入角色名称"/>
                </el-form-item>
                <el-form-item label="角色备注" prop="remarks">
                    <el-input v-model="addFormData.remarks" placeholder="请输入角色备注" type="textarea"/>
                </el-form-item>
            </el-form>

            <template #footer>
                <div style="width: 100%; text-align: center">
                    <el-button @click="addDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitAddForm">确定</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 编辑角色对话框 -->
        <el-dialog v-model="editDialogVisible" title="编辑角色" width="500px" @close="resetEditForm">
            <el-form ref="editFormRef" :model="editFormData" :rules="editFormRules" label-width="80px" label-position="top">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="editFormData.name" placeholder="请输入角色名称"/>
                </el-form-item>
                <el-form-item label="角色备注" prop="remarks">
                    <el-input v-model="editFormData.remarks" placeholder="请输入角色备注" type="textarea"/>
                </el-form-item>
            </el-form>

            <template #footer>
                <div style="width: 100%; text-align: center">
                    <el-button @click="editDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitEditForm">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </el-main>
</template>
