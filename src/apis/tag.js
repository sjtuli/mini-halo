import service from "@/utils/service";

const tagApi = {};

const baseUrl = "/api/content/tags";

/**
 * 获取标签列表
 *
 * @param {boolean} more
 * @returns []
 */
tagApi.list = (more = false) => {
  return service.get(`${baseUrl}?more=${more}`);
};

/**
 * 根据标签 slug 获取文章列表
 *
 * @param {*} slug slug
 * @param {*} params params
 * @returns {}
 */
tagApi.listPostsByTagSlug = (slug, params) => {
  return service.get(`${baseUrl}/${slug}/posts`, params);
};

export default tagApi;
