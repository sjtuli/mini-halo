const navigate = {
  methods: {
    /**
     * 跳转到文章详情页面
     *
     * @param {*} post 文章对象
     */
    navigateToPostDetail(post) {
      uni.navigateTo({
        url: `/pages/package-post/detail?id=${post.id}`,
      });
    },

    /**
     * 跳转到分类的文章列表页面
     *
     * @param {*} category 分类对象
     */
    navigateToCategoryPosts(category) {
      uni.navigateTo({
        url: `/pages/package-post/category-posts?slug=${category.slug}&name=${category.name}&thumbnail=${category.thumbnail}&description=${category.description}`,
      });
    },

    /**
     * 跳转到标签的文章列表页面
     *
     * @param {*} tag
     */
    navigateToTagPosts(tag) {
      uni.navigateTo({
        url: `/pages/package-post/tag-posts?slug=${tag.slug}&name=${tag.name}&thumbnail=${tag.thumbnail}&description=${tag.description}`,
      });
    },
  },
};

export default navigate;
