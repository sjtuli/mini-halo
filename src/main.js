import Vue from "vue";
import App from "./App";
import store from "./store";
import "@/filters/";

// plugins
import "@/plugins/logger";

import ClUni from "@/components/lib/cl-uni";
Vue.use(ClUni);

// mixins
import { base } from "./mixins/base.js";
Vue.mixin(base);

// global component
import BasePage from "@/components/page/base/base-page";
Vue.component("BasePage", BasePage);

Vue.config.productionTip = false;

App.mpType = "app";

const app = new Vue({
  store,
  ...App,
});
app.$mount();
