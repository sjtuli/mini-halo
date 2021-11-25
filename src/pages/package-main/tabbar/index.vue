<template>
  <base-page ref="basePage">
    <view class="safe-area-inset-bottom">
      <page-meta>
        <navigation-bar :title="envPageTitle" :loading="posts.loading" />
      </page-meta>
      <view v-if="toppedPosts && toppedPosts.length > 0" class="section">
        <post-swiper
          indicator-pos="topLeft"
          border-radius="16"
          :title="true"
          :interval="5000"
          :height="320"
          :list="toppedPosts"
          @click="handleSwipperClick()"
          :effect3d="envIndexSwiper3d"
        ></post-swiper>
      </view>
      <view v-if="recommendMenus && recommendMenus.length > 0">
        <view class="section">
          <text class="font-shadow">推荐</text>
        </view>
        <view>
          <scroll-view class="recommend-menus-view" scroll-x="true">
            <view
              v-for="(item, index) in recommendMenus"
              :key="index"
              class="recommend-menus-item"
              hover-class="default-hover-class"
              @click="handleRecommentItemClick(item)"
            >
              <view class="menus-item-image-box">
                <image
                  class="menus-item-image"
                  :src="item.icon"
                  mode="aspectFill"
                />
              </view>
              <view class="menus-item-title">
                <text>{{ item.name }}</text>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
      <view class="section">
        <view class="flex justify-between items-stretch">
          <view class="self-center">
            <text class="font-shadow">最新文章</text>
          </view>
          <view
            class="self-center"
            hover-class="default-hover-class"
            @click="handleSwitchToDiscovery()"
          >
            <text style="color: #999; font-size: 28rpx">查看更多</text>
          </view>
        </view>
      </view>
      <post-list
        :posts="posts.data"
        :post-card="envIndexPostCard"
        @onPostLikeRise="
          (index) => {
            posts.data[index].likes++;
          }
        "
      />
      <view v-if="posts.total <= 0 && !posts.loading">
        <cl-default />
      </view>
      <view style="margin: 20rpx 0" v-if="posts.total > 0">
        <cl-loadmore
          background-color="#f2f5f7"
          :loading="posts.loading"
          :finish="!posts.hasNext"
          color="#e2dada"
          width="300rpx"
        ></cl-loadmore>
      </view>
    </view>
  </base-page>
</template>

<script>
// apis
import postApi from "@/apis/post";

// components
import PostList from "@/components/page/post/post-list";
import PostSwiper from "@/components/page/post/post-swiper";

// libs
import { mapGetters } from "vuex";
export default {
  name: "Index",
  components: {
    PostList,
    PostSwiper,
  },
  data() {
    return {
      posts: {
        data: [],
        params: {
          page: 0,
          size: 10,
          sort: ["topPriority,desc", "createTime,desc"],
        },
        loading: false,
        total: 0,
        hasNext: false,
      },
    };
  },

  onLoad() {
    this.$refs.basePage.showLoading();
    this.handleListPosts();
  },
  onPullDownRefresh() {
    this.posts.params.page = 0;
    this.handleListPosts();
  },
  onReachBottom() {
    if (this.posts.hasNext) {
      this.posts.params.page++;
      this.handleListPosts(false);
    }
  },
  computed: {
    ...mapGetters(["menus"]),
    toppedPosts() {
      return this.posts.data.filter((item) => {
        item.image = item.thumbnail;
        return item.topped && item.image && item.image !== "";
      });
    },
    toppedPostsImages() {
      return this.toppedPosts.map((item) => {
        return item.thumbnail;
      });
    },
    recommendMenus() {
      return this.menus
        .filter((item) => {
          return item.team === "reflect_mp_recommend";
        })
        .sort((a, b) => {
          return a.priority - b.priority;
        });
    },
  },
  methods: {
    /**
     * 获取文章列表
     */
    handleListPosts(refresh = true) {
      this.posts.loading = true;
      postApi
        .list(this.posts.params)
        .then((response) => {
          if (refresh) {
            this.posts.data = response.data.data.content;
          } else {
            this.posts.data = this.posts.data.concat(
              response.data.data.content
            );
          }
          this.posts.total = response.data.data.total;
          this.posts.hasNext = response.data.data.hasNext;
        })
        .finally(() => {
          uni.stopPullDownRefresh();
          this.posts.loading = false;
          this.$refs.basePage.hideLoading();
        });
    },

    /**
     * 点击轮播的文章
     */
    handleSwipperClick(index) {
      const post = this.toppedPosts[index];
      if (post) {
        uni.navigateTo({
          url: `/pages/package-post/detail?id=${post.id}`,
        });
      }
    },

    /**
     * 推荐菜单项点击
     */
    handleRecommentItemClick(item) {
      const url = item.url;
      if (url.startsWith("https://") || url.startsWith("http://")) {
        uni.showModal({
          title: "提示",
          content: "这是一个外部链接，需要复制到浏览器中打开，是否复制？",
          confirmText: "复制链接",
          success: (res) => {
            if (res.confirm) {
              uni.setClipboardData({
                data: url,
              });
            }
          },
        });
      } else {
        uni.navigateTo({ url });
      }
    },

    /**
     * 跳转到发现页
     */
    handleSwitchToDiscovery() {
      uni.switchTab({
        url: "/pages/package-main/tabbar/discovery",
      });
    },
  },
  onShareAppMessage() {
    return {
      title: this.envPageTitle,
      path: `/pages/package-main/tabbar/index`,
    };
  },
};
</script>

<style lang="scss" scoped>
.recommend-menus-view {
  white-space: nowrap;
  width: 100%;

  .recommend-menus-item {
    display: inline-block;
    text-align: center;
    position: relative;
    flex-direction: column;
    justify-content: center;
    height: 180rpx;
    width: 380rpx;
    overflow: hidden;
    border-radius: 16rpx;
    margin: 0 10rpx;

    &:first-child {
      margin-left: 24rpx;
    }
    &:last-child {
      margin-right: 24rpx;
    }

    .menus-item-image-box {
      display: flex;
      flex: 1;
      flex-direction: row;
      overflow: hidden;
      height: 100%;
      .menus-item-image {
        flex: 1;
      }
      ::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.2);
      }
    }

    .menus-item-title {
      position: absolute;
      top: 70rpx;
      left: 0;
      right: 0;
      text {
        color: #fff;
        font-weight: bold;
        font-size: 28rpx;
      }
    }
  }
}
</style>
