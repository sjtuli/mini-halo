<template>
  <view>
    <page-meta>
      <navigation-bar
        :title="`分类：${category.name}`"
        :loading="list.loading"
      />
    </page-meta>
    <view
      v-if="category.thumbnail && category.thumbnail !== ''"
      class="thumbnail-cover-wrap"
    >
      <view class="thumbnail-cover-box">
        <image
          class="thumbnail-cover-image"
          :src="category.thumbnail"
          mode="aspectFill"
        />
      </view>
      <view class="thumbnail-cover-meta">
        <view class="meta-title">
          <text class="text-line-2">分类：{{ category.name }}</text>
        </view>
        <view v-if="category.description" class="meta-description">
          {{ category.description }}
        </view>
      </view>
    </view>
    <view v-else class="section">
      <text class="font-shadow">分类：{{ category.name }}</text>
    </view>
    <view class="post-list-container">
      <post-list
        :posts="list.data"
        :post-card="envCategoryPostCard"
        @onPostLikeRise="
          (index) => {
            list.data[index].likes++;
          }
        "
      />
    </view>
    <view v-if="list.total <= 0 && !list.loading">
      <cl-default
        image="/static/images/default/social-update.png"
        description="当前分类下暂无文章"
      />
    </view>
    <view
      style="margin: 20rpx 0"
      class="safe-area-inset-bottom"
      v-if="list.total > 0"
    >
      <cl-loadmore
        background-color="#f2f5f7"
        :loading="list.loading"
        :finish="!list.hasNext"
        color="#e2dada"
        width="300rpx"
      ></cl-loadmore>
    </view>
  </view>
</template>
<script>
// apis
import categoryApi from "@/apis/category";

// components
import PostList from "@/components/page/post/post-list";
export default {
  name: "CategoryPosts",
  components: {
    PostList,
  },
  data() {
    return {
      category: {
        slug: null,
        name: "",
        thumbnail: null,
        description: null,
      },
      list: {
        data: [],
        params: {
          page: 0,
          size: 10,
        },
        loading: false,
        total: 0,
        hasNext: false,
      },
    };
  },
  onLoad(options) {
    if (options.name) {
      this.category.name = options.name;
    }
    if (options.thumbnail) {
      this.category.thumbnail = options.thumbnail;
    }
    if (options.description) {
      this.category.description = options.description;
    }
    if (options.slug) {
      this.category.slug = options.slug;
      this.handleListCategoryPosts();
    }
  },
  onPullDownRefresh() {
    this.list.params.page = 0;
    this.handleListCategoryPosts();
  },
  onReachBottom() {
    if (this.list.hasNext) {
      this.list.params.page++;
      this.handleListCategoryPosts(false);
    }
  },
  methods: {
    /**
     * 获取分类下的文章信息
     */
    handleListCategoryPosts(refresh = true) {
      this.list.loading = true;
      categoryApi
        .listPostsByCategorySlug(this.category.slug, this.list.params)
        .then((response) => {
          if (refresh) {
            this.list.data = response.data.data.content;
          } else {
            this.list.data = this.list.data.concat(response.data.data.content);
          }
          this.list.total = response.data.data.total;
          this.list.hasNext = response.data.data.hasNext;
        })
        .finally(() => {
          uni.stopPullDownRefresh();
          this.list.loading = false;
        });
    },
  },
  onShareAppMessage() {
    const path = `/pages/package-post/category-posts?name=${this.category.name}&thumbnail=${this.category.thumbnail}&description=${this.category.description}&slug=${this.category.slug}`;
    if (this.category.thumbnail) {
      return {
        title: `分类：${this.category.name}`,
        path: path,
        imageUrl: this.category.thumbnail,
      };
    }
    return {
      title: `分类：${this.category.name}`,
      path: path,
    };
  },
};
</script>

<style lang="scss" scoped>
.thumbnail-cover-wrap {
  position: relative;
  flex-direction: column;
  justify-content: center;
  height: 420rpx;
  overflow: hidden;

  .thumbnail-cover-box {
    display: flex;
    flex: 1;
    flex-direction: row;
    overflow: hidden;
    height: 100%;

    .thumbnail-cover-image {
      flex: 1;
    }
  }
  .thumbnail-cover-meta {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: $uni-spacing-col-base $uni-spacing-col-lg;
    background-color: $uni-bg-color-mask;
    .meta-title {
      text {
        font-size: 34rpx;
        color: #fff;
        font-weight: bold;
      }
    }
    .meta-description {
      font-size: 26rpx;
      margin-top: 10rpx;
      color: #f2f2f2;
    }
  }
}
</style>
