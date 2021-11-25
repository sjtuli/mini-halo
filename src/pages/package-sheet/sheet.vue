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
      <view class="section">
        <markdown-parse
          :content="detail.data.originalContent"
          :domain="envApiUrl"
        />
      </view>
      <view
        v-show="!isReviewMode && !detail.data.disallowComment"
        class="comment-wrap"
      >
        <base-comment
          ref="basecomment"
          :targetId="detail.data.id"
          target="sheets"
          loadmoreBg="#fff"
        />
      </view>
    </view>
  </base-page>
</template>

<script>
// apis
import sheetApi from "@/apis/sheet";

// components
import BaseComment from "@/components/page/comment/base-comment";

// libs
import { mapGetters } from "vuex";
import markdownParse from "@/wxcomponents/markdown-parse/index";
export default {
  name: "Sheet",
  components: {
    BaseComment,
    markdownParse,
  },
  data() {
    return {
      detail: {
        data: {},
        loading: false,
      },
    };
  },
  onLoad(options) {
    if (options.id) {
      this.detail.data.id = options.id;
      this.$refs.basePage.showLoading();
      this.handleGetSheetDetail();
    }
  },
  onPullDownRefresh() {
    this.handleGetSheetDetail();
  },
  onReachBottom() {
    this.$refs.basecomment.handleFetchNextPage();
  },
  computed: {
    ...mapGetters(["userProfile"]),
  },
  methods: {
    /**
     * 获取自定义页面详情
     */
    handleGetSheetDetail() {
      this.detail.loading = true;
      sheetApi
        .get(this.detail.data.id, true, false)
        .then((response) => {
          this.detail.data = response.data.data;
        })
        .finally(() => {
          uni.stopPullDownRefresh();
          this.$refs.basePage.hideLoading();
          this.detail.loading = false;
          this.$refs.basecomment.handleListComments();
        });
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
        path: `/pages/package-sheet/sheet?id=${this.detail.data.id}`,
        imageUrl: this.detail.data.thumbnail,
      };
    }
    return {
      title: this.detail.data.title,
      path: `/pages/package-sheet/sheet?id=${this.detail.data.id}`,
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
  margin-top: 20rpx;
  margin-left: 24rpx;
  margin-right: 24rpx;
  .metas {
    .meta-visits,
    .meta-word-count {
      margin-right: 16rpx;
    }
  }
}

.comment-wrap {
  border-top: 20rpx solid #f2f5f7;
  padding: $uni-spacing-col-base $uni-spacing-col-lg;
}
</style>
