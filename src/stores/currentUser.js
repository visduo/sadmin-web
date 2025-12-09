import {ref, computed, reactive} from 'vue'
import { defineStore } from 'pinia'

export const useCurrentUserStore = defineStore('currentUser', () => {
    // 登录用户信息实体
    let currentUser = reactive({})

    // 当前用户菜单列表
    let currentMenu = reactive([])

    // 设置登录用户信息实体
    function setCurrentUser(currentUser) {
        this.currentUser = currentUser
    }

    // 设置当前用户菜单列表
    function setCurrentMenu(currentMenu) {
        this.currentMenu = currentMenu
    }

    return { currentUser, setCurrentUser, currentMenu, setCurrentMenu }
})
