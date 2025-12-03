"use strict";

import axios from "axios";
import router from "@/router/index.js";
import {ElMessage} from "element-plus";

// Axios配置
let config = {
    // 统一请求前缀
    baseURL: "http://localhost:8080"
};

const _axios = axios.create(config);

// Axios请求拦截器
_axios.interceptors.request.use(
    function(config) {
        // 从localStorage中取出Token，如果Token存在，则放入请求头
        let authtoken = localStorage.getItem("authtoken");
        if (authtoken) {
            config.headers.authtoken = authtoken;
        }

        return config;
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Axios响应拦截器
_axios.interceptors.response.use(
    function(response) {
        if(response.data.code === 401) {
            // 如果响应数据中code为401即未登录，则清空locaoStorage跳转到登录页面
            // 可能：未登录、Token 失效
            localStorage.clear()
            ElMessage.error("请先登录")
            router.push("/login")
            // 抛出错误
            return Promise.reject(response.data.message)
        } else if(response.data.code !== 200) {
            // 响应数据中code不为200，则提示错误信息
            ElMessage.error(response.data.message)
            // 抛出错误
            return Promise.reject(response.data.message)
        }

        // 直接返回响应数据，简化接口调用处的取值逻辑
        return response.data;
    },
    function(error) {
        // 处理响应失败（HTTP状态码非2xx）
        ElMessage.error(error.message)
        return Promise.reject(error);
    }
);

const Plugin = {
    install(app, options) {
        app.axios = _axios;
        window.axios = _axios;
    }
}

export default Plugin;
