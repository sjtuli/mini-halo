import { COMMENTATOR_INFO } from "@/store/mutation-types";

const comment = {
  state: {
    commentatorInfo: {
      author: null,
      authorUrl: null,
      email: null,
    },
  },
  mutations: {
    SET_COMMENTATOR_INFO: (state, commentator) => {
      uni.setStorage({
        key: COMMENTATOR_INFO,
        data: commentator,
      });
      state.commentatorInfo = commentator;
    },
  },
};

export default comment;
