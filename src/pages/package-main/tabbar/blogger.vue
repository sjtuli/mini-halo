<template>
  <view>
    <page-meta>
      <navigation-bar :loading="statistics.loading || menus.loading" />
    </page-meta>
    <view class="profile-card section">
      <view class="flex">
        <view class="profile-avatar flex-none self-center">
          <cl-avatar :src="userProfile.avatar" :size="120"></cl-avatar>
        </view>
        <view class="flex-grow self-center">
          <view class="mp-title">
            <text>{{ envPageTitle }}</text>
          </view>
          <view class="mp-description">
            <text>{{ envDescription }}</text>
          </view>
        </view>
      </view>
      <view class="statistics flex justify-between items-stretch">
        <view class="statistics-item">
          <view class="item-count">
            <text>{{ statistics.data.postCount || 0 }}</text>
          </view>
          <view class="item-text">
            <text>文章</text>
          </view>
        </view>
        <view v-show="!isReviewMode" class="statistics-item">
          <view class="item-count">
            <text>{{ statistics.data.commentCount || 0 }}</text>
          </view>
          <view class="item-text">
            <text>评论</text>
          </view>
        </view>
        <view class="statistics-item">
          <view class="item-count">
            <text>{{ statistics.data.journalCount || 0 }}</text>
          </view>
          <view class="item-text">
            <text>日志</text>
          </view>
        </view>
        <view class="statistics-item">
          <view class="item-count">
            <text>{{ statistics.data.visitCount || 0 }}</text>
          </view>
          <view class="item-text">
            <text>阅读量</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="bloggerMenus && bloggerMenus.length > 0" class="section">
      <view class="cell-wrap">
        <view class="cell">
          <view
            class="cell-item flex"
            v-for="(item, index) in bloggerMenus"
            :key="index"
            hover-class="cell-hover"
            :style="{
              borderTop: `${index !== 0 ? '1px solid #f7f7f7' : ''}`,
            }"
            @click="handleBloggerItemClick(item)"
          >
            <view class="item-left-icon self-center">
              <cl-icon
                :name="item.icon"
                :size="36"
                color="rgb(144, 147, 153)"
              />
            </view>
            <view class="item-text flex-grow self-center">
              {{ item.name }}
            </view>
            <view class="item-right-icon flex justify-end self-center">
              <cl-icon
                name="arrow-right-s-line"
                :size="36"
                color="rgb(144, 147, 153)"
              />
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-show="!isReviewMode" class="section">
      <view class="cell-wrap">
        <view class="cell">
          <view
            class="cell-item flex"
            hover-class="cell-hover"
            @click="handleNavigateToAdmin()"
          >
            <view class="item-left-icon self-center">
              <cl-icon
                name="user-settings-line"
                :size="36"
                color="rgb(144, 147, 153)"
              />
            </view>
            <view class="item-text flex-grow self-center"> 管理 </view>
            <view class="item-right-icon flex justify-end self-center">
              <cl-icon name="arrow-right-s-line" :size="36" color="#969799" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
// apis
import statisticsApi from "@/apis/statistics";

// libs
import { mapGetters } from "vuex";
import store from "@/store/";
export default {
  name: "Blogger",
  data() {
    return {
      statistics: {
        data: {},
        loading: false,
      },
    };
  },
  onLoad() {
    this.handleGetStatistics();
  },
  onPullDownRefresh() {
    this.handleGetStatistics();
  },
  computed: {
    ...mapGetters(["userProfile", "menus"]),
    bloggerMenus() {
      return this.menus
        .filter((item) => {
          return item.team === "reflect_mp_blogger_menu";
        })
        .sort((a, b) => {
          return a.priority - b.priority;
        });
    },
  },
  methods: {
    /**
     * 获取统计信息
     */
    handleGetStatistics() {
      this.statistics.loading = true;
      statisticsApi
        .getStatistics()
        .then((response) => {
          this.statistics.data = response.data.data;
        })
        .finally(() => {
          this.statistics.loading = false;
          uni.stopPullDownRefresh();
        });
    },

    /**
     * 点击菜单
     */
    handleBloggerItemClick(item) {
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
     * 跳转到后台管理页面
     */
    handleNavigateToAdmin() {
      if (this.hasAdminLogined) {
        uni.showActionSheet({
          itemList: ["附件管理", "图库管理", "日志管理", "退出登录"],
          success(res) {
            if (res.tapIndex === 0) {
              uni.navigateTo({
                url: "/pages/package-admin/attachment/index",
              });
            } else if (res.tapIndex === 1) {
              uni.navigateTo({
                url: "/pages/package-admin/photo/index",
              });
            } else if (res.tapIndex === 2) {
              uni.navigateTo({
                url: "/pages/package-admin/journal/index",
              });
            } else if (res.tapIndex === 3) {
              uni.showModal({
                title: "提示",
                content: "是否确定退出登录？",
                success(option) {
                  if (option.confirm) {
                    store.dispatch("logout").then(() => {
                      uni.reLaunch({
                        url: "/pages/package-main/tabbar/index",
                      });
                    });
                  }
                },
              });
            }
          },
        });
      } else {
        uni.navigateTo({
          url: "/pages/package-admin/login/login",
        });
      }
    },
  },
  onShareAppMessage() {
    return {
      title: this.envPageTitle,
      path: `/pages/package-main/tabbar/blogger`,
    };
  },
};
</script>
<style lang="scss" scoped>
.profile-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  .profile-avatar {
    margin-right: 50rpx;
  }

  .mp-title {
    font-size: 36rpx;
    color: #333;
    font-weight: bold;
  }

  .mp-description {
    margin-top: 12rpx;
    font-size: 24rpx;
    color: #7b7777;
  }

  .statistics {
    margin-top: 90rpx;
    .statistics-item {
      text-align: center;
      .item-count {
        font-size: 38rpx;
        color: #333;
        font-weight: bold;
      }
      .item-text {
        font-weight: 400;
        margin-top: 6rpx;
        font-size: 24rpx;
        color: #aba1a1;
      }
    }
  }
}
.cell-wrap {
  background: #fff;
  border-radius: 16rpx;

  .cell {
    .cell-item {
      padding: 26rpx 32rpx;
      font-size: 28rpx;

      .item-text {
        color: #606266;
        font-size: 28rpx;
      }
      .item-left-icon {
        margin-right: 25rpx;
      }
      .item-right-icon {
        font-size: 28rpx;
      }
    }
    .cell-hover {
      background-color: #f7f8f9;
    }
  }
}
</style>
