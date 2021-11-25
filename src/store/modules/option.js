const option = {
  state: {
    options: {
      reflect_mp_review_mode: false,
    },
  },
  mutations: {
    SET_OPTIONS: (state, options) => {
      state.options = options;
    },
  },
};

export default option;
