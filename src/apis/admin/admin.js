import adminService from "@/utils/admin-service";

const baseUrl = "/api/admin";

const adminApi = {};

/**
 * 登录前置验证，目前主要用于是否需要两步验证码
 *
 * @param {*} username username
 * @param {*} password password
 * @returns {}
 */
adminApi.loginPreCheck = (username, password) => {
  return adminService.post(`${baseUrl}/login/precheck`, { username, password });
};

/**
 * 管理员登录
 *
 * @param {*} username username
 * @param {*} password password
 * @param {*} authcode authcode
 * @returns {}
 */
adminApi.login = (username, password, authcode) => {
  return adminService.post(`${baseUrl}/login`, {
    username,
    password,
    authcode,
  });
};

/**
 * 退出登录
 *
 * @returns {}
 */
adminApi.logout = () => {
  return adminService.post(`${baseUrl}/logout`);
};

/**
 * 使用 refresh token 获取新的 token
 *
 * @param {*} refreshToken refreshToken
 * @returns {}
 */
adminApi.refreshToken = (refreshToken) => {
  return adminService.post(`${baseUrl}/refresh/${refreshToken}`);
};

export default adminApi;
