import service from "@/utils/service";

const menuApi = {};

const baseUrl = "/api/content/menus";

/**
 * 获取菜单列表
 *
 * @returns {}
 */
menuApi.list = () => {
  return service.get(`${baseUrl}`);
};

export default menuApi;
