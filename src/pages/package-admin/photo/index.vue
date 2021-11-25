<template>
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
      <view class="photos-list">
        <view
          class="photos-item section"
          v-for="(item, index) in list.data"
          :key="index"
        >
          <view class="photos-image-wrap">
            <view class="photos-image-box">
              <image :src="item.url" mode="aspectFill" />
            </view>
          </view>
          <view class="photos-title-wrap flex justify-between items-stretch">
            <view class="self-center" style="width: 50%">
              <text class="text-line-1">{{ item.name }}</text>
            </view>
            <view class="flex self-center">
              <view
                class="title-btn-edit"
                hover-class="default-hover-class"
                @click="handleNavigateToDetail(item)"
              >
                编辑
              </view>
              <view
                class="title-btn-delete"
                hover-class="default-hover-class"
                @click="handleDelete(item)"
              >
                删除
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="list.total <= 0 && !list.loading">
      <cl-default />
    </view>
    <view class="section" v-if="list.total > 0">
      <uni-pagination
        title="标题文字"
        :total="list.total"
        :pageSize="10"
        v-model="list.pagination.page"
        @change="handlePagination"
      ></uni-pagination>
    </view>
    <floating-button @onClick="handleNavigateToAttachmentsSelect()" />
  </view>
</template>
<script>
// apis
import adminPhotoApi from "@/apis/admin/photo";

// components
import FloatingButton from "@/components/page/button/floating-button";
export default {
  name: "AdminPhotoIndex",
  components: {
    FloatingButton,
  },
  data() {
    return {
      list: {
        data: [],
        params: {
          page: 0,
          size: 10,
          keyword: null,
        },
        pagination: {
          page: 1,
        },
        loading: false,
        total: 0,
        hasNext: false,
      },
    };
  },
  onLoad() {
    this.handleListPhotos();
  },
  onPullDownRefresh() {
    this.handleListPhotos();
  },
  methods: {
    /**
     * 获取图片列表
     */
    handleListPhotos() {
      this.list.loading = true;

      this.list.params.page = this.list.pagination.page - 1;

      adminPhotoApi
        .list(this.list.params)
        .then((response) => {
          this.list.data = response.data.data.content;
          this.list.total = response.data.data.total;
          this.list.hasNext = response.data.data.hasNext;
        })
        .finally(() => {
          this.list.loading = false;
          uni.stopPullDownRefresh();
        });
    },

    /**
     * 跳转到图片详情
     */
    handleNavigateToDetail(photo) {
      const _this = this;
      uni.navigateTo({
        url: `/pages/package-admin/photo/detail?id=${photo.id}`,
        events: {
          onReloadPhotoList: function () {
            _this.handleListPhotos();
          },
        },
      });
    },

    /**
     * 删除图片
     */
    handleDelete(photo) {
      const _this = this;
      uni.showModal({
        title: "提示",
        content: "是否确定删除该图片？",
        success(option) {
          if (option.confirm) {
            adminPhotoApi
              .delete(photo.id)
              .then(() => {
                uni.showToast({
                  title: "删除成功",
                });
              })
              .finally(() => {
                _this.handleListPhotos();
              });
          }
        },
      });
    },

    /**
     * 跳转到附件管理页面选择
     */
    handleNavigateToAttachmentsSelect() {
      const _this = this;
      uni.navigateTo({
        url: "/pages/package-admin/attachment/index?mode=select",
        events: {
          onSelectAttachment: function (data) {
            let params = {};
            params.name = data.attachment.name;
            params.thumbnail = data.attachment.thumbPath;
            params.url = data.attachment.path;
            params.takeTime = new Date().getTime();
            adminPhotoApi
              .create(params)
              .then(() => {
                uni.showToast({
                  title: "添加成功",
                });
              })
              .finally(() => {
                _this.handleListPhotos();
              });
          },
        },
      });
    },

    /**
     * 分页
     */
    handlePagination(e) {
      this.$log.debug("Handle pagination:", e);
      this.list.pagination.page = e.current;
      this.handleListPhotos();
    },

    /**
     * 根据关键词筛选
     */
    handleFilter() {
      this.list.params.page = 0;
      this.handleListPhotos();
    },
  },
};
</script>
<style lang="scss" scoped>
.photos-container {
  .photos-item {
    display: flex;
    flex: 1;
    background-color: #fff;
    flex-direction: column;
    border-radius: 16rpx;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;

    .photos-image-wrap {
      flex-direction: column;
      justify-content: center;
      position: relative;
      height: 340rpx;
      overflow: hidden;

      .photos-image-box {
        display: flex;
        flex: 1;
        flex-direction: row;
        overflow: hidden;
        height: 100%;
        image {
          flex: 1;
        }
      }
    }
    .photos-title-wrap {
      padding: 20rpx 24rpx;

      text {
        font-size: 30rpx;
        color: #333;
        font-weight: bold;
      }

      .title-btn-edit {
        margin-right: 20rpx;
        font-weight: normal;
        font-size: 28rpx;
        color: $uni-text-color-placeholder;
      }

      .title-btn-delete {
        font-weight: normal;
        font-size: 28rpx;
        color: $uni-color-error;
      }
    }
  }
}
</style>
