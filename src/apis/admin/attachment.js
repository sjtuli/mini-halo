import adminService from "@/utils/admin-service";

import store from "@/store";

const baseUrl = "/api/admin/attachments";

const adminAttachmentApi = {};

/**
 * 获取附件列表
 *
 * @param {*} params {}
 * @returns {}
 */
adminAttachmentApi.list = (params) => {
  return adminService.get(baseUrl, params);
};

/**
 * 获取附件详情
 *
 * @param {*} id id
 * @returns {}
 */
adminAttachmentApi.get = (id) => {
  return adminService.get(`${baseUrl}/${id}`);
};

/**
 * 删除附件
 *
 * @param {*} id id
 * @returns {}
 */
adminAttachmentApi.delete = (id) => {
  return adminService.delete(`${baseUrl}/${id}`);
};

/**
 * 上传附件
 *
 * @param {*} path path
 * @param {*} showLoading showLoading
 * @returns {}
 */
adminAttachmentApi.upload = (path, showLoading = true) => {
  return new Promise((resolve, reject) => {
    if (showLoading) {
      uni.showLoading({
        title: "上传中",
      });
    }
    uni.uploadFile({
      url: `${process.env.VUE_APP_API_URL}${baseUrl}/upload`,
      filePath: path,
      name: "file",
      header: {
        "Admin-Authorization": store.getters.token.access_token,
      },
      formData: {},
      success: (uploadFileRes) => {
        resolve(JSON.parse(uploadFileRes.data));
      },
      fail: (error) => {
        reject(error);
      },
      complete: () => {
        uni.hideLoading();
      },
    });
  });
};

/**
 * 所有存储类型
 */
adminAttachmentApi.storageTypes = {
  LOCAL: {
    type: "LOCAL",
    text: "本地",
  },
  SMMS: {
    type: "SMMS",
    text: "SM.MS",
  },
  UPOSS: {
    type: "UPOSS",
    text: "又拍云",
  },
  QINIUOSS: {
    type: "QINIUOSS",
    text: "七牛云",
  },
  ALIOSS: {
    type: "ALIOSS",
    text: "阿里云",
  },
  BAIDUBOS: {
    type: "BAIDUBOS",
    text: "百度云",
  },
  TENCENTCOS: {
    type: "TENCENTCOS",
    text: "腾讯云",
  },
  HUAWEIOBS: {
    type: "HUAWEIOBS",
    text: "华为云",
  },
  MINIO: {
    type: "MINIO",
    text: "MinIO",
  },
};

export default adminAttachmentApi;
