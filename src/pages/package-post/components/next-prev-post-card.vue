<template>
  <view
    class="next-prev-post-wrap"
    hover-class="default-hover-class"
    @click="onClick"
  >
    <view v-if="post.thumbnail && post.thumbnail !== ''" class="cover-wrap">
      <view class="cover-box">
        <image class="cover-image" :src="post.thumbnail" mode="aspectFill" />
      </view>
      <view class="cover-meta">
        <view class="meta-title-text">
          {{ title }}
        </view>
        <view class="meta-title">
          <text class="text-line-2">{{ post.title }}</text>
        </view>
      </view>
    </view>
    <view v-else class="title-wrap">
      <view class="meta-title-text">
        {{ title }}
      </view>
      <view class="meta-title">
        <text class="text-line-2">{{ post.title }}</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: "NextPrevPostCard",
  props: {
    post: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      default: "上一篇",
    },
  },
  methods: {
    onClick() {
      this.$emit("onClick", this.post);
    },
  },
};
</script>

<style lang="scss" scoped>
.next-prev-post-wrap {
  .cover-wrap {
    position: relative;
    flex-direction: column;
    justify-content: center;
    height: 220rpx;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.3);
    }

    .cover-box {
      display: flex;
      flex: 1;
      flex-direction: row;
      overflow: hidden;
      height: 100%;
      .cover-image {
        flex: 1;
      }
    }

    .cover-meta {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
  .cover-meta,
  .title-wrap {
    background-color: $uni-bg-color-mask;
    padding: $uni-spacing-col-base $uni-spacing-col-lg;
  }
  .meta-title-text {
    color: 26rpx;
    color: rgba(255, 255, 255, 0.7);
  }
  .meta-title {
    margin-top: 10rpx;
    text {
      font-size: 28rpx;
      color: #fff;
      font-weight: bold;
    }
  }
}
</style>
