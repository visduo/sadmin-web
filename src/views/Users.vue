<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import qs from "qs";
import { useCurrentUserStore } from '@/stores/currentUser.js'

// 分页数据
const tableData = ref([])
const total = ref(0)

// 下拉选项数据
const deptOptions = ref([])
const roleOptions = ref([])

// 状态选项
const statusOptions = ref([
    { value: 0, label: '禁用' },
    { value: 1, label: '正常' }
])

// 搜索表单数据
const searchForm = reactive({
    deptId: '',
    roleId: '',
    status: '',
    username: '',
    realname: '',
    remarks: ''
})

// 分页参数
const pagination = reactive({
    currentPage: 1,
    pageSize: 10
})

// 添加用户对话框相关
const addDialogVisible = ref(false)
const addFormRef = ref()
const addFormData = reactive({
    deptId: '',
    roleId: '',
    username: '',
    password: '',
    realname: '',
    remarks: '',
    status: 1
})
const addFormRules = {
    deptId: [
        { required: true, message: '请选择关联部门', trigger: 'change' }
    ],
    roleId: [
        { required: true, message: '请选择关联角色', trigger: 'change' }
    ],
    username: [
        { required: true, message: '请输入账户账号', trigger: 'blur' },
        { min: 3, max: 20, message: '长度应在3到20个字符之间', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入账户密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度应在6到20个字符之间', trigger: 'blur' }
    ],
    realname: [
        { required: true, message: '请输入真实姓名', trigger: 'blur' },
        { min: 1, max: 50, message: '长度应在1到50个字符之间', trigger: 'blur' }
    ],
    remarks: [
        { required: true, message: '请输入用户备注', trigger: 'blur' },
        { min: 1, max: 200, message: '长度应在1到200个字符之间', trigger: 'blur' }
    ],
    status: [
        { required: true, message: '请选择账户状态', trigger: 'change' }
    ]
}

// 编辑用户对话框相关
const editDialogVisible = ref(false)
const editFormRef = ref()
const editFormData = reactive({
    id: '',
    deptId: '',
    roleId: '',
    password: '',
    realname: '',
    remarks: '',
    status: 1
})
const editFormRules = {
    deptId: [
        { required: true, message: '请选择关联部门', trigger: 'change' }
    ],
    roleId: [
        { required: true, message: '请选择关联角色', trigger: 'change' }
    ],
    password: [
        { min: 6, max: 20, message: '长度应在6到20个字符之间', trigger: 'blur' }
    ],
    realname: [
        { required: true, message: '请输入真实姓名', trigger: 'blur' },
        { min: 1, max: 50, message: '长度应在1到50个字符之间', trigger: 'blur' }
    ],
    remarks: [
        { required: true, message: '请输入用户备注', trigger: 'blur' },
        { min: 1, max: 200, message: '长度应在1到200个字符之间', trigger: 'blur' }
    ],
    status: [
        { required: true, message: '请选择账户状态', trigger: 'change' }
    ]
}

// 获取部门下拉选项
const fetchDeptOptions = () => {
    axios.get('/dept/optionList').then((res) => {
        deptOptions.value = res.data
    })
}

// 获取角色下拉选项
const fetchRoleOptions = () => {
    axios.get('/role/optionList').then((res) => {
        roleOptions.value = res.data
    })
}

// 获取用户列表
const fetchUserList = () => {
    const params = {
        page: pagination.currentPage,
        size: pagination.pageSize,
        deptId: searchForm.deptId || undefined,
        roleId: searchForm.roleId || undefined,
        status: searchForm.status !== '' ? searchForm.status : undefined,
        username: searchForm.username || undefined,
        realname: searchForm.realname || undefined,
        remarks: searchForm.remarks || undefined
    }

    axios.get('/users/list', { params }).then((res) => {
        tableData.value = res.data.data
        total.value = res.data.total
    })
}

// 搜索
const submitSearchForm = () => {
    pagination.currentPage = 1
    fetchUserList()
}

// 重置搜索
const resetSearchForm = () => {
    searchForm.deptId = ''
    searchForm.roleId = ''
    searchForm.status = ''
    searchForm.username = ''
    searchForm.realname = ''
    searchForm.remarks = ''
    pagination.currentPage = 1
    fetchUserList()
}

// 分页变化
const handleSizeChange = (val) => {
    pagination.pageSize = val
    pagination.currentPage = 1
    fetchUserList()
}

const handleCurrentChange = (val) => {
    pagination.currentPage = val
    fetchUserList()
}

// 显示添加用户对话框
const showAddDialog = () => {
    addDialogVisible.value = true
}

// 提交添加表单
const submitAddForm = () => {
    addFormRef.value.validate((valid) => {
        if (valid) {
            axios.post('/users/add', qs.stringify(addFormData)).then((res) => {
                ElMessage.success('添加成功')
                addDialogVisible.value = false
                resetAddForm()
                fetchUserList()
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

// 显示编辑用户对话框
const showEditDialog = (row) => {
    // 先设置ID，用于请求详细信息
    editFormData.id = row.id
    editDialogVisible.value = true

    // 获取用户详细信息
    axios.get(`/users/get/${row.id}`).then((res) => {
        editFormData.deptId = res.data.deptId
        editFormData.roleId = res.data.roleId
        editFormData.realname = res.data.realname
        editFormData.remarks = res.data.remarks
        editFormData.status = res.data.status
    })
}

// 提交编辑表单
const submitEditForm = () => {
    editFormRef.value.validate((valid) => {
        if (valid) {
            axios.put(`/users/update/${editFormData.id}`, qs.stringify(editFormData)).then((res) => {
                ElMessage.success('修改成功')
                editDialogVisible.value = false
                resetEditForm()
                fetchUserList()
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

// 删除用户
const handleDelete = (id) => {
    ElMessageBox.confirm('确定要删除该用户吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        axios.delete(`/users/delete/${id}`)
            .then((res) => {
                ElMessage.success('删除成功')
                fetchUserList()
            })
    }).catch(() => {
        // 用户取消删除
    })
}

// 初始化加载数据
onMounted(() => {
    fetchUserList()
    fetchDeptOptions()
    fetchRoleOptions()
})
</script>

<template>
    <el-main class="layout-main">
        <!-- 搜索表单 -->
        <el-card shadow="never" style="margin-bottom: 1rem;" :body-style="{paddingBottom: '2px'}">
            <el-form :model="searchForm" inline>
                <el-form-item label="关联部门">
                    <el-select style="width: 150px" v-model="searchForm.deptId" placeholder="请选择关联部门" clearable>
                        <el-option v-for="item in deptOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="关联角色">
                    <el-select style="width: 150px" v-model="searchForm.roleId" placeholder="请选择关联角色" clearable>
                        <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="账户状态">
                    <el-select style="width: 150px" v-model="searchForm.status" placeholder="请选择账户状态" clearable>
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="账户账号">
                    <el-input v-model="searchForm.username" />
                </el-form-item>

                <el-form-item label="真实姓名">
                    <el-input v-model="searchForm.realname" />
                </el-form-item>

                <el-form-item label="用户备注">
                    <el-input v-model="searchForm.remarks" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitSearchForm">搜索</el-button>
                    <el-button @click="resetSearchForm">重置</el-button>
                    <el-button type="warning" @click="showAddDialog">添加用户</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 数据表格 -->
        <el-card shadow="never">
            <template #header>
                <div class="card-header">
                    <span>用户列表</span>
                </div>
            </template>
            <el-table :data="tableData" style="width: 100%" stripe>
                <el-table-column prop="id" label="用户ID" width="80" />
                <el-table-column prop="dept.name" label="关联部门" />
                <el-table-column prop="role.name" label="关联角色" />
                <el-table-column prop="username" label="账户账号" />
                <el-table-column prop="realname" label="真实姓名" />
                <el-table-column prop="remarks" label="用户备注" />
                <el-table-column prop="status" label="账户状态">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                            {{ scope.row.status === 1 ? '正常' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="showEditDialog(scope.row)" :disabled="scope.row.id === 1 || scope.row.id === useCurrentUserStore().currentUser.id">
                            编辑
                        </el-button>
                        <el-button type="danger" size="small" @click="handleDelete(scope.row.id)" :disabled="scope.row.id === 1">
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

        <!-- 添加用户对话框 -->
        <el-dialog v-model="addDialogVisible" title="添加用户" width="500px" @close="resetAddForm">
            <el-form ref="addFormRef" :model="addFormData" :rules="addFormRules" label-width="80px" label-position="top">
                <el-form-item label="关联部门" prop="deptId">
                    <el-select v-model="addFormData.deptId" placeholder="请选择关联部门" style="width: 100%">
                        <el-option v-for="item in deptOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="关联角色" prop="roleId">
                    <el-select v-model="addFormData.roleId" placeholder="请选择关联角色" style="width: 100%">
                        <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="账户账号" prop="username">
                    <el-input v-model="addFormData.username" placeholder="请输入账户账号"/>
                </el-form-item>

                <el-form-item label="账户密码" prop="password">
                    <el-input v-model="addFormData.password" placeholder="请输入账户密码" type="password"/>
                </el-form-item>

                <el-form-item label="真实姓名" prop="realname">
                    <el-input v-model="addFormData.realname" placeholder="请输入真实姓名"/>
                </el-form-item>

                <el-form-item label="用户备注" prop="remarks">
                    <el-input v-model="addFormData.remarks" placeholder="请输入用户备注" type="textarea"/>
                </el-form-item>

                <el-form-item label="账户状态" prop="status">
                    <el-select v-model="addFormData.status" placeholder="请选择账户状态" style="width: 100%">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <template #footer>
                <div style="width: 100%; text-align: center">
                    <el-button @click="addDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitAddForm">确定</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 编辑用户对话框 -->
        <el-dialog v-model="editDialogVisible" title="编辑用户" width="500px" @close="resetEditForm">
            <el-form ref="editFormRef" :model="editFormData" :rules="editFormRules" label-width="80px" label-position="top">
                <el-form-item label="关联部门" prop="deptId">
                    <el-select v-model="editFormData.deptId" placeholder="请选择关联部门" style="width: 100%">
                        <el-option v-for="item in deptOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="关联角色" prop="roleId">
                    <el-select v-model="editFormData.roleId" placeholder="请选择关联角色" style="width: 100%">
                        <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="账户密码" prop="password">
                    <el-input v-model="editFormData.password" placeholder="请输入账户密码(留空则不修改)" type="password"/>
                </el-form-item>

                <el-form-item label="真实姓名" prop="realname">
                    <el-input v-model="editFormData.realname" placeholder="请输入真实姓名"/>
                </el-form-item>

                <el-form-item label="用户备注" prop="remarks">
                    <el-input v-model="editFormData.remarks" placeholder="请输入用户备注" type="textarea"/>
                </el-form-item>

                <el-form-item label="账户状态" prop="status">
                    <el-select v-model="editFormData.status" placeholder="请选择账户状态" style="width: 100%">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
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
