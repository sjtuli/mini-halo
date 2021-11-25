import Vue from "vue";
import Vuex from "vuex";

import admin from "./modules/admin";
import user from "./modules/user";
import journal from "./modules/journal";
import post from "./modules/post";
import comment from "./modules/comment";
import option from "./modules/option";
import app from "./modules/app";

import getters from "./getters";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    admin,
    user,
    journal,
    post,
    comment,
    option,
    app,
  },
  state: {},
  mutations: {},
  actions: {},
  getters,
});
