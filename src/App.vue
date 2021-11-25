<script>
import store from "@/store/";
import userApi from "@/apis/user";
import optionApi from "@/apis/option";
import menuApi from "@/apis/menu";

import {
  HAS_LIKED_POST_IDS,
  HAS_LIKED_JOURNAL_IDS,
  HALO_ADMIN_ACCESS_TOKEN,
  COMMENTATOR_INFO,
} from "@/store/mutation-types";
export default {
  onLaunch() {
    // refresh store
    store.commit(
      "REFRESH_LIKED_POST_IDS",
      uni.getStorageSync(HAS_LIKED_POST_IDS)
    );
    store.commit(
      "REFRESH_LIKED_JOURNAL_IDS",
      uni.getStorageSync(HAS_LIKED_JOURNAL_IDS)
    );
    store.commit("SET_TOKEN", uni.getStorageSync(HALO_ADMIN_ACCESS_TOKEN));
    store.commit("SET_COMMENTATOR_INFO", uni.getStorageSync(COMMENTATOR_INFO));

    this.handleGetUserProfile();
    this.handleListOptions();
    this.handleListMenus();

    console.log("App Launch");
  },
  onShow() {
    console.log("App Show");
  },
  onHide() {
    console.log("App Hide");
  },
  methods: {
    /**
     * 获取博主资料
     */
    handleGetUserProfile() {
      userApi.getProfile().then((response) => {
        store.commit("SET_USER_PROFILE", response.data.data);
      });
    },

    /**
     * 获取自定义设置选项
     */
    handleListOptions() {
      optionApi
        .listMapView(["reflect_mp_review_mode"].join(","))
        .then((response) => {
          store.commit("SET_OPTIONS", response.data.data);
        });
    },

    /**
     * 获取菜单列表
     */
    handleListMenus() {
      menuApi.list().then((response) => {
        store.commit("SET_MENUS", response.data.data);
      });
    },
  },
};
</script>

<style lang="scss">
page {
  background: #f2f5f7;
}

@import "./components/lib/cl-uni/index.scss";
@import "./styles/override.scss";
@import "./styles/styles.scss";
@import "./styles/utilities.scss";
@import "./static/remix-icons/remixicon.css";
</style>
