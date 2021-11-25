import service from "@/utils/service";

const postApi = {};

const baseUrl = "/api/content/posts";

/**
 * 获取文章列表
 *
 * @param {*} params
 * @returns {}
 */
postApi.list = (params) => {
  return service.get(`${baseUrl}`, params);
};

/**
 * 获取文章详情
 *
 * @param {*} id
 * @param {boolean} formatDisabled
 * @param {boolean} sourceDisabled
 * @returns {}
 */
postApi.get = (id, formatDisabled = false, sourceDisabled = false) => {
  return service.get(`${baseUrl}/${id}`, {
    formatDisabled,
    sourceDisabled,
  });
};

/**
 * 获取一条评论的子评论列表
 *
 * @param {*} postId
 * @param {*} commentParentId
 * @returns []
 */
postApi.listChildrenComments = (postId, commentParentId) => {
  return service.get(
    `${baseUrl}/${postId}/comments/${commentParentId}/children`
  );
};

/**
 * 获取文章的评论列表
 *
 * @param {*} id
 * @param {*} params
 * @returns {}
 */
postApi.listComments = (id, params) => {
  return service.get(`${baseUrl}/${id}/comments/list_view`, params);
};

/**
 * 获取父级评论列表
 *
 * @param {*} id
 * @param {*} params
 * @returns {}
 */
postApi.listTopComments = (id, params) => {
  return service.get(`${baseUrl}/${id}/comments/top_view`, params);
};

/**
 * 获取评论列表，包含子评论
 *
 * @param {*} id
 * @param {*} params
 * @returns {}
 */
postApi.listCommentsAsTree = (id, params) => {
  return service.get(`${baseUrl}/${id}/comments/tree_view`, params);
};

/**
 * 为文章创建评论
 *
 * @param {*} data {}
 * @returns {}
 */
postApi.createComment = (data) => {
  return service.post(`${baseUrl}/comments`, data);
};

/**
 * 点赞一篇文章
 *
 * @param {*} id
 * @returns {}
 */
postApi.likes = (id) => {
  return service.post(`${baseUrl}/${id}/likes`);
};

/**
 * 获取下一篇文章
 *
 * @param {*} id
 * @returns {}
 */
postApi.getNextPost = (id) => {
  return service.get(`${baseUrl}/${id}/next`, null, { mute: true });
};

/**
 * 获取上一篇文章
 *
 * @param {*} id
 * @returns {}
 */
postApi.getPrevPost = (id) => {
  return service.get(`${baseUrl}/${id}/prev`, null, { mute: true });
};

/**
 * 搜索文章
 *
 * @param {*} params
 * @returns {}
 */
postApi.search = (keyword) => {
  return service.post(`${baseUrl}/search?keyword=${keyword}`);
};

export default postApi;
