import {ref, computed, reactive} from 'vue'
import { defineStore } from 'pinia'

export const useCurrentUserStore = defineStore('currentUser', () => {
    // 登录用户信息实体
    let currentUser = reactive({})

    // 设置登录用户信息实体
    function setCurrentUser(currentUser) {
        this.currentUser = currentUser
    }

    return { currentUser, setCurrentUser }
})
