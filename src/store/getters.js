const getters = {
  hasLikedPostIds: (state) => state.post.hasLikedPostIds,
  hasLikedJournalIds: (state) => state.journal.hasLikedJournalIds,
  userProfile: (state) => state.user.userProfile,
  commentatorInfo: (state) => state.comment.commentatorInfo,
  options: (state) => state.option.options,
  menus: (state) => state.app.menus,
  token: (state) => state.admin.token,
};

export default getters;
