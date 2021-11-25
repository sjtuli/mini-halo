import service from "@/utils/service";

const photoApi = {};

const baseUrl = "/api/content/photos";

/**
 * 获取图库列表
 *
 * @param {*} params {}
 * @returns {}
 */
photoApi.list = (params) => {
  return service.get(`${baseUrl}`, params);
};

export default photoApi;
