import adminService from "@/utils/admin-service";

const baseUrl = "/api/admin/journals";

const adminJournalApi = {};

/**
 * 获取日志列表
 *
 * @param {*} params {}
 * @returns {}
 */
adminJournalApi.list = (params) => {
  return adminService.get(baseUrl, params);
};

/**
 * 创建日志
 *
 * @param {*} data {}
 * @returns {}
 */
adminJournalApi.create = (data) => {
  return adminService.post(baseUrl, data);
};

/**
 * 编辑日志
 *
 * @param {*} id id
 * @param {*} data {}
 * @returns {}
 */
adminJournalApi.update = (id, data) => {
  return adminService.put(`${baseUrl}/${id}`, data);
};

/**
 * 删除日志
 *
 * @param {*} id id
 * @returns {}
 */
adminJournalApi.delete = (id) => {
  return adminService.delete(`${baseUrl}/${id}`);
};

adminJournalApi.journalType = {
  PUBLIC: {
    text: "公开",
  },
  INTIMATE: {
    text: "私密",
  },
};

export default adminJournalApi;
