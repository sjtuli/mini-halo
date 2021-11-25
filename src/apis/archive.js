import service from "@/utils/service";

const archiveApi = {};

const baseUrl = "/api/content/archives";

/**
 * 根据月份文章归档
 *
 * @returns []
 */
archiveApi.listByMonths = () => {
  return service.get(`${baseUrl}/months`);
};

/**
 * 根据年份文章归档
 *
 * @returns []
 */
archiveApi.listByYears = () => {
  return service.get(`${baseUrl}/years`);
};

export default archiveApi;
