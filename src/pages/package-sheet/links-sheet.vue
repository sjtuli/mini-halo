<template>
  <base-page ref="basePage">
    <view class="safe-area-inset-bottom">
      <page-meta>
        <navigation-bar :loading="list.loading" />
      </page-meta>
      <view class="links-container">
        <view v-for="(item, index) in list.data" :key="index">
          <view v-if="item.team && item.team !== ''" class="section">
            <text class="font-shadow">{{ item.team }}</text>
          </view>
          <view class="links-list">
            <view
              class="link-item section"
              v-for="(link, linkIndex) in item.links"
              :key="linkIndex"
            >
              <view class="link-card">
                <view class="flex">
                  <view class="link-avatar flex-none self-center">
                    <cl-avatar :src="link.logo" :size="120"></cl-avatar>
                  </view>
                  <view class="flex-grow self-center">
                    <view class="link-title">
                      <text>{{ link.name }}</text>
                    </view>
                    <view
                      v-if="link.description && link.description !== ''"
                      class="link-description"
                    >
                      <text>{{ link.description }}</text>
                    </view>
                    <view
                      @click="handleCopyLink(link.url)"
                      v-if="link.url && link.url !== ''"
                      class="link-url"
                    >
                      <text class="text-line-2">{{ link.url }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="list.total <= 0 && !list.loading">
        <cl-default />
      </view>
    </view>
  </base-page>
</template>
<script>
// apis
import linkApi from "@/apis/link";
export default {
  name: "LinksSheet",
  data() {
    return {
      list: {
        data: [],
        loading: false,
      },
    };
  },
  onLoad() {
    this.$refs.basePage.showLoading();
    this.handleListLinks();
  },
  onPullDownRefresh() {
    this.handleListLinks();
  },
  methods: {
    /**
     * 获取友情链接列表
     */
    handleListLinks() {
      this.list.loading = true;
      linkApi
        .listAsTeamView()
        .then((response) => {
          this.list.data = response.data.data;
        })
        .finally(() => {
          this.list.loading = false;
          this.$refs.basePage.hideLoading();
          uni.stopPullDownRefresh();
        });
    },

    /**
     * 复制链接
     */
    handleCopyLink(url) {
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
    },
  },
  onShareAppMessage() {
    return {
      title: "友情链接",
      path: `/pages/package-sheet/links-sheet`,
    };
  },
};
</script>
<style lang="scss" scoped>
.link-item {
  .link-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx 32rpx;
    .link-avatar {
      margin-right: 40rpx;
    }

    .link-title {
      font-size: 30rpx;
      color: #333;
      font-weight: bold;
    }

    .link-description {
      margin-top: 6rpx;
      font-size: 26rpx;
      color: #7b7777;
    }

    .link-url {
      margin-top: 6rpx;
      color: #1890ff;
      font-size: 26rpx;
    }
  }
}
</style>
