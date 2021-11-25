import service from "@/utils/service";

const baseUrl = "/api/content/options";

const optionApi = {};

/**
 * 获取配置项列表
 *
 * @param {*} keys {}
 * @returns {}
 */
optionApi.listMapView = (keys) => {
  return service.get(`${baseUrl}/map_view`, { keys });
};

export default optionApi;
