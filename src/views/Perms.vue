<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { toTreeList } from '@/plugins/TreeUtil.js'
import qs from "qs";

// 表格数据
const tableData = ref([])

// 搜索表单数据
const searchForm = reactive({
    name: '',
    identifier: ''
})

// 添加权限对话框相关
const addDialogVisible = ref(false)
const addFormRef = ref()
const addFormData = reactive({
    parentId: 0,
    name: '',
    identifier: '',
    path: '',
    component: '',
    type: 1,
    sortId: 0,
    status: 1
})
const addFormRules = {
    parentId: [
        { required: true, message: '请选择父级权限', trigger: 'change' }
    ],
    name: [
        { required: true, message: '请输入权限名称', trigger: 'blur' },
        { min: 1, max: 50, message: '长度应在1到50个字符之间', trigger: 'blur' }
    ],
    identifier: [
        { required: true, message: '请输入权限标识', trigger: 'blur' },
        { min: 1, max: 100, message: '长度应在1到100个字符之间', trigger: 'blur' }
    ],
    type: [
        { required: true, message: '请选择权限类型', trigger: 'change' }
    ],
    sortId: [
        { required: true, message: '请输入排序ID', trigger: 'blur' }
    ],
    status: [
        { required: true, message: '请选择权限状态', trigger: 'change' }
    ]
}

// 编辑权限对话框相关
const editDialogVisible = ref(false)
const editFormRef = ref()
const editFormData = reactive({
    id: '',
    parentId: 0,
    name: '',
    identifier: '',
    path: '',
    component: '',
    type: 1,
    sortId: 0,
    status: 1
})
const editFormRules = {
    parentId: [
        { required: true, message: '请选择父级权限', trigger: 'change' }
    ],
    name: [
        { required: true, message: '请输入权限名称', trigger: 'blur' },
        { min: 1, max: 50, message: '长度应在1到50个字符之间', trigger: 'blur' }
    ],
    identifier: [
        { required: true, message: '请输入权限标识', trigger: 'blur' },
        { min: 1, max: 100, message: '长度应在1到100个字符之间', trigger: 'blur' }
    ],
    type: [
        { required: true, message: '请选择权限类型', trigger: 'change' }
    ],
    sortId: [
        { required: true, message: '请输入排序ID', trigger: 'blur' }
    ],
    status: [
        { required: true, message: '请选择权限状态', trigger: 'change' }
    ]
}

// 父级权限选项（树形结构）
const parentPermsOptions = ref([])

// 权限类型选项
const typeOptions = [
    { label: '目录', value: 0 },
    { label: '菜单', value: 1 },
    { label: '操作', value: 2 }
]

// 权限状态选项
const statusOptions = [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 }
]

// 获取权限列表
const fetchPermsList = () => {
    // 构造查询参数
    const params = {
        name: searchForm.name || undefined,
        identifier: searchForm.identifier || undefined
    }

    axios.get('/perms/list', { params }).then((res) => {
        // 将扁平数据转换为树形结构
        const treeData = toTreeList(res.data)
        tableData.value = treeData
    })
}

// 获取所有权限列表（用于父级权限选项）
const fetchAllPermsList = () => {
    axios.get('/perms/list').then((res) => {
        // 将扁平数据转换为树形结构
        const treeData = toTreeList(res.data)
        // 更新父级权限选项，添加根权限选项
        parentPermsOptions.value = [{ id: 0, name: '根权限', children: treeData }]
    })
}

// 搜索
const submitSearchForm = () => {
    fetchPermsList()
}

// 重置搜索
const resetSearchForm = () => {
    searchForm.name = ''
    searchForm.identifier = ''
    fetchPermsList()
}

// 显示添加权限对话框
const showAddDialog = () => {
    fetchAllPermsList()
    addDialogVisible.value = true
}

