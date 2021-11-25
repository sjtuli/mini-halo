import service from "@/utils/service";

const baseUrl = "/api/content/users";

const optionApi = {};

/**
 * 获取管理员基础信息
 *
 * @returns {}
 */
optionApi.getProfile = () => {
  return service.get(`${baseUrl}/profile`);
};

export default optionApi;
