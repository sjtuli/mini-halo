const app = {
  state: {
    menus: [],
  },
  mutations: {
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    },
  },
};

export default app;
