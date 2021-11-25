import service from "@/utils/service";

const categoryApi = {};

const baseUrl = "/api/content/categories";

/**
 * 获取分类列表
 *
 * @param {boolean} more
 * @returns {}
 */
categoryApi.list = (more = false) => {
  return service.get(`${baseUrl}?more=${more}`);
};

/**
 * 根据分类 slug 获取文章列表
 *
 * @param {*} slug slug
 * @param {*} params params
 * @returns {}
 */
categoryApi.listPostsByCategorySlug = (slug, params) => {
  return service.get(`${baseUrl}/${slug}/posts`, params);
};

export default categoryApi;
