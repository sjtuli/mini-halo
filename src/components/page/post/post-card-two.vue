<template>
  <view class="post-card-two" @click="onClick">
    <view
      v-if="post.thumbnail && post.thumbnail !== ''"
      class="card-image-wrap"
    >
      <view class="card-image-box">
        <image class="card-image" :src="post.thumbnail" mode="aspectFill" />
      </view>
    </view>
    <!-- 内容 -->
    <view class="card-content">
      <block class="tags">
        <post-tag
          v-for="(item, index) in post.tags"
          :key="index"
          :tag="item"
          @onClick="navigateToTagPosts(item)"
          margin="0 10rpx 0 0"
        />
      </block>
      <view class="title">
        <text class="text-line-2">{{ post.title }}</text>
      </view>
      <view v-if="post.summary && post.summary !== ''" class="summary">
        <text class="text-line-3">{{ post.summary }}</text>
      </view>
      <view class="metas flex justify-between items-stretch">
        <view class="self-center flex">
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
        <view class="self-center flex">
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
          <view class="meta-likes">
            <cl-icon
              name="heart-3-line"
              color="#999"
              size="28"
              :label="post.likes"
              label-size="26"
              label-color="#999"
            />
          </view>
          <view class="meta-comment-count">
            <cl-icon
              name="message-3-line"
              color="#999"
              size="28"
              :label="post.commentCount"
              label-size="26"
              label-color="#999"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
// components
import PostTag from "@/components/page/post/post-tag";

// mixins
import navigate from "@/mixins/navigate";
export default {
  name: "PostCardTwo",
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
  methods: {
    onClick() {
      this.$emit("onClick");
    },
  },
};
</script>

<style lang="scss" scoped>
.post-card-two {
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
    height: 280rpx;
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
  }

  .card-content {
    padding: $uni-spacing-col-base $uni-spacing-col-lg;

    text {
      font-size: $uni-font-size-base;
      color: $uni-text-color-grey;
    }

    .title {
      margin-top: 15rpx;
      text {
        font-size: 30rpx;
        font-weight: bold;
        color: #333 !important;
      }
    }

    .summary {
      margin-top: 15rpx;
    }

    .metas {
      margin-top: 15rpx;

      .meta-category {
        margin-right: 16rpx;
      }

      .meta-visits,
      .meta-likes,
      .meta-comment-count {
        margin-left: 16rpx;
      }

      .meta-datetime {
        text {
          font-size: 26rpx !important;
          color: $uni-text-color-grey;
        }
      }
    }
  }
}
</style>
