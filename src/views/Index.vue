<script setup>
import {useCurrentUserStore} from "@/stores/currentUser.js";
</script>

<template>
    <el-main class="layout-main">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>后台首页</span>
                </div>
            </template>
            欢迎您，{{useCurrentUserStore().currentUser.realname}}，祝您工作愉快！
        </el-card>
    </el-main>
</template>
