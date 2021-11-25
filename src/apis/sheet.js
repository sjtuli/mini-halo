import service from "@/utils/service";

const baseUrl = "/api/content/sheets";

const sheetApi = {};

/**
 * 获取自定义页面详情
 *
 * @param {*} id id
 * @param {*} formatDisabled 是否禁用渲染后的文本
 * @param {*} sourceDisabled 是否禁用原始文本
 * @returns {}
 */
sheetApi.get = (id, formatDisabled = false, sourceDisabled = false) => {
  return service.get(`${baseUrl}/${id}`, {
    formatDisabled,
    sourceDisabled,
  });
};

export default sheetApi;
