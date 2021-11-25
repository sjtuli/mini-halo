const user = {
  state: {
    userProfile: {},
  },
  mutations: {
    SET_USER_PROFILE: (state, profile) => {
      state.userProfile = profile;
    },
  },
};

export default user;
