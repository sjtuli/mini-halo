<template>
  <view class="safe-area-inset-bottom">
    <page-meta>
      <navigation-bar :title="pageTitle" :loading="list.loading" />
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
    <view class="attachment-list-wrap">
      <view
        class="attachment-item section"
        v-for="(item, index) in list.data"
        :key="index"
        hover-class="default-hover-class"
        @click="handleClickAttachment(item)"
        @longpress="handleShowActions(item)"
      >
        <view
          v-if="isImage(item)"
          class="attachment-thumb flex-none self-center"
        >
          <view class="attachment-image-box">
            <image :src="item.thumbPath" mode="aspectFill" />
          </view>
        </view>
        <view class="attachment-metas flex-grow self-center">
          <view class="attachment-title">
            <text class="text-line-1">{{ item.name }}</text>
          </view>
          <view class="attachment-description">
            <text>上传于 {{ item.createTime | datetime }}</text>
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
    <floating-button @onClick="handleChooseFileToUpload()" />
    <cl-loading-mask
      :loading="upload.loading"
      :text="upload.text"
    ></cl-loading-mask>
  </view>
</template>
<script>
// apis
import adminAttachmentApi from "@/apis/admin/attachment";

// components
import FloatingButton from "@/components/page/button/floating-button";
export default {
  name: "AdminAttachmentIndex",
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
      upload: {
        loading: false,
        text: "",
      },
      mode: "manage", // manage or select
    };
  },
  onLoad(options) {
    if (options.mode) {
      this.mode = options.mode;
    }
    this.handleListAttachments();
  },
  onPullDownRefresh() {
    this.list.params.page = 0;
    this.handleListAttachments();
  },
  computed: {
    isImage() {
      return function (attachment) {
        var mediaType = attachment.mediaType;
        if (mediaType) {
          var prefix = mediaType.split("/")[0];
          return prefix === "image";
        }
        return false;
      };
    },
    pageTitle() {
      return this.mode === "manage" ? "附件管理" : "附件选择";
    },
  },
  methods: {
    /**
     * 获取附件列表
     */
    handleListAttachments() {
      this.list.loading = true;

      this.list.params.page = this.list.pagination.page - 1;

      adminAttachmentApi
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
     * 点击选择附件
     */
    handleClickAttachment(attachment) {
      if (this.mode === "manage") {
        this.handleNavigateToDetail(attachment);
      } else {
        this.handleSelectAttachment(attachment);
      }
    },

    /**
     * 跳转到附件详情页面
     */
    handleNavigateToDetail(attachment) {
      const _this = this;
      uni.navigateTo({
        url: `/pages/package-admin/attachment/detail?id=${attachment.id}`,
        events: {
          onReloadAttachmentList: function () {
            _this.handleListAttachments();
          },
        },
      });
    },

    /**
     * 选择附件
     */
    handleSelectAttachment(attachment) {
      if (!this.isImage(attachment)) {
        uni.showModal({
          title: "提示",
          content: "只能选择图片类型的附件",
          showCancel: false,
        });
        return;
      }

      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit("onSelectAttachment", {
        attachment: attachment,
      });
      uni.navigateBack();
    },

    /**
     * 显示操作选项
     */
    handleShowActions(attachment) {
      const _this = this;
      uni.showActionSheet({
        itemList: ["复制链接", "复制 Markdown 语法", "删除"],
        success(res) {
          if (res.tapIndex === 0) {
            uni.setClipboardData({
              data: `${encodeURI(attachment.path)}`,
            });
          } else if (res.tapIndex === 1) {
            uni.setClipboardData({
              data: `![${attachment.name}](${encodeURI(attachment.path)})`,
            });
          } else if (res.tapIndex === 2) {
            uni.showModal({
              title: "提示",
              content: "是否确定删除该附件？",
              success(option) {
                if (option.confirm) {
                  adminAttachmentApi
                    .delete(attachment.id)
                    .then(() => {
                      uni.showToast({
                        title: "删除成功",
                      });
                    })
                    .finally(() => {
                      _this.handleListAttachments();
                    });
                }
              },
            });
          }
        },
      });
    },

    /**
     * 选择文件上传
     */
    handleChooseFileToUpload() {
      const _this = this;
      uni.chooseImage({
        count: 9,
        sourceType: ["album", "camera"],
        success: (response) => {
          _this.handleUploadAttachment(response.tempFilePaths, 0);
        },
      });
    },

    /**
     * 文件上传
     */
    handleUploadAttachment(tempFilePaths, index) {
      this.upload.loading = true;
      this.upload.text = `正在上传第 ${index + 1}/${
        tempFilePaths.length
      } 个文件`;
      adminAttachmentApi
        .upload(tempFilePaths[index], false)
        .then(() => {
          if (tempFilePaths.length + 1 !== index) {
            this.handleUploadAttachment(tempFilePaths, index + 1);
          } else {
            this.upload.loading = false;
            this.handleListAttachments();
          }
        })
        .catch(() => {
          this.upload.loading = false;
          this.handleListAttachments();
        });
    },

    /**
     * 根据关键词筛选
     */
    handleFilter() {
      this.list.params.page = 0;
      this.handleListAttachments();
    },

    /**
     * 分页
     */
    handlePagination(e) {
      this.$log.debug("Handle pagination:", e);
      this.list.pagination.page = e.current;
      this.handleListAttachments();
    },
  },
};
</script>
<style lang="scss" scoped>
.attachment-list-wrap {
  .attachment-item {
    display: flex;
    flex: 1;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    .attachment-thumb {
      height: 150rpx;
      width: 220rpx;
      overflow: hidden;
      .attachment-image-box {
        display: flex;
        overflow: hidden;
        height: 100%;
        .card-image {
          flex: 1;
        }
      }
    }

    .attachment-metas {
      padding: 24rpx 32rpx;
      .attachment-title {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
      }

      .attachment-description {
        margin-top: 12rpx;
        font-size: 26rpx;
        color: #7b7777;
      }
    }
  }
}
</style>
