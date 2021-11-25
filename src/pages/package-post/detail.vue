<template>
  <base-page ref="basePage">
    <view class="safe-area-inset-bottom">
      <page-meta>
        <navigation-bar :loading="detail.loading" :title="detail.data.title" />
      </page-meta>
      <view
        v-if="detail.data.thumbnail && detail.data.thumbnail !== ''"
        class="thumbnail-cover-wrap"
      >
        <view class="thumbnail-cover-box">
          <image
            class="thumbnail-cover-image"
            :src="detail.data.thumbnail"
            mode="aspectFill"
          />
        </view>
        <view class="thumbnail-cover-meta">
          <view class="meta-title">
            <text class="text-line-2">{{ detail.data.title }}</text>
          </view>
          <view class="meta-others">
            <view class="flex">
              <view class="self-center" style="margin-right: 15rpx">
                <cl-avatar :src="userProfile.avatar" :size="56"></cl-avatar>
              </view>
              <view class="flex-grow self-center">
                <text>{{ userProfile.nickname }}</text>
                <text class="bull">·</text>
                <text>{{ detail.data.createTime | timeAgo }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="title-wrap section-padding">
        <view class="meta-title">
          <text class="text-line-2">{{ detail.data.title }}</text>
        </view>
        <view class="meta-others">
          <view class="flex">
            <view class="self-center" style="margin-right: 15rpx">
              <cl-avatar :src="userProfile.avatar" :size="56"></cl-avatar>
            </view>
            <view class="flex-grow self-center">
              <text>{{ userProfile.nickname }}</text>
              <text class="bull">·</text>
              <text>{{ detail.data.createTime | timeAgo }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="meta-wrap">
        <view class="metas flex">
          <view class="meta-visits">
            <cl-icon
              name="eye-line"
              color="#999"
              size="30"
              :label="detail.data.visits || 0"
              label-size="26"
              label-color="#999"
            />
          </view>
          <view class="meta-word-count">
            <cl-icon
              name="emphasis-cn"
              color="#999"
              size="30"
              :label="detail.data.wordCount || 0"
              label-size="26"
              label-color="#999"
            />
          </view>
          <view
            class="meta-likes"
            hover-class="default-hover-class"
            @click="hasLiked ? null : handlePostLike()"
          >
            <cl-icon
              :name="`${hasLiked ? 'heart-3-fill' : 'heart-3-line'}`"
              :color="`${hasLiked ? 'red' : '#999'}`"
              size="30"
              :label="detail.data.likes || 0"
              label-size="26"
              :label-color="`${hasLiked ? 'red' : '#999'}`"
            />
          </view>
          <view
            v-show="!isReviewMode"
            class="meta-comments"
            hover-class="default-hover-class"
            @click="handleScrollToComment()"
          >
            <cl-icon
              name="message-3-line"
              color="#999"
              size="30"
              :label="detail.data.commentCount || 0"
              label-size="26"
              label-color="#999"
            />
          </view>
        </view>
      </view>
      <view
        v-if="detail.data.categories && detail.data.categories.length > 0"
        class="categories-wrap"
      >
        <block class="categories">
          <view
            v-for="(item, index) in detail.data.categories"
            :key="index"
            class="category inline-block"
            hover-class="default-hover-class"
            @click.stop="navigateToCategoryPosts(item)"
          >
            <cl-icon
              name="folder-2-line"
              color="#999"
              size="30"
              :label="item.name"
              label-size="26"
              label-color="#999"
            />
          </view>
        </block>
      </view>
      <view
        v-if="detail.data.tags && detail.data.tags.length > 0"
        class="tags-wrap"
      >
        <block class="tags">
          <post-tag
            v-for="(item, index) in detail.data.tags"
            :key="index"
            :tag="item"
            @onClick="navigateToTagPosts(item)"
            margin="0 10rpx 0 0"
          />
        </block>
      </view>
      <view class="section">
        <markdown-parse
          :content="detail.data.originalContent"
          :domain="envApiUrl"
        />
      </view>

      <view class="section">
        <actions-card
          :post="detail.data"
          :hasLiked="hasLiked"
          @onPostLike="handlePostLike()"
        />
      </view>

      <view class="section">
        <next-prev-post-card
          v-if="prevPost"
          :post="prevPost"
          @onClick="onFetchNextOrPrevPost()"
        />
        <next-prev-post-card
          v-if="nextPost"
          :post="nextPost"
          title="下一篇"
          @onClick="onFetchNextOrPrevPost()"
        />
      </view>
      <view
        v-show="!isReviewMode && !detail.data.disallowComment"
        class="comment-wrap"
      >
        <base-comment
          ref="basecomment"
          :targetId="detail.data.id"
          target="posts"
          loadmoreBg="#fff"
        />
      </view>
    </view>
  </base-page>
</template>

<script>
// apis
import postApi from "@/apis/post";

// components
import BaseComment from "@/components/page/comment/base-comment";
import NextPrevPostCard from "./components/next-prev-post-card";
import ActionsCard from "./components/actions-card";
import PostTag from "@/components/page/post/post-tag";

// libs
import { mapGetters } from "vuex";
import store from "@/store/";
import markdownParse from "@/wxcomponents/markdown-parse/index";

// mixins
import navigate from "@/mixins/navigate";
export default {
  name: "PostDetail",
  components: {
    BaseComment,
    NextPrevPostCard,
    ActionsCard,
    markdownParse,
    PostTag,
  },
  data() {
    return {
      detail: {
        data: {},
        loading: false,
      },

      prevPost: null,
      nextPost: null,
    };
  },
  onLoad(options) {
    if (options.scene) {
      const scene = decodeURIComponent(options.scene);
      this.detail.data.id = scene.split("=")[1];
      this.$refs.basePage.showLoading();
      this.handleGetPostDetail();
    }
    if (options.id) {
      this.detail.data.id = options.id;
      this.$refs.basePage.showLoading();
      this.handleGetPostDetail();
    }
  },
  onPullDownRefresh() {
    this.handleGetPostDetail();
  },
  onReachBottom() {
    this.$refs.basecomment.handleFetchNextPage();
  },
  mixins: [navigate],
  computed: {
    ...mapGetters(["hasLikedPostIds", "userProfile"]),
    hasLiked() {
      if (!this.hasLikedPostIds || this.hasLikedPostIds.length <= 0) {
        return false;
      }
      if (!this.detail.data.id) {
        return false;
      }
      return this.hasLikedPostIds.includes(Number(this.detail.data.id));
    },
  },
  methods: {
    /**
     * 获取文章详情
     */
    handleGetPostDetail(id, scrollToTop = false) {
      this.detail.loading = true;
      postApi
        .get(id ? id : this.detail.data.id, true, false)
        .then((response) => {
          this.detail.data = response.data.data;
        })
        .finally(() => {
          uni.stopPullDownRefresh();
          this.$refs.basePage.hideLoading();
          this.detail.loading = false;

          this.$refs.basecomment.handleListComments();
          this.handleGetNextPost();
          this.handleGetPrevPost();
          if (scrollToTop) {
            uni.pageScrollTo({
              scrollTop: 0,
              duration: 500,
            });
          }
        });
    },

    /**
     * 文章点赞
     */
    handlePostLike() {
      const post = this.detail.data;
      postApi.likes(post.id).then(() => {
        this.detail.data.likes++;
        this.$nextTick(() => {
          if (this.hasLikedPostIds) {
            store.commit("REFRESH_LIKED_POST_IDS", [
              ...this.hasLikedPostIds,
              Number(post.id),
            ]);
          }
        });
      });
    },

    /**
     * 获取下一篇文章
     */
    handleGetNextPost() {
      postApi
        .getNextPost(this.detail.data.id)
        .then((response) => {
          this.nextPost = response.data.data;
        })
        .catch(() => {
          this.nextPost = null;
        });
    },

    /**
     * 获取上一篇文章
     */
    handleGetPrevPost() {
      postApi
        .getPrevPost(this.detail.data.id)
        .then((response) => {
          this.prevPost = response.data.data;
        })
        .catch(() => {
          this.prevPost = null;
        });
    },

    /**
     * 跳转到上一篇或者下一篇文章
     */
    onFetchNextOrPrevPost(post) {
      this.handleGetPostDetail(post.id, true);
    },

    /**
     * 滚动到评论区域
     */
    handleScrollToComment() {
      uni.pageScrollTo({
        selector: ".comment-wrap",
        duration: 500,
      });
    },
  },
  onShareAppMessage() {
    if (this.detail.data.thumbnail) {
      return {
        title: this.detail.data.title,
        path: `/pages/package-post/detail?id=${this.detail.data.id}`,
        imageUrl: this.detail.data.thumbnail,
      };
    }
    return {
      title: this.detail.data.title,
      path: `/pages/package-post/detail?id=${this.detail.data.id}`,
    };
  },
};
</script>
<style lang="scss">
page {
  background: #fff;
}
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
    .meta-others {
      font-size: 26rpx;
      margin-top: 10rpx;
      color: #f2f2f2;

      .bull {
        margin: 0 10rpx;
      }
    }
  }
}

.title-wrap {
  background-color: $uni-bg-color-mask;
  .meta-title {
    text {
      font-size: 34rpx;
      color: #fff;
      font-weight: bold;
    }
  }
  .meta-others {
    font-size: 26rpx;
    margin-top: 10rpx;
    color: #f2f2f2;

    .bull {
      margin: 0 10rpx;
    }
  }
}

.meta-wrap {
  margin-top: 15rpx;
  margin-left: 24rpx;
  margin-right: 24rpx;
  .metas {
    .meta-visits,
    .meta-word-count,
    .meta-likes {
      margin-right: 16rpx;
    }
  }
}

.categories-wrap {
  .category {
    margin-right: 16rpx;
  }
}

.categories-wrap,
.tags-wrap {
  margin-left: 24rpx;
  margin-right: 24rpx;
}

.comment-wrap {
  border-top: 20rpx solid #f2f5f7;
  padding: $uni-spacing-col-base $uni-spacing-col-lg;
}
</style>
