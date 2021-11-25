import adminService from "@/utils/admin-service";

const baseUrl = "/api/admin/photos";

const adminPhotoApi = {};

/**
 * 获取图库列表
 *
 * @param {*} params {}
 * @returns {}
 */
adminPhotoApi.list = (params) => {
  return adminService.get(baseUrl, params);
};

/**
 * 根据 id 获取图片详情
 *
 * @param {*} id id
 * @returns {}
 */
adminPhotoApi.get = (id) => {
  return adminService.get(`${baseUrl}/${id}`);
};

/**
 * 创建图片
 *
 * @param {*} data {}
 * @returns {}
 */
adminPhotoApi.create = (data) => {
  return adminService.post(baseUrl, data);
};

/**
 * 更新图片
 *
 * @param {*} id id
 * @param {*} data {}
 * @returns {}
 */
adminPhotoApi.update = (id, data) => {
  return adminService.put(`${baseUrl}/${id}`, data);
};

/**
 * 删除图片
 *
 * @param {*} id id
 * @returns {}
 */
adminPhotoApi.delete = (id) => {
  return adminService.delete(`${baseUrl}/${id}`);
};

export default adminPhotoApi;
