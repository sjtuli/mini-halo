<template>
  <view
    class="post-card-three"
    hover-class="default-hover-class"
    @click="onClick"
  >
    <view class="flex">
      <view
        v-if="post.thumbnail && post.thumbnail !== ''"
        class="flex-none card-image-wrap"
      >
        <view class="card-image-box">
          <image class="card-image" :src="post.thumbnail" mode="aspectFill" />
        </view>
      </view>
      <view class="card-infos-wrap">
        <view class="title-wrap">
          <text class="text-line-1">{{ post.title }}</text>
        </view>
        <view class="summary-wrap">
          <text class="text-line-2">{{ post.summary }}</text>
        </view>
        <view class="metas-wrap">
          <view class="self-center flex">
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
            <view
              v-if="post.commentCount || post.commentCount === 0"
              class="meta-comment-count"
            >
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
  </view>
</template>
<script>
export default {
  name: "PostCardThree",
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
  methods: {
    onClick() {
      this.$emit("onClick");
    },
  },
};
</script>

<style lang="scss" scoped>
.post-card-three {
  display: flex;
  flex: 1;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;

  .card-image-wrap {
    height: 260rpx;
    width: 300rpx;
    overflow: hidden;

    .card-image-box {
      display: flex;
      overflow: hidden;
      height: 100%;
      .card-image {
        flex: 1;
      }
    }
  }

  .card-infos-wrap {
    padding: $uni-spacing-col-base $uni-spacing-col-lg;
  }

  .title-wrap {
    text {
      font-size: 28rpx;
      color: #333;
      font-weight: bold;
    }
  }

  .summary-wrap {
    margin-top: 10rpx;
    text {
      font-size: 24rpx;
      color: $uni-text-color-grey;
    }
  }
  .metas-wrap {
    margin-top: 10rpx;

    .meta-visits,
    .meta-likes,
    .meta-comment-count {
      margin-right: 16rpx;
    }
  }
}
</style>
