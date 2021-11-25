import Vue from "vue";
import qs from "qs";
let Fly = require("flyio/dist/npm/wx");
let service = new Fly();

service.config.timeout = 10000;
service.config.baseURL = process.env.VUE_APP_API_URL;

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  (request) => {
    request.headers["API-Authorization"] = process.env.VUE_APP_API_ACCESS_KEY;

    if (request.method === "GET") {
      request.body = qs.stringify(request.body, { arrayFormat: "repeat" });
    }

    Vue.$log.debug("Handle request:", request);

    Vue.$log.debug("Request start time:", new Date());
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 请求响应拦截器
 */
service.interceptors.response.use(
  (response) => {
    Vue.$log.debug("Handle response:", response);
    Vue.$log.debug("Request end time:", new Date());
    return response;
  },
  (error) => {
    const response = error.response;
    Vue.$log.debug("error:", error);

    const isMute = error.request.mute;

    if (error.status === 0) {
      uni.showModal({
        title: "提示",
        showCancel: false,
        confirmText: "我知道了",
        content: "网络错误，请检查当前网络状况后重试",
      });
      return Promise.reject(response);
    }

    if (error.status === 1) {
      uni.showModal({
        title: "提示",
        showCancel: false,
        confirmText: "我知道了",
        content: "请求超时，请稍后重试",
      });
      return Promise.reject(response);
    }

    if (response && !isMute) {
      if (response.status === 500) {
        uni.showModal({
          title: "提示",
          showCancel: false,
          confirmText: "我知道了",
          content: "服务器异常，请联系管理员",
        });
      } else if (response.status === 401) {
        uni.showModal({
          title: "提示",
          showCancel: false,
          confirmText: "确定",
          content: "未配置 Api Access Key，请配置后重试",
        });
      } else {
        uni.showModal({
          title: "提示",
          showCancel: false,
          confirmText: "我知道了",
          content: response.data.message,
        });
      }
    }

    return Promise.reject(response);
  }
);

export default service;
