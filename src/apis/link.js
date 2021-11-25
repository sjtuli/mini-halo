import service from "@/utils/service";

const linkApi = {};

const baseUrl = "/api/content/links";

/**
 * 获取友情链接列表
 *
 * @returns {}
 */
linkApi.list = () => {
  return service.get(`${baseUrl}`);
};

/**
 * 获取友情链接，分组
 *
 * @returns {}
 */
linkApi.listAsTeamView = () => {
  return service.get(`${baseUrl}/team_view`);
};

export default linkApi;
