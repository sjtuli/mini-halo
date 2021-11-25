import { HALO_ADMIN_ACCESS_TOKEN } from "@/store/mutation-types";
import adminApi from "@/apis/admin/admin";

const user = {
  state: {
    token: null,
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      uni.setStorage({
        key: HALO_ADMIN_ACCESS_TOKEN,
        data: token,
      });
      state.token = token;
    },
    CLEAR_TOKEN: (state) => {
      uni.removeStorage({
        key: HALO_ADMIN_ACCESS_TOKEN,
      });
      state.token = null;
    },
  },
  actions: {
    login({ commit }, { username, password, authcode }) {
      return new Promise((resolve, reject) => {
        adminApi
          .login(username, password, authcode)
          .then((response) => {
            commit("SET_TOKEN", response.data.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        adminApi
          .logout()
          .then((response) => {
            commit("CLEAR_TOKEN");
            resolve(response);
          })
          .catch(() => {
            resolve();
          });
      });
    },
    refreshToken({ commit }, refreshToken) {
      return new Promise((resolve, reject) => {
        adminApi
          .refreshToken(refreshToken)
          .then((response) => {
            commit("SET_TOKEN", response.data.data);
            resolve(response);
          })
          .catch((error) => {
            const data = error.response.data;
            if (data && data.status === 400 && data.data === refreshToken) {
              commit("CLEAR_TOKEN");
            }
            reject(error);
          });
      });
    },
  },
};

export default user;
