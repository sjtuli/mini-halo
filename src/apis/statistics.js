import service from "@/utils/service";

const baseUrl = "/api/content/statistics";

const statisticsApi = {};

/**
 * 获取站点的一些统计数据
 *
 * @returns {}
 */
statisticsApi.getStatistics = () => {
  return service.get(`${baseUrl}`);
};

export default statisticsApi;
