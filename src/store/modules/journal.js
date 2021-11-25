import { HAS_LIKED_JOURNAL_IDS } from "@/store/mutation-types";

const journal = {
  state: {
    hasLikedJournalIds: [],
  },
  mutations: {
    REFRESH_LIKED_JOURNAL_IDS: (state, ids) => {
      if (ids && ids.length > 0) {
        uni.setStorage({
          key: HAS_LIKED_JOURNAL_IDS,
          data: ids,
        });
        state.hasLikedJournalIds = ids;
      } else {
        state.hasLikedJournalIds = [];
      }
    },
  },
};

export default journal;
