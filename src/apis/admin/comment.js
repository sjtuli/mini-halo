import adminService from "@/utils/admin-service";

const baseUrl = "/api/admin";

const adminCommentApi = {};

/**
 * 管理员创建评论
 *
 * @param {*} target
 * @param {*} data {}
 * @returns {}
 */
adminCommentApi.create = (target, data) => {
  return adminService.post(`${baseUrl}/${target}/comments`, data);
};

export default adminCommentApi;
