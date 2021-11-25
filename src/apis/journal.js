import service from "@/utils/service";

const journalApi = {};

const baseUrl = "/api/content/journals";

/**
 * 获取日志列表
 *
 * @param {Object} params
 * @returns {}
 */
journalApi.list = (params) => {
  return service.get(`${baseUrl}`, params);
};

/**
 * 点赞一个日志
 *
 * @param {*} id
 * @returns {}
 */
journalApi.likes = (id) => {
  return service.post(`${baseUrl}/${id}/likes`);
};

/**
 * 获取日志详情
 *
 * @param {*} id
 * @returns {}
 */
journalApi.get = (id) => {
  return service.get(`${baseUrl}/${id}`);
};

/**
 * 获取一条评论的子评论列表
 *
 * @param {*} journalId
 * @param {*} commentParentId
 * @returns []
 */
journalApi.listChildrenComments = (journalId, commentParentId) => {
  return service.get(
    `${baseUrl}/${journalId}/comments/${commentParentId}/children`
  );
};

/**
 * 获取日志的评论列表
 *
 * @param {*} id
 * @param {*} params
 * @returns {}
 */
journalApi.listComments = (id, params) => {
  return service.get(`${baseUrl}/${id}/comments/list_view`, params);
};

/**
 * 获取父级评论列表
 *
 * @param {*} id
 * @param {*} params
 * @returns {}
 */
journalApi.listTopComments = (id, params) => {
  return service.get(`${baseUrl}/${id}/comments/top_view`, params);
};

/**
 * 获取评论列表，包含子评论
 *
 * @param {*} id
 * @param {*} params
 * @returns {}
 */
journalApi.listCommentsAsTree = (id, params) => {
  return service.get(`${baseUrl}/${id}/comments/tree_view`, params);
};

/**
 * 为日志创建评论
 *
 * @param {*} data {}
 * @returns {}
 */
journalApi.createComment = (data) => {
  return service.post(`${baseUrl}/comments`, data);
};

export default journalApi;
