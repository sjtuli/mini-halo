<template>
  <base-page ref="basePage">
    <view>
      <page-meta>
        <navigation-bar
          :loading="categories.loading || tags.loading || archives.loading"
        />
      </page-meta>
      <cl-sticky>
        <view class="bg-white">
          <view class="section-padding">
            <cl-search
              v-model="search.keyword"
              :show-search-button="false"
              placeholder="输入关键字搜索"
              @search="handleNavigateToSearchPosts()"
            ></cl-search>
          </view>
        </view>
      </cl-sticky>
      <view class="categories-wrap">
        <view class="section">
          <text class="font-shadow">分类目录</text>
        </view>
        <view>
          <view class="categories-list">
            <view
              class="categories-item"
              v-for="(item, index) in categories.data"
              :key="index"
              hover-class="default-hover-class"
              @click="navigateToCategoryPosts(item)"
            >
              <view class="card-image-box">
                <image
                  class="card-image"
                  :src="item.thumbnail"
                  mode="aspectFill"
                />
              </view>
              <view class="card-text">
                <text>{{ item.name }}({{ item.postCount }})</text>
              </view>
            </view>
          </view>
          <view
            v-if="categories.data.length <= 0 && !categories.loading"
            class="empty"
          >
            <view>
              <cl-default />
            </view>
          </view>
        </view>
      </view>
      <view class="tags-wrap">
        <view class="section">
          <text class="font-shadow">标签</text>
        </view>
        <view class="tags-list">
          <post-tag
            v-for="(item, index) in tags.data"
            :key="index"
            :tag="item"
            margin="5rpx 20rpx 5rpx 0"
            :font-size="28"
            show-post-count
            @onClick="navigateToTagPosts(item)"
          />
          <view v-if="tags.data.length <= 0 && !tags.loading">
            <cl-default />
          </view>
        </view>
      </view>
      <view class="archives-wrap">
        <view class="section">
          <text class="font-shadow">归档</text>
        </view>
        <view class="archives-list">
          <view
            v-for="(item, index) in archives.data"
            :key="index"
            :style="{
              'margin-top': index !== 0 ? '35rpx' : '0',
            }"
          >
            <view class="archives-date">
              <text>{{ item.year }} 年 {{ item.month | month }} 月</text>
            </view>
            <view class="archives-items">
              <view
                v-for="(post, postIndex) in item.posts"
                :key="postIndex"
                @click="navigateToPostDetail(post)"
                class="archives-item flex justify-between items-stretch"
                hover-class="default-hover-class"
              >
                <view class="archives-post-title self-center">
                  <text>{{ post.title }}</text>
                </view>
                <view class="archives-post-day self-center flex justify-end">
                  <text>{{ post.createTime | day }} 日</text>
                </view>
              </view>
            </view>
          </view>
          <view v-if="archives.data.length <= 0 && !archives.loading">
            <cl-default />
          </view>
        </view>
      </view>
    </view>
  </base-page>
</template>
<script>
// apis
import categoryApi from "@/apis/category";
import archiveApi from "@/apis/archive";
import tagApi from "@/apis/tag";

// components
import PostTag from "@/components/page/post/post-tag";

// mixins
import navigate from "@/mixins/navigate";
export default {
  name: "Discovery",
  components: {
    PostTag,
  },
  filters: {
    day(date) {
      if (!date) {
        return;
      }
      const day = new Date(date).getDate();
      return day < 10 ? "0" + day : day;
    },
  },
  data() {
    return {
      categories: {
        data: [],
        loading: false,
      },
      tags: {
        data: [],
        loading: false,
      },
      archives: {
        data: [],
        loading: false,
      },
      search: {
        keyword: null,
      },
    };
  },
  onLoad() {
    this.$refs.basePage.showLoading();
    this.handleListCategories();
    this.handleListTags();
    this.handleListArchives();
  },
  onPullDownRefresh() {
    this.search.keyword = null;
    this.handleListCategories();
    this.handleListTags();
    this.handleListArchives();
  },
  mixins: [navigate],
  methods: {
    /**
     * 获取所有分类
     */
    handleListCategories() {
      this.categories.loading = true;
      categoryApi
        .list(true)
        .then((response) => {
          this.categories.data = response.data.data;
        })
        .finally(() => {
          this.categories.loading = false;
          uni.stopPullDownRefresh();
          this.$refs.basePage.hideLoading();
        });
    },

    /**
     * 获取所有标签
     */
    handleListTags() {
      this.tags.loading = true;
      tagApi
        .list(true)
        .then((response) => {
          this.tags.data = response.data.data;
        })
        .finally(() => {
          this.tags.loading = false;
          uni.stopPullDownRefresh();
          this.$refs.basePage.hideLoading();
        });
    },

    /**
     * 获取文章归档数据
     */
    handleListArchives() {
      this.archives.loading = true;
      archiveApi
        .listByMonths()
        .then((response) => {
          this.archives.data = response.data.data;
        })
        .finally(() => {
          this.archives.loading = false;
          uni.stopPullDownRefresh();
          this.$refs.basePage.hideLoading();
        });
    },

    /**
     * 跳转到文章搜索页面
     */
    handleNavigateToSearchPosts() {
      // if (!this.search.keyboard || this.search.keyboard === "") {
      //   return;
      // }
      uni.navigateTo({
        url: `/pages/package-post/search-posts?keyword=${this.search.keyword}`,
      });
    },
  },
  onShareAppMessage() {
    return {
      title: this.envPageTitle,
      path: `/pages/package-main/tabbar/discovery`,
    };
  },
};
</script>

<style lang="scss" scoped>
.categories-wrap {
  .empty {
    padding: 20rpx 24rpx;
    background: #fff;
  }
  .categories-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20rpx;
    padding: 20rpx 24rpx;
    background: #fff;
    .categories-item {
      text-align: center;
      position: relative;
      flex-direction: column;
      justify-content: center;
      height: 180rpx;
      overflow: hidden;
      border-radius: 16rpx;

      .card-image-box {
        display: flex;
        flex: 1;
        flex-direction: row;
        overflow: hidden;
        height: 100%;
        .card-image {
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

      .card-text {
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
}

.tags-wrap {
  .tags-list {
    padding: 10rpx 24rpx;
    background: #fff;
    .tags-item {
      display: inline-block;
      margin-top: 5rpx;
      margin-bottom: 5rpx;
    }
  }
}

.archives-wrap {
  .archives-list {
    padding: 20rpx 24rpx;
    background: #fff;
    .archives-date {
      font-weight: 500;
      color: #333;
      font-size: 30rpx;
    }

    .archives-items {
      margin-top: 15rpx;
      .archives-item {
        margin-top: 10rpx;
        font-size: 28rpx;

        .archives-post-title {
          color: #333;
        }
        .archives-post-day {
          width: 200rpx;
          color: #999;
        }
      }
    }
  }
}
</style>
