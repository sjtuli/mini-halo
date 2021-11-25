<template>
  <view>
    <page-meta>
      <navigation-bar :title="`标签：${tag.name}`" :loading="list.loading" />
    </page-meta>
    <view
      v-if="tag.thumbnail && tag.thumbnail !== ''"
      class="thumbnail-cover-wrap"
    >
      <view class="thumbnail-cover-box">
        <image
          class="thumbnail-cover-image"
          :src="tag.thumbnail"
          mode="aspectFill"
        />
      </view>
      <view class="thumbnail-cover-meta">
        <view class="meta-title">
          <text class="text-line-2">标签：{{ tag.name }}</text>
        </view>
      </view>
    </view>
    <view v-else class="section">
      <text class="font-shadow">标签：{{ tag.name }}</text>
    </view>
    <view class="post-list-container">
      <post-list
        :posts="list.data"
        :post-card="envTagPostCard"
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
        description="当前标签下暂无文章"
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
import tagApi from "@/apis/tag";

// components
import PostList from "@/components/page/post/post-list";
export default {
  name: "TagPosts",
  components: {
    PostList,
  },
  data() {
    return {
      tag: {
        slug: null,
        name: "",
        thumbnail: null,
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
      this.tag.name = options.name;
    }
    if (options.thumbnail) {
      this.tag.thumbnail = options.thumbnail;
    }
    if (options.slug) {
      this.tag.slug = options.slug;
      this.handleListTagPosts();
    }
  },
  onPullDownRefresh() {
    this.list.params.page = 0;
    this.handleListTagPosts();
  },
  onReachBottom() {
    if (this.list.hasNext) {
      this.list.params.page++;
      this.handleListTagPosts(false);
    }
  },
  methods: {
    /**
     * 获取分类下的文章信息
     */
    handleListTagPosts(refresh = true) {
      this.list.loading = true;
      tagApi
        .listPostsByTagSlug(this.tag.slug, this.list.params)
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
    const path = `/pages/package-post/tag-posts?name=${this.tag.name}&thumbnail=${this.tag.thumbnail}&slug=${this.tag.slug}`;
    if (this.tag.thumbnail) {
      return {
        title: `标签：${this.tag.name}`,
        path: path,
        imageUrl: this.tag.thumbnail,
      };
    }
    return {
      title: `标签：${this.tag.name}`,
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
  }
}
</style>