// 提交添加表单
const submitAddForm = () => {
    addFormRef.value.validate((valid) => {
        if (valid) {
            axios.post('/perms/add', qs.stringify(addFormData)).then((res) => {
                ElMessage.success('添加成功')
                addDialogVisible.value = false
                resetAddForm()
                fetchPermsList()
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

// 显示编辑权限对话框
const showEditDialog = (row) => {
    fetchAllPermsList()

    // 先设置ID，用于请求详细信息
    editFormData.id = row.id
    editDialogVisible.value = true

    // 获取权限详细信息
    axios.get(`/perms/get/${row.id}`).then((res) => {
        editFormData.parentId = res.data.parentId
        editFormData.name = res.data.name
        editFormData.identifier = res.data.identifier
        editFormData.path = res.data.path
        editFormData.component = res.data.component
        editFormData.type = res.data.type
        editFormData.sortId = res.data.sortId
        editFormData.status = res.data.status
    })
}

// 提交编辑表单
const submitEditForm = () => {
    editFormRef.value.validate((valid) => {
        if (valid) {
            axios.put(`/perms/update/${editFormData.id}`, qs.stringify(editFormData)).then((res) => {
                ElMessage.success('修改成功')
                editDialogVisible.value = false
                resetEditForm()
                fetchPermsList()
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

// 删除权限
const handleDelete = (id) => {
    ElMessageBox.confirm('确定要删除该权限吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        axios.delete(`/perms/delete/${id}`)
            .then((res) => {
                ElMessage.success('删除成功')
                fetchPermsList()
            })
    }).catch(() => {
        // 用户取消删除
    })
}

// 初始化加载数据
onMounted(() => {
    fetchPermsList()
})
</script>

<template>
    <el-main class="layout-main">
        <!-- 搜索表单 -->
        <el-card shadow="never" style="margin-bottom: 1rem;" :body-style="{paddingBottom: '2px'}">
            <el-form :model="searchForm" inline>
                <el-form-item label="权限名称">
                    <el-input v-model="searchForm.name" placeholder="请输入权限名称" />
                </el-form-item>
                <el-form-item label="权限标识">
                    <el-input v-model="searchForm.identifier" placeholder="请输入权限标识" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitSearchForm">搜索</el-button>
                    <el-button @click="resetSearchForm">重置</el-button>
                    <el-button type="warning" @click="showAddDialog">添加权限</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 数据表格 -->
        <el-card shadow="never">
            <template #header>
                <div class="card-header">
                    <span>权限列表</span>
                </div>
            </template>
            <el-table :data="tableData" style="width: 100%" row-key="id" default-expand-all :tree-props="{children: 'children'}" stripe>
                <el-table-column prop="name" label="权限名称" />
                <el-table-column prop="identifier" label="权限标识" />
                <el-table-column prop="path" label="路由路径" />
                <el-table-column prop="component" label="组件路径" />
                <el-table-column prop="type" label="权限类型" width="80">
                    <template #default="scope">
                        <el-tag v-if="scope.row.type === 0">目录</el-tag>
                        <el-tag v-else-if="scope.row.type === 1" type="success">菜单</el-tag>
                        <el-tag v-else-if="scope.row.type === 2" type="warning">操作</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sortId" label="排序ID" width="80" />
                <el-table-column prop="status" label="状态" width="80">
                    <template #default="scope">
                        <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
                        <el-tag v-else type="danger">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加权限对话框 -->
        <el-dialog v-model="addDialogVisible" title="添加权限" width="500px" @close="resetAddForm">
            <el-form ref="addFormRef" :model="addFormData" :rules="addFormRules" label-width="100px" label-position="top">
                <el-form-item label="父级权限" prop="parentId">
                    <el-tree-select
                        v-model="addFormData.parentId"
                        :data="parentPermsOptions"
                        node-key="id"
                        :props="{ label: 'name', children: 'children' }"
                        check-strictly
                        style="width: 100%"
                        placeholder="请选择父级权限"
                    />
                </el-form-item>

                <el-form-item label="权限名称" prop="name">
                    <el-input v-model="addFormData.name" placeholder="请输入权限名称"/>
                </el-form-item>

                <el-form-item label="权限标识" prop="identifier">
                    <el-input v-model="addFormData.identifier" placeholder="请输入权限标识"/>
                </el-form-item>

                <el-form-item label="路由路径">
                    <el-input v-model="addFormData.path" placeholder="请输入路由路径"/>
                </el-form-item>

                <el-form-item label="组件路径">
                    <el-input v-model="addFormData.component" placeholder="请输入组件路径"/>
                </el-form-item>

                <el-form-item label="权限类型" prop="type">
                    <el-select v-model="addFormData.type" placeholder="请选择权限类型" style="width: 100%">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="排序ID" prop="sortId">
                    <el-input-number v-model="addFormData.sortId" :min="0" controls-position="right" style="width: 100%"/>
                </el-form-item>

                <el-form-item label="权限状态" prop="status">
                    <el-select v-model="addFormData.status" placeholder="请选择权限状态" style="width: 100%">
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
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

        <!-- 编辑权限对话框 -->
        <el-dialog v-model="editDialogVisible" title="编辑权限" width="500px" @close="resetEditForm">
            <el-form ref="editFormRef" :model="editFormData" :rules="editFormRules" label-width="100px" label-position="top">
                <el-form-item label="父级权限" prop="parentId">
                    <el-tree-select
                        v-model="editFormData.parentId"
                        :data="parentPermsOptions"
                        node-key="id"
                        :props="{ label: 'name', children: 'children' }"
                        check-strictly
                        style="width: 100%"
                        placeholder="请选择父级权限"
                    />
                </el-form-item>

                <el-form-item label="权限名称" prop="name">
                    <el-input v-model="editFormData.name" placeholder="请输入权限名称"/>
                </el-form-item>

                <el-form-item label="权限标识" prop="identifier">
                    <el-input v-model="editFormData.identifier" placeholder="请输入权限标识"/>
                </el-form-item>

                <el-form-item label="路由路径">
                    <el-input v-model="editFormData.path" placeholder="请输入路由路径"/>
                </el-form-item>

                <el-form-item label="组件路径">
                    <el-input v-model="editFormData.component" placeholder="请输入组件路径"/>
                </el-form-item>

                <el-form-item label="权限类型" prop="type">
                    <el-select v-model="editFormData.type" placeholder="请选择权限类型" style="width: 100%">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="排序ID" prop="sortId">
                    <el-input-number v-model="editFormData.sortId" :min="0" controls-position="right" style="width: 100%"/>
                </el-form-item>

                <el-form-item label="权限状态" prop="status">
                    <el-select v-model="editFormData.status" placeholder="请选择权限状态" style="width: 100%">
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
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
