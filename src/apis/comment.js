import service from "@/utils/service";
const baseUrl = "/api/content";

const commentApi = {};

/**
 * 创建评论
 *
 * @param {*} target posts,journals,sheets
 * @param {*} comment {}
 * @returns {}
 */
commentApi.createComment = (target, comment) => {
  return service.post(`${baseUrl}/${target}/comments`, comment);
};

/**
 * 获取评论列表
 *
 * @param {*} target posts,journals,sheets
 * @param {*} targetId postId
 * @param {*} view list_view,tree_view
 * @param {*} params {}
 * @returns {}
 */
commentApi.listComments = (target, targetId, view = "tree_view", params) => {
  return service.get(
    `${baseUrl}/${target}/${targetId}/comments/${view}`,
    params
  );
};

export default commentApi;
