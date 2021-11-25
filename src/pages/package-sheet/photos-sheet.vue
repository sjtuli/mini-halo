<template>
  <base-page ref="basePage">
    <view class="safe-area-inset-bottom">
      <page-meta>
        <navigation-bar :loading="list.loading" />
      </page-meta>
      <cl-sticky>
        <view class="bg-white">
          <view class="section-padding">
            <cl-search
              v-model="list.params.keyword"
              :show-search-button="false"
              placeholder="输入关键字搜索"
              @search="handleFilter()"
              @clear="handleFilter()"
            ></cl-search>
          </view>
        </view>
      </cl-sticky>
      <view class="photos-container">
        <view
          v-for="(item, index) in list.data"
          :key="index"
          @click="handlePreviewImages(index)"
        >
          <view class="photo-card">
            <view class="photo-cover-box">
              <image
                class="photo-cover-image"
                :src="item.url"
                mode="aspectFill"
              />
            </view>
            <view class="photo-cover-meta">
              <view class="meta-title">
                <text class="text-line-2">{{ item.name }}</text>
              </view>
              <view v-if="item.takeTime" class="meta-others">
                <text>{{ item.takeTime | datetime }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="list.total <= 0 && !list.loading">
        <cl-default />
      </view>
      <view style="margin: 20rpx 0" v-if="list.total > 0">
        <cl-loadmore
          background-color="#f2f5f7"
          :loading="list.loading"
          :finish="!list.hasNext"
          color="#e2dada"
          width="300rpx"
        ></cl-loadmore>
      </view>
    </view>
  </base-page>
</template>
<script>
// apis
import photoApi from "@/apis/photo";
export default {
  name: "PhotosSheet",
  data() {
    return {
      list: {
        data: [],
        params: {
          page: 0,
          size: 10,
          keyword: null,
        },
        loading: false,
        total: 0,
        hasNext: false,
      },
    };
  },
  onLoad() {
    this.$refs.basePage.showLoading();
    this.handleListPhotos();
  },
  onPullDownRefresh() {
    this.list.params.page = 0;
    this.handleListPhotos();
  },
  onReachBottom() {
    if (this.list.hasNext) {
      this.list.params.page++;
      this.handleListPhotos(false);
    }
  },
  computed: {
    photoUrls() {
      return this.list.data.map((item) => {
        return item.url;
      });
    },
  },
  methods: {
    /**
     * 获取图片列表
     */
    handleListPhotos(refresh = true) {
      this.list.loading = true;
      photoApi
        .list(this.list.params)
        .then((response) => {
          if (refresh) {
            this.list.data = response.data.data.content;
          } else {
            this.list.data = this.list.data.concat(response.data.data.content);
          }
          this.list.total = response.data.data.total;
          this.list.hasNext = response.data.data.hasNext;
        })
        .finally(() => {
          this.list.loading = false;
          this.$refs.basePage.hideLoading();
          uni.stopPullDownRefresh();
        });
    },

    /**
     * 根据关键词筛选
     */
    handleFilter() {
      this.list.params.page = 0;
      this.handleListPhotos();
    },

    /**
     * 点击预览图片
     */
    handlePreviewImages(current) {
      uni.previewImage({
        current: current,
        urls: this.photoUrls,
        indicator: "number",
      });
    },
  },
  onShareAppMessage() {
    return {
      title: "图库",
      path: `/pages/package-sheet/photos-sheet`,
    };
  },
};
</script>
<style lang="scss" scoped>
.photos-container {
  .photo-card {
    position: relative;
    flex-direction: column;
    justify-content: center;
    height: 420rpx;
    overflow: hidden;

    .photo-cover-box {
      display: flex;
      flex: 1;
      flex-direction: row;
      overflow: hidden;
      height: 100%;

      .photo-cover-image {
        flex: 1;
      }
    }
    .photo-cover-meta {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: $uni-spacing-col-base $uni-spacing-col-lg;
      background-color: $uni-bg-color-mask;
      .meta-title {
        text {
          font-size: 32rpx;
          color: #fff;
          font-weight: bold;
        }
      }
      .meta-others {
        font-size: 26rpx;
        margin-top: 10rpx;
        color: #f2f2f2;
      }
    }
  }
}
</style>
