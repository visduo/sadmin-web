"use strict";

import axios from "axios";

// Axios配置
let config = {
  // 统一请求前缀
  baseURL: "http://localhost:8080"
};

const _axios = axios.create(config);

// Axios请求拦截器
_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
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
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
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
