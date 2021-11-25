<template>
  <view class="post-card-one">
    <view
      v-if="post.thumbnail && post.thumbnail !== ''"
      class="card-image-wrap"
      @click="onClick"
    >
      <view class="card-image-box">
        <image class="card-image" :src="post.thumbnail" mode="aspectFill" />
      </view>
      <view class="card-image-meta">
        <view class="meta-title">
          <text class="text-line-2">{{ post.title }}</text>
        </view>
      </view>
    </view>
    <view v-else class="card-title-wrap" @click="onClick">
      <text class="text-line-2">{{ post.title }}</text>
    </view>
    <!-- 内容 -->
    <view class="card-content" @click="onClick">
      <block class="tags">
        <post-tag
          v-for="(item, index) in post.tags"
          :key="index"
          :tag="item"
          @onClick="navigateToTagPosts(item)"
          margin="0 10rpx 0 0"
        />
      </block>
      <view v-if="post.summary && post.summary !== ''" class="summary">
        <text class="text-line-3">{{ post.summary }}</text>
      </view>
      <view class="metas flex">
        <view
          v-if="post.categories && post.categories.length > 0"
          class="meta-category"
          hover-class="default-hover-class"
          @click.stop="navigateToCategoryPosts(post.categories[0])"
        >
          <cl-icon
            name="folder-2-line"
            color="#999"
            size="28"
            :label="post.categories[0].name"
            label-size="26"
            label-color="#999"
          />
        </view>
        <view class="meta-visits">
          <cl-icon
            name="eye-line"
            color="#999"
            size="28"
            :label="post.visits"
            label-size="26"
            label-color="#999"
          />
        </view>
        <view class="meta-datetime">
          <cl-icon
            name="calendar-2-line"
            color="#999"
            size="28"
            :label="post.createTime | timeAgo"
            label-size="26"
            label-color="#999"
          />
        </view>
      </view>
    </view>
    <!-- 底部 -->
    <view class="card-footer">
      <view class="footer-items">
        <view
          class="footer-item"
          hover-class="default-hover-class"
          @click="hasLiked ? null : handlePostLike()"
        >
          <cl-icon
            :name="`${hasLiked ? 'heart-3-fill' : 'heart-3-line'}`"
            :color="`${hasLiked ? 'red' : '#999'}`"
            size="38"
            :label="post.likes"
            label-size="26"
            :label-color="`${hasLiked ? 'red' : '#999'}`"
          />
        </view>
        <view
          v-show="!isReviewMode"
          class="footer-item text-center"
          hover-class="default-hover-class"
          @click="onClick"
        >
          <cl-icon
            name="message-3-line"
            color="#999"
            size="38"
            :label="post.commentCount"
            label-size="26"
            label-color="#999"
          />
        </view>
        <view
          class="footer-item text-right"
          hover-class="default-hover-class"
          @click="handleShowSharePanel"
        >
          <cl-icon name="share-line" color="#999" size="38" />
        </view>
      </view>
    </view>
  </view>
</template>
<script>
// libs
import { mapGetters } from "vuex";

// components
import PostTag from "@/components/page/post/post-tag";

// mixins
import navigate from "@/mixins/navigate";
export default {
  name: "PostCardOne",
  components: {
    PostTag,
  },
  props: {
    post: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  mixins: [navigate],
  computed: {
    ...mapGetters(["hasLikedPostIds"]),
    hasLiked() {
      if (!this.hasLikedPostIds || this.hasLikedPostIds.length <= 0) {
        return false;
      }
      return this.hasLikedPostIds.includes(Number(this.post.id));
    },
  },
  methods: {
    /**
     * 跳转到详情页面并滚动到评论区域
     */
    handleNavigateToDetailComment() {
      uni.navigateTo({
        url: `/pages/package-post/detail?id=${this.post.id}&scrollToComment=1`,
      });
    },

    /**
     * 文章点赞
     */
    handlePostLike() {
      this.$emit("onPostLike", this.index);
    },

    /**
     * 显示分享面板
     */
    handleShowSharePanel() {
      this.$emit("onShowSharePanel", this.index);
    },
    onClick() {
      this.$emit("onClick");
    },
  },
};
</script>

<style lang="scss" scoped>
.post-card-one {
  display: flex;
  flex: 1;
  background-color: #fff;
  position: relative;
  flex-direction: column;
  border-radius: 16rpx;
  overflow: hidden;
  box-sizing: border-box;

  .card-image-wrap {
    position: relative;
    flex-direction: column;
    justify-content: center;
    height: 300rpx;
    overflow: hidden;

    .card-image-box {
      display: flex;
      flex: 1;
      flex-direction: row;
      overflow: hidden;
      height: 100%;

      .card-image {
        flex: 1;
      }
    }
    .card-image-meta {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: $uni-spacing-col-base $uni-spacing-col-lg;
      background-color: $uni-bg-color-mask;

      .meta-title {
        text {
          font-size: 30rpx;
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }

  .card-title-wrap {
    padding: $uni-spacing-col-base $uni-spacing-col-lg;
    background-color: $uni-bg-color-mask;
    text {
      font-size: 30rpx;
      color: #fff;
      font-weight: bold;
    }
  }

  .card-content {
    padding: $uni-spacing-col-base $uni-spacing-col-lg;

    text {
      font-size: $uni-font-size-base;
      color: $uni-text-color-grey;
    }

    .summary {
      margin-top: 15rpx;
    }

    .metas {
      margin-top: 15rpx;

      .meta-category,
      .meta-visits {
        margin-right: 16rpx;
      }

      .meta-datetime {
        text {
          font-size: 26rpx !important;
          color: $uni-text-color-grey;
        }
      }
    }
  }
  .card-footer {
    border-top: 1rpx solid #f2f5f7;
    padding: $uni-spacing-col-base $uni-spacing-col-lg;

    .footer-items {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}
</style>
