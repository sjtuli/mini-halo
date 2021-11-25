const base = {
  data() {
    return {};
  },
  computed: {
    /**
     * 判断当前管理员是否已经登录
     *
     * @returns true or false
     */
    hasAdminLogined() {
      return !!this.$store.getters.token;
    },

    /**
     * 默认状态栏标题，来自 .env 文件配置
     *
     * @returns 默认标题
     */
    envPageTitle() {
      return process.env.VUE_APP_MP_TITLE;
    },

    /**
     * 小程序描述，来自 .env 文件配置
     *
     * @returns 小程序描述
     */
    envDescription() {
      return process.env.VUE_APP_MP_DESCRIPTION;
    },

    /**
     * API 请求地址，即 Halo 站点地址，来自 .env 文件配置
     *
     * @returns API 请求地址
     */
    envApiUrl() {
      return process.env.VUE_API_URL;
    },

    /**
     * 首页文章卡片样式
     *
     * @returns
     */
    envIndexPostCard() {
      return Number(process.env.VUE_APP_INDEX_POSTS_CARD);
    },

    /**
     * 分类文章列表卡片样式
     *
     * @returns
     */
    envCategoryPostCard() {
      return Number(process.env.VUE_APP_CATEGORY_POSTS_CARD);
    },

    /**
     * 标签文章列表卡片样式
     *
     * @returns
     */
    envTagPostCard() {
      return Number(process.env.VUE_APP_TAG_POSTS_CARD);
    },

    /**
     * 文章海报生成二维码方式，mini：小程序码（需要开通云开发），normal：普通二维码（扫码打开站点）
     *
     * @returns
     */
    envSharePainterQrcode() {
      return process.env.VUE_APP_SHARE_PAINTER_QRCODE;
    },

    /**
     * 首页文章轮播图是否开启 3D 效果
     *
     * @returns
     */
    envIndexSwiper3d() {
      if (
        process.env.VUE_APP_INDEX_SWIPER_3D === true ||
        process.env.VUE_APP_INDEX_SWIPER_3D === "true"
      ) {
        return true;
      }
      return false;
    },

    /**
     * 是否处于审核模式
     */
    isReviewMode() {
      const options = this.$store.getters.options;
      if (
        options &&
        (options.reflect_mp_review_mode === true ||
          options.reflect_mp_review_mode === "true")
      ) {
        return true;
      }
      return false;
    },
  },
};

export { base };
