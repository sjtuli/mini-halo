import { HAS_LIKED_POST_IDS } from "@/store/mutation-types";

const post = {
  state: {
    hasLikedPostIds: [],
  },
  mutations: {
    REFRESH_LIKED_POST_IDS: (state, ids) => {
      if (ids && ids.length > 0) {
        uni.setStorage({
          key: HAS_LIKED_POST_IDS,
          data: ids,
        });
        state.hasLikedPostIds = ids;
      } else {
        state.hasLikedPostIds = [];
      }
    },
  },
};

export default post;
