import Vue from "vue";

import store from "@/store";

import qs from "qs";

let Fly = require("flyio/dist/npm/wx");
let adminService = new Fly();

adminService.config.timeout = 10000;
adminService.config.baseURL = process.env.VUE_APP_API_URL;
adminService.config.withCredentials = true;

function setTokenToHeader(request) {
  const token = store.getters.token;
  if (token && token.access_token) {
    request.headers["Admin-Authorization"] = token.access_token;
  }
}

async function reRequest(error) {
  setTokenToHeader(error.request);
  const res = await adminService.request(error.request);
  return res;
}

let refreshTask = null;
async function refreshToken(error) {
  const refreshToken = store.getters.token.refresh_token;
  try {
    if (refreshTask === null) {
      refreshTask = store.dispatch("refreshToken", refreshToken);
    }

    await refreshTask;
  } catch (err) {
    if (
      err.response &&
      err.response.data &&
      err.response.data.data === refreshToken
    ) {
      handleNavigateToLogin();
    }
  } finally {
    refreshTask = null;
  }
  return reRequest(error);
}

/**
 * 请求拦截器
 */
adminService.interceptors.request.use(
  (request) => {
    setTokenToHeader(request);

    if (request.method === "GET") {
      request.body = qs.stringify(request.body, { arrayFormat: "repeat" });
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 请求响应拦截器
 */
adminService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const response = error.response;

    Vue.$log.debug("error", error);

    if (error && error.status === 0) {
      uni.showModal({
        title: "提示",
        showCancel: false,
        confirmText: "我知道了",
        content: "网络错误，请检查当前网络状况后重试",
      });
      return Promise.reject(error);
    }

    if (error && error.status === 1) {
      uni.showModal({
        title: "提示",
        showCancel: false,
        confirmText: "我知道了",
        content: "请求超时，请稍后重试",
      });
      return Promise.reject(error);
    }

    const data = response ? response.data : null;

    if (data) {
      if (data.status === 500) {
        uni.showModal({
          title: "提示",
          showCancel: false,
          confirmText: "我知道了",
          content: "服务器异常，请联系管理员",
        });
      } else if (data.status === 401) {
        if (
          store.getters.token &&
          store.getters.token.access_token === data.data
        ) {
          const res = refreshToken(error);
          if (res !== error) {
            return res;
          }
        } else {
          handleNavigateToLogin();
        }
      } else {
        uni.showModal({
          title: "提示",
          showCancel: false,
          confirmText: "我知道了",
          content: data.message,
        });
      }
    }

    return Promise.reject(error);
  }
);

function handleNavigateToLogin() {
  uni.showModal({
    title: "提示",
    showCancel: false,
    confirmText: "重新登录",
    content: "登录状态已失效，请重新登录",
    success: function () {
      store.commit("CLEAR_TOKEN");
      uni.redirectTo({
        url: `/pages/package-admin/login/login`,
      });
    },
  });
}

export default adminService;
